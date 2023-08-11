import * as tf from '@tensorflow/tfjs-node';
import TicTacToe from './TicTacToe.js';

const INPUT_CHANNELS = 3;

export default class ResNet {
	/// Attributes
	#model: tf.LayersModel;

	/// Constructor
	constructor(
		game: TicTacToe,
		numResBlocks: number, // Length of the backbone
		numHiddenChannels: number, // Number of channels in the backbone
	) {
		this.#model = getResNetModel(game, numResBlocks, numHiddenChannels);
	}

	/// Methods
	// getModel() {
	// 	return this.#model;
	// }

	// Saves the model to the given path, and returns a promise
	save(path: string) {
		return this.#model.save(path);
	}

	// Prints a summary of the model
	summary() {
		this.#model.summary();
	}

	// Disposes the model
	dispose() {
		this.#model.dispose();
	}

	// Compiles the model with the most proper optimizer and loss functions
	#compile(learningRate: number = 0.001) {
		this.#model.compile({
			optimizer: tf.train.adam(learningRate),
			loss: {
				policyHead: 'categoricalCrossentropy',
				valueHead: 'meanSquaredError',
			},
			metrics: ['accuracy'],
		});
	}

	// Prints the progress of the training
	#logProgress(epoch: number, logs: tf.Logs) {
		console.log(logs);
	}

	// Trains the model on the given batch of data
	async train(
		inputsBatch: tf.Tensor4D,
		policyOutputsBatch: tf.Tensor2D,
		valueOutputsBatch: tf.Tensor2D,
		batchSize: number,
		numEpochs: number,
		learningRate: number = 0.001,
		validationSplit: number = 0,
	) {
		this.#compile(learningRate);

		// Fit the model using the prepared training data
		await this.#model.fit(
			inputsBatch,
			[policyOutputsBatch, valueOutputsBatch],
			{
				shuffle: true, // Ensure data is shuffled again before using each time.
				validationSplit: validationSplit, // Use N% of the data for validation.
				batchSize: batchSize, // Update weights after every N examples.
				epochs: numEpochs, // Go over the data N times!
				callbacks: {
					onEpochEnd: (epoch, logs) => this.#logProgress(epoch, logs!),
				},
			},
		);

		// // Dispose the tensors
		// tf.dispose([inputsBatch, policyOutputsBatch, valueOutputsBatch]);

		// // Test the model
		// tf.tidy(() => {
		// 	this.#evaluate(
		// 		tf.tensor4d(
		// 			[
		// 				[
		// 					[
		// 						[1, 0, 0],
		// 						[0, 0, 0],
		// 						[0, 0, 0],
		// 					],
		// 					[
		// 						[0, 0, 0],
		// 						[0, 1, 0],
		// 						[0, 0, 0],
		// 					],
		// 					[
		// 						[0, 0, 0],
		// 						[0, 0, 0],
		// 						[0, 0, 1],
		// 					],
		// 				],
		// 			],
		// 			[1, 3, 3, 3],
		// 		),
		// 	);
		// });
	}

	// Evaluates the model on the given batch of data
	#evaluate(inputsBatch: tf.Tensor4D) {
		let answer = tf.tidy(() => {
			const [policy, value] = this.predict(inputsBatch);
			const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);
			// const argMaxPolicy = policy.squeeze([0]).argMax();
			return softMaxPolicy;
		});
	}

	// Makes a prediction on the given state, and returns the policy and value
	predict(state: tf.Tensor4D): [tf.Tensor2D, tf.Tensor2D] {
		return tf.tidy(() => {
			const outputs = this.#model.predict(state) as [tf.Tensor2D, tf.Tensor2D];
			return outputs;
		});
	}
}

