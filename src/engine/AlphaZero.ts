import * as tf from "@tensorflow/tfjs";
import { LogMessage, TrainModelParams } from "../types.js";
import Game, {
	Action,
	ActionOutcome,
	EncodedState,
	Player,
	State,
} from "./Game.js";
import ResNet from "./ResNet.js";
import MonteCarloTreeSearch from "./MonteCarloTree.js";

type GameMemoryBlock = {
	state: State;
	actionProbabilities: number[];
	player: Player;
};
type GameMemory = GameMemoryBlock[];

type TrainMemoryBlock = {
	encodedState: EncodedState;
	actionProbabilities: number[];
	outcomeValue: ActionOutcome["value"];
};
export type TrainingMemory = TrainMemoryBlock[];

export default class AlphaZero {
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
	private async selfPlay(): Promise<TrainingMemory> {
		let player = Player.X;
		let state = this.game.getInitialState();
		const gameMemory: GameMemory = [];

		while (true) {
			// Get the state from the perspective of the current player and save it in the game memory
			const neutralState = State.clone(state);
			neutralState.changePerspective(player, this.game.getOpponent(player));
			const actionProbabilities = this.mcts.search(neutralState);
			gameMemory.push({ state: neutralState, actionProbabilities, player });

			// Pick an action based on the probabilities from the MCTS
			const logActionProbabilities = actionProbabilities.map((p) =>
				Math.log(p)
			);
			const pickedAction: Action = tf.tidy(() => {
				const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
				const actionIndex = tf
					.multinomial(actionTensor, 1)
					.dataSync()[0] as Action;
				return actionIndex;
			});
			if (!state.getValidActions()[pickedAction])
				throw new Error("Invalid action picked");

			// Perform the action and check if the game is over
			state.performAction(pickedAction, player);
			const actionOutcome = Game.getActionOutcome(state, pickedAction);

			if (actionOutcome.isTerminal) {
				// When the game is over, construct the training memory from the perspective of the current player
				const trainingMemory: TrainingMemory = [];
				for (const memoryBlock of gameMemory) {
					// Get the outcome value from the perspective of the current player
					const memoryOutcomeValue =
						memoryBlock.player === player
							? actionOutcome.value
							: this.game.getOpponentValue(actionOutcome.value);
					trainingMemory.push({
						encodedState: memoryBlock.state.getEncodedState(),
						actionProbabilities: memoryBlock.actionProbabilities,
						outcomeValue: memoryOutcomeValue,
					});
				}
				return trainingMemory;
			}

			// If the game is not over, switch the player and continue
			player = this.game.getOpponent(player);
		}
	}

	// Transpose the training memory to a format that can be used to train the model
	private transposeMemory(trainingMemory: TrainingMemory): {
		encodedStates: EncodedState[];
		policyTargets: number[][];
		valueTargets: ActionOutcome["value"][];
	} {
		const encodedStates: EncodedState[] = [];
		const policyTargets: number[][] = [];
		const valueTargets: ActionOutcome["value"][] = [];
		for (const {
			encodedState,
			actionProbabilities,
			outcomeValue,
		} of trainingMemory) {
			encodedStates.push(encodedState);
			policyTargets.push(actionProbabilities);
			valueTargets.push(outcomeValue);
		}
		return { encodedStates, policyTargets, valueTargets };
	}

	// Build the training memory by self-playing the game
	public async buildTrainingMemory(
		numSelfPlayIterations: number,
		showProgress = false,
		showMemorySize = false
	): Promise<TrainingMemory> {
		const memory: TrainingMemory = [];
		// Construct the training memory from self-playing the game
		for (let j = 0; j < numSelfPlayIterations; j++) {
			if (showProgress && (j + 1) % 25 === 0)
				console.log(`Self-play iteration ${j + 1}/${numSelfPlayIterations}`);
			const selfPlayMemory = await this.selfPlay();
			memory.push(...selfPlayMemory);
		}
		if (showMemorySize) console.log(`Memory size: ${memory.length}`);
		return memory;
	}

	// Train the model using the training memory
	private async train(
		memory: TrainingMemory,
		batchSize: number,
		numEpochs: number,
		learningRate: number
	): Promise<tf.Logs[]> {
		// Convert the memory to a format that can be used to train the model
		const { encodedStates, policyTargets, valueTargets } =
			this.transposeMemory(memory);

		// Convert the memory into tensors
		const encodedStatesTensor = tf.tensor(encodedStates) as tf.Tensor4D;
		const policyTargetsTensor = tf.tensor(policyTargets) as tf.Tensor2D;
		const valueTargetsTensor = tf
			.tensor(valueTargets)
			.reshape([-1, 1]) as tf.Tensor2D;

		// Train the model
		const trainingLog = await this.resNet.train(
			encodedStatesTensor,
			policyTargetsTensor,
			valueTargetsTensor,
			batchSize,
			numEpochs,
			learningRate
		);

		// Dispose the tensors
		tf.dispose([encodedStatesTensor, policyTargetsTensor, valueTargetsTensor]);

		return trainingLog;
	}

	// Train the model multiple times
	public async learn(
		fileSystemProtocol: string,
		logMessage: LogMessage = console.log,
		targetPath: string,
		numSelfPlayIterations: number,
		trainModelParams: TrainModelParams,
		trainingMemoryArray?: TrainingMemory[]
	): Promise<void> {
		logMessage("=-=-=-=-=-=-=-= AlphaZero LEARNING =-=-=-=-=-=-=-=");

		for (let i = 0; i < trainModelParams.numIterations; i++) {
			// console.log(`ITERATION ${i + 1}/${trainModelParams.numIterations}`);
			// let memory;
			// if (
			// 	typeof trainingMemoryArray === "undefined" ||
			// 	typeof trainingMemoryArray[i] === "undefined"
			// )
			// 	memory = await this.buildTrainingMemory(numSelfPlayIterations, true);
			// else memory = trainingMemoryArray[i];
			// const trainingLog = await this.train(
			// 	memory,
			// 	trainModelParams.batchSize,
			// 	trainModelParams.numEpochs,
			// 	trainModelParams.learningRate
			// );
			// // Save the model architecture and optimizer weights
			// await this.resNet.save(
			// 	fileSystemProtocol,
			// 	`file://models/${directoryName}/iteration_${i}`
			// );
			// try {
			// 	fs.writeFileSync(
			// 		`./models/${directoryName}/iteration_${i}/trainingLog.json`,
			// 		JSON.stringify(trainingLog)
			// 	);
			// } catch (e) {
			// 	console.error(e);
			// }
		}
	}
}
