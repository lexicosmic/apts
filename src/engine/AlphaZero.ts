import * as tf from '@tensorflow/tfjs';
import ResNet from './ResNet.js';
import Game, {Action, ActionOutcome, Player, State} from './TicTacToe.js';
import MonteCarloTreeSearch, {
	MonteCarloTreeSearchParams,
} from './MonteCarloTree.js';

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
}

export default class AlphaZero {
	// Attributes
	readonly model: ResNet;
	readonly optimizer: tf.AdamOptimizer;
	readonly game: Game;
	readonly params: AlphaZeroSearchParams;

	readonly mcts: MonteCarloTreeSearch;

	constructor(
		model: ResNet,
		optimizer: tf.AdamOptimizer,
		game: Game,
		params: AlphaZeroSearchParams,
	) {
		this.model = model;
		this.optimizer = optimizer;
		this.game = game;
		this.params = params;

		this.mcts = new MonteCarloTreeSearch(this.game, this.model, {
			explorationConstant: this.params.explorationConstant,
			numSearches: this.params.numSearches,
		});
	}

	/// Methods

	async selfPlay(): Promise<TrainingMemory> {
		let player = Player.X;
		let state = this.game.getInitialState();
		const memory: GameMemory = [];

		while (true) {
			const neutralState = this.game.changePerspective(state, player);
			const actionProbabilities = this.mcts.search(neutralState);
			memory.push({state: neutralState, actionProbabilities, player});

			const logActionProbabilities = actionProbabilities.map(p => Math.log(p));
			const action: Action = tf.tidy(() => {
				const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
				const actionIndex = tf
					.multinomial(actionTensor, 1)
					.dataSync()[0] as Action;
				return actionIndex;
			});

			state = this.game.getNextState(state, action, player);
			const actionOutcome = this.game.getActionOutcome(state, action);

			if (actionOutcome.isTerminal) {
				const trainingMemory: TrainingMemory = [];
				for (const memoryBlock of memory) {
					// Save the value based on the current perspective of the player
					const memoryOutcomeValue =
						memoryBlock.player === player
							? actionOutcome.value
							: this.game.getOpponentValue(actionOutcome.value);
					trainingMemory.push({
						encodedState: this.game.getEncondedState(memoryBlock.state),
						actionProbabilities: memoryBlock.actionProbabilities,
						outcomeValue: memoryOutcomeValue,
					});
				}
				return trainingMemory;
			}

			player = this.game.getOpponent(player);
		}
	}

	async train(memory: []) {}

	async learn() {
		for (let i = 0; i < this.params.numIterations; i++) {
			const memory: TrainingMemory = [];

			this.model.trainable = false;
			for (let j = 0; j < this.params.numSelfPlayIterations; j++) {
				const selfPlayMemory = await this.selfPlay();
				memory.push(...selfPlayMemory);
			}

			this.model.trainable = true;
			// for (let j = 0; j < this.params.numEpochs; j++) await this.train(memory);

			// Save the model architecture and optimizer weights
			await this.model.save(`file://models/alphazero_${i}`);
		}
	}
}