// Build and return a residual model
function getResNetModel(
	game: TicTacToe,
	numResBlocks: number, // Length of the backbone
	numHiddenChannels: number, // Number of channels in the backbone
) {
	// Applies a convolutional layer to the input
	const startBlock = tf.sequential({
		name: 'startBlock',
		layers: [
			tf.layers.conv2d({
				filters: numHiddenChannels, // Produce as channels as set by numHiddenChannels
				kernelSize: 3, // 3x3 filter
				padding: 'same',
				inputShape: [game.rowCount, game.columnCount, INPUT_CHANNELS],
			}),
			tf.layers.batchNormalization(),
			tf.layers.activation({activation: 'relu'}),
		],
	});

	// Block that predicts the probability of each action
	const policyHead = tf.sequential({
		name: 'policyHead',
		layers: [
			tf.layers.conv2d({
				filters: 32, // Produce 32 channels
				kernelSize: 3, // 3x3 filter
				padding: 'same',
				inputShape: [game.rowCount, game.columnCount, numHiddenChannels], // Output of the backbone
			}),
			tf.layers.batchNormalization(),
			tf.layers.activation({activation: 'relu'}),
			tf.layers.flatten(),
			tf.layers.dense({units: game.rowCount * game.columnCount * 32}),
			tf.layers.dense({units: game.actionSize}), // Output of the policy head, i.e. the probability of each action
		],
	});

	// Block that predicts the outcome value of the state, i.e. the probability of winning
	const valueHead = tf.sequential({
		name: 'valueHead',
		layers: [
			tf.layers.conv2d({
				filters: 3, // Produce 3 channels
				kernelSize: 3, // 3x3 filter
				padding: 'same',
				inputShape: [game.rowCount, game.columnCount, numHiddenChannels], // Output of the backbone
			}),
			tf.layers.batchNormalization(),
			tf.layers.activation({activation: 'relu'}),
			tf.layers.flatten(),
			tf.layers.dense({units: game.rowCount * game.columnCount * 3}),
			tf.layers.dense({units: 1, activation: 'tanh'}), // Output of the value head, i.e. the probability of winning
		],
	});

	// Connecting parts of the model
	const inputLayer = tf.input({
		name: 'input',
		shape: [game.rowCount, game.columnCount, INPUT_CHANNELS],
	});

	const backbone = tf.sequential({
		name: 'backbone',
	});
	for (let i = 0; i < numResBlocks; i++)
		backbone.add(
			getResBlock(game.rowCount, game.columnCount, numHiddenChannels, i),
		);

	const policyOutput = policyHead.apply(
		backbone.apply(startBlock.apply(inputLayer)),
	) as tf.SymbolicTensor;
	const valueOutput = valueHead.apply(
		backbone.apply(startBlock.apply(inputLayer)),
	) as tf.SymbolicTensor;

	const model = tf.model({
		name: 'ResNet',
		inputs: inputLayer,
		outputs: [policyOutput, valueOutput],
	});
	return model;
}

// Build and return a residual block
function getResBlock(
	dim1Size: number,
	dim2Size: number,
	numHiddenChannels: number,
	idNumber: number,
) {
	const convolution1 = tf.layers.conv2d({
		filters: numHiddenChannels,
		kernelSize: 3,
		padding: 'same',
		activation: 'relu',
		inputShape: [dim1Size, dim2Size, numHiddenChannels],
		name: `ResBlock_${idNumber}_convolution1`,
	});
	const normalization1 = tf.layers.batchNormalization({
		name: `ResBlock_${idNumber}_normalization1`,
	});

	const convolution2 = tf.layers.conv2d({
		filters: numHiddenChannels,
		kernelSize: 3,
		padding: 'same',
		activation: 'relu',
		name: `ResBlock_${idNumber}_convolution2`,
	});
	const normalization2 = tf.layers.batchNormalization({
		name: `ResBlock_${idNumber}_normalization2`,
	});
	return tf.sequential({
		name: `ResBlock_${idNumber}`,
		layers: [convolution1, normalization1, convolution2, normalization2],
	});

	// TODO: apply the input to the blocks, preserving the ResNet structure
}
