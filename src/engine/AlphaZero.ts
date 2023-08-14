import * as tf from '@tensorflow/tfjs-node';
import ResNet from './ResNet.js';
import Game, {
	Action,
	ActionOutcome,
	Player,
	State,
	EncodedState,
} from './TicTacToe.ts';
import MonteCarloTreeSearch, {
	MonteCarloTreeSearchParams,
} from './MonteCarloTree.ts';

type GameMemoryBlock = {
	state: State;
	actionProbabilities: number[];
	player: Player;
};
type GameMemory = GameMemoryBlock[];

type TrainingMemoryBlock = {
	encodedState: State[];
	actionProbabilities: number[];
	outcomeValue: ActionOutcome['value'];
};
type TrainingMemory = TrainingMemoryBlock[];

interface AlphaZeroSearchParams extends MonteCarloTreeSearchParams {
	numIterations: number;
	numSelfPlayIterations: number;
	numEpochs: number;
	batchSize: number;
	learningRate: number;
}

export default class AlphaZero {
	/// Attributes
	readonly model: ResNet;
	readonly game: Game;
	readonly params: AlphaZeroSearchParams;

	readonly mcts: MonteCarloTreeSearch;

	/// Constructor
	constructor(model: ResNet, game: Game, params: AlphaZeroSearchParams) {
		this.model = model;
		this.game = game;
		this.params = params;

		this.mcts = new MonteCarloTreeSearch(this.game, this.model, {
			explorationConstant: this.params.explorationConstant,
			numSearches: this.params.numSearches,
		});
	}

	/// Methods

	async #selfPlay(): Promise<TrainingMemory> {
		let player = Player.X;
		let state = this.game.getInitialState();
		const gameMemory: GameMemory = [];

		while (true) {
			// Get the state from the perspective of the current player and save it in the game memory
			const neutralState = this.game.changePerspective(state, player);
			const actionProbabilities = this.mcts.search(neutralState);
			gameMemory.push({state: neutralState, actionProbabilities, player});

			// Pick an action based on the probabilities from the MCTS
			const logActionProbabilities = actionProbabilities.map(p => Math.log(p));
			const pickedAction: Action = tf.tidy(() => {
				const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
				const actionIndex = tf
					.multinomial(actionTensor, 1)
					.dataSync()[0] as Action;
				return actionIndex;
			});

			// Perform the action and check if the game is over
			state = this.game.getNextState(state, pickedAction, player);
			const actionOutcome = this.game.getActionOutcome(state, pickedAction);

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
						encodedState: this.game.getEncodedState(memoryBlock.state),
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
	#transposeMemory(trainingMemory: TrainingMemory) {
		const encodedStates: EncodedState[] = [];
		const policyTargets: number[][] = [];
		const valueTargets: ActionOutcome['value'][] = [];
		for (const {
			encodedState,
			actionProbabilities,
			outcomeValue,
		} of trainingMemory) {
			encodedStates.push(encodedState);
			policyTargets.push(actionProbabilities);
			valueTargets.push(outcomeValue);
		}
		return {encodedStates, policyTargets, valueTargets};
	}

	async #train(memory: TrainingMemory) {
		// Convert the memory to a format that can be used to train the model
		const {encodedStates, policyTargets, valueTargets} =
			this.#transposeMemory(memory);

		// Convert the memory into tensors
		const encodedStatesTensor = tf.tensor(encodedStates) as tf.Tensor4D;
		const policyTargetsTensor = tf.tensor(policyTargets) as tf.Tensor2D;
		const valueTargetsTensor = tf
			.tensor(valueTargets)
			.reshape([-1, 1]) as tf.Tensor2D;

		// Train the model
		await this.model.train(
			encodedStatesTensor,
			policyTargetsTensor,
			valueTargetsTensor,
			this.params.batchSize,
			this.params.numEpochs,
			this.params.learningRate,
		);

		// Dispose the tensors
		tf.dispose([encodedStatesTensor, policyTargetsTensor, valueTargetsTensor]);
	}

	async learn() {
		console.log('=-=-=-=-=-=-=-= AlphaZero LEARNING =-=-=-=-=-=-=-=');

		for (let i = 0; i < this.params.numIterations; i++) {
			console.log(`ITERATION ${i + 1}/${this.params.numIterations}`);
			const memory: TrainingMemory = [];

			// Construct the training memory from self-playing the game
			for (let j = 0; j < this.params.numSelfPlayIterations; j++) {
				const selfPlayMemory = await this.#selfPlay();
				memory.push(...selfPlayMemory);
			}
			console.log(`Memory size: ${memory.length}`);
			await this.#train(memory);

			// Save the model architecture and optimizer weights
			await this.model.save(`file://models/alphazero_it${i}`);
		}
	}
}
