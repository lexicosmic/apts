import * as tf from "@tensorflow/tfjs";
import { v4 as uuidv4 } from "uuid";
import { LogMessage, ModelType, TrainModelParams } from "../types.js";
import { getActionFromProbabilities } from "./util.js";
import Game, { ActionOutcome, EncodedState, Player, State } from "./Game.js";
import ResNet from "./ResNet.js";
import MonteCarloTreeSearch from "./MonteCarloTree.js";
import { getFormattedDate } from "../util.js";

type GameMemoryBlock = {
	state: State;
	actionProbabilities: number[];
	player: Player;
};
type GameMemory = GameMemoryBlock[];

export type TrainingMemory = {
	encodedStates: EncodedState[];
	policyTargets: number[][];
	valueTargets: ActionOutcome["value"][];
};

export default class Trainer {
	/// Attributes
	private game: Game;
	private resNet: ResNet;
	private mcts: MonteCarloTreeSearch;

	/// Constructor
	constructor(
		game: Game,
		resNet: ResNet,
		numSearches: number,
		explorationConstant: number
	) {
		this.game = game;
		this.resNet = resNet;
		this.mcts = new MonteCarloTreeSearch(
			this.game,
			this.resNet,
			numSearches,
			explorationConstant
		);
	}

	/// Methods
	/**
	 * Performs self-play to generate training data for the Trainer algorithm.
	 * @returns A promise that resolves to a TrainingMemory object containing the generated training data, composed by encoded states, policy targets, and value targets.
	 */
	private async selfPlay(): Promise<TrainingMemory> {
		let player = Player.X;
		const state = this.game.getInitialState();
		const gameMemory: GameMemory = [];

		while (true) {
			// Get the state from the perspective of the current player and save it in the game memory
			const neutralState = state.clone();
			neutralState.changePerspective(player, this.game.getOpponent(player));
			const actionProbabilities = this.mcts.search(neutralState);
			gameMemory.push({ state: neutralState, actionProbabilities, player });

			// Pick an action based on the probabilities from the MCTS
			const probabilitiesTensor = tf.tensor(actionProbabilities) as tf.Tensor1D;
			const pickedAction = getActionFromProbabilities(probabilitiesTensor);
			tf.dispose(probabilitiesTensor);
			const validActions = state.getValidActions();
			if (!validActions[pickedAction]) throw new Error("Invalid action picked");

			// Perform the action and check if the game is over
			state.performAction(pickedAction, player);
			const actionOutcome = Game.getActionOutcome(state, pickedAction);
			if (actionOutcome.isTerminal) {
				// When the game is over, construct the training memory from the perspective of the current player
				return this.convertGameMemoryToTrainingMemory(
					gameMemory,
					player,
					actionOutcome.value
				);
			}

			// If the game is not over, switch the player and continue
			player = this.game.getOpponent(player);
		}
	}

	// Transpose the game memory to a format that can be used to train the model
	private convertGameMemoryToTrainingMemory(
		gameMemory: GameMemory,
		lastPlayer: Player,
		lastActionValue: ActionOutcome["value"]
	): TrainingMemory {
		const trainingMemory: TrainingMemory = {
			encodedStates: [],
			policyTargets: [],
			valueTargets: [],
		};
		for (const memoryBlock of gameMemory) {
			// Get the outcome value from the perspective of the current player
			const memoryOutcomeValue =
				memoryBlock.player === lastPlayer
					? lastActionValue
					: this.game.getOpponentValue(lastActionValue);
			trainingMemory.encodedStates.push(memoryBlock.state.getEncodedState());
			trainingMemory.policyTargets.push(memoryBlock.actionProbabilities);
			trainingMemory.valueTargets.push(memoryOutcomeValue);
		}
		return trainingMemory;
	}

