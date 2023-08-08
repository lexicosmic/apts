import * as tf from '@tensorflow/tfjs-node';
import TicTacToe from './TicTacToe.js';

const INPUT_CHANNELS = 3;

export default function getResNet(
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
		shape: [game.rowCount, game.columnCount, 3],
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
	model.summary();
	// model.add(startBlock);
	// // Successively applies ResBlocks to the model
	// for (let i = 0; i < numResBlocks; i++)
	// 	addResBlock(model, game.rowCount, game.columnCount, numHiddenChannels, i);
	// model.add(policyHead);
	return model;
}

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
}

// function addResBlock(
// 	model: tf.Sequential,
// 	dim1Size: number,
// 	dim2Size: number,
// 	numHiddenChannels: number,
// 	idNumber: number,
// ) {
// 	const convolution1 = tf.layers.conv2d({
// 		filters: numHiddenChannels,
// 		kernelSize: 3,
// 		padding: 'same',
// 		activation: 'relu',
// 		inputShape: [dim1Size, dim2Size, numHiddenChannels],
// 		name: `ResBlock_${idNumber}_convolution1`,
// 	});
// 	const normalization1 = tf.layers.batchNormalization({
// 		name: `ResBlock_${idNumber}_normalization1`,
// 	});
// 	const convolution2 = tf.layers.conv2d({
// 		filters: numHiddenChannels,
// 		kernelSize: 3,
// 		padding: 'same',
// 		activation: 'relu',
// 		name: `ResBlock_${idNumber}_convolution2`,
// 	});
// 	const normalization2 = tf.layers.batchNormalization({
// 		name: `ResBlock_${idNumber}_normalization2`,
// 	});
// 	model.add(
// 		tf.sequential({
// 			name: `ResBlock_${idNumber}`,
// 			layers: [convolution1, normalization1, convolution2, normalization2],
// 		}),
// 	);
// }
