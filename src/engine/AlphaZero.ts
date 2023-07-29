import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import ResNet from './ResNet.js';
import Game from './TicTacToe.js';
import MonteCarloTreeSearch, {
	MonteCarloTreeSearchParams,
} from './MonteCarloTree.js';

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

	async selfPlay(): Promise<[]> {
		return [];
	}

	async train(memory: []) {}

	async learn() {
		for (let i = 0; i < this.params.numIterations; i++) {
			const memory = [];

			await this.model.save(`file://${__dirname}/model_${i}`);

			this.model.trainable = false;
			for (let j = 0; j < this.params.numSelfPlayIterations; j++) {
				const selfPlayMemory = await this.selfPlay();
				memory.push(...selfPlayMemory);
			}

			this.model.trainable = true;
			for (let j = 0; j < this.params.numEpochs; j++) await this.train(memory);

			await fs.promises.writeFile(
				`optimizer_${i}.json`,
				JSON.stringify(this.optimizer.getWeights()),
			);

			// // Save the model architecture and optimizer weights
			// const modelArchitecture = this.model.toJSON();
			// const modelArchitectureString = JSON.stringify(modelArchitecture);
			// localStorage.setItem(`model_${i}.json`, modelArchitectureString);

			// const optimizerWeights = await this.optimizer.getWeights();
			// for (let index = 0; index < optimizerWeights.length; index++) {
			// 	const weight = optimizerWeights[index];
			// 	const weightValues = await weight.array();
			// 	const weightValuesArray = Array.from(weightValues);
			// 	const weightValuesString = JSON.stringify(weightValuesArray);
			// 	localStorage.setItem(
			// 		`optimizer_${iteration}_weight_${index}.json`,
			// 		weightValuesString,
			// 	);
			// }
		}
	}
}