	/**
	 * Builds the training memory by self-playing the game for a specified number of iterations.
	 * @param numSelfPlayIterations The number of self-play iterations.
	 * @param progressStep The number of iterations between each progress message (default is 25).
	 * @param showMemorySize Whether to show the size of the training memory.
	 * @param logMessage The optional log message function (default is console.log).
	 * @returns A promise that resolves to the TrainingMemory object containing encoded states, policy targets, and value targets.
	 */
	public async buildTrainingMemory({
		numSelfPlayIterations,
		progressStep = 25,
		showMemorySize = false,
		logMessage = console.log,
	}: {
		numSelfPlayIterations: number;
		progressStep?: number;
		showMemorySize?: boolean;
		logMessage?: LogMessage;
	}): Promise<TrainingMemory> {
		const encodedStates = [];
		const policyTargets = [];
		const valueTargets = [];
		// Construct the training memory from self-playing the game
		for (let j = 0; j < numSelfPlayIterations; j++) {
			if (progressStep > 0 && (j + 1) % progressStep === 0)
				logMessage(`Self-play iteration ${j + 1}/${numSelfPlayIterations}`);
			const selfPlayMemory = await this.selfPlay();
			encodedStates.push(...selfPlayMemory.encodedStates);
			policyTargets.push(...selfPlayMemory.policyTargets);
			valueTargets.push(...selfPlayMemory.valueTargets);
		}
		if (showMemorySize) logMessage(`Memory size: ${encodedStates.length}`);
		return { encodedStates, policyTargets, valueTargets };
	}

	/**
	 * Trains the model using the provided training memory.
	 *
	 * @param trainingMemory - The training memory containing encoded states, policy targets, and value targets.
	 * @param batchSize - The size of each training batch.
	 * @param numEpochs - The number of training epochs.
	 * @param learningRate - The learning rate for the training.
	 * @param logMessage - Optional callback function for logging messages during training.
	 * @returns A promise that resolves to an array of training logs.
	 */
	private async train({
		trainingMemory,
		batchSize,
		numEpochs,
		learningRate,
		logMessage = console.log,
	}: {
		trainingMemory: TrainingMemory;
		batchSize: number;
		numEpochs: number;
		learningRate: number;
		logMessage?: LogMessage;
	}): Promise<tf.Logs[]> {
		// Convert the memory to a format that can be used to train the model
		const { encodedStates, policyTargets, valueTargets } = trainingMemory;
		const encodedStatesTensor = tf.tensor(encodedStates) as tf.Tensor4D;
		const policyTargetsTensor = tf.tensor(policyTargets) as tf.Tensor2D;
		//TODO: Check if this reshape is necessary
		const valueTargetsTensor = tf
			.tensor(valueTargets)
			.reshape([-1, 1]) as tf.Tensor2D;

		// Train the model
		const trainingLog = await this.resNet.train({
			inputsBatch: encodedStatesTensor,
			policyOutputsBatch: policyTargetsTensor,
			valueOutputsBatch: valueTargetsTensor,
			batchSize,
			numEpochs,
			learningRate,
			validationSplit: 0.1,
			logMessage,
		});

		// Dispose the tensors
		tf.dispose([encodedStatesTensor, policyTargetsTensor, valueTargetsTensor]);

		return trainingLog;
	}

	// Train the model multiple times
	public async learn({
		fileSystemProtocol,
		logMessage = console.log,
		maxNumIterations,
		numEpochs,
		batchSize,
		learningRate,
		trainingMemories,
	}: {
		fileSystemProtocol: string;
		logMessage: LogMessage;
		maxNumIterations: number;
		numEpochs: number;
		batchSize: number;
		learningRate: number;
		trainingMemories: TrainingMemory[];
	}): Promise<void> {
		const baseId = uuidv4();
		const maxIterations = Math.min(maxNumIterations, trainingMemories.length);
		for (let i = 0; i < maxIterations; i++) {
			logMessage(`ITERATION ${i + 1}/${maxIterations}`);
			await this.train({
				trainingMemory: trainingMemories[i],
				batchSize,
				numEpochs,
				learningRate,
				logMessage,
			});
			await this.resNet.save({
				protocol: fileSystemProtocol,
				type: ModelType.Trained,
				innerPath: `/trained/${baseId}/${i}`,
				name: `Trained ${getFormattedDate(new Date())}`,
			});
		}
	}
}
