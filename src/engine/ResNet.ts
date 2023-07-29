import * as tf from '@tensorflow/tfjs-node';
import TicTacToe from './TicTacToe.js';

export default class ResNet {
	// Attributes
	readonly game: TicTacToe;
	readonly numResBlocks: number; // Length of the backbone
	readonly numHidden: number;
	readonly startBlock: tf.Sequential;
	readonly backbone = Array<ResBlock>();
	readonly policyHead;
	readonly valueHead;

	constructor(game: TicTacToe, numResBlocks: number, numHidden: number) {
		this.game = game;
		this.numResBlocks = numResBlocks;
		this.numHidden = numHidden;

		this.startBlock = tf.sequential({
			layers: [
				tf.layers.conv2d({
					filters: this.numHidden,
					kernelSize: 3,
					padding: 'same',
					inputShape: [game.rowCount, game.columnCount, 3],
				}),
				tf.layers.batchNormalization(),
				tf.layers.activation({activation: 'relu'}),
			],
		});

		for (let i = 0; i < this.numResBlocks; i++)
			this.backbone.push(new ResBlock(this.numHidden));

		this.policyHead = tf.sequential({
			layers: [
				tf.layers.conv2d({
					filters: 32,
					kernelSize: 3,
					padding: 'same',
					inputShape: [game.rowCount, game.columnCount, numHidden],
				}),
				tf.layers.batchNormalization(),
				tf.layers.activation({activation: 'relu'}),
				tf.layers.flatten(),
				tf.layers.dense({units: game.rowCount * game.columnCount * 32}),
				tf.layers.dense({units: game.actionSize}),
			],
		});

		this.valueHead = tf.sequential({
			layers: [
				tf.layers.conv2d({
					filters: 3,
					kernelSize: 3,
					padding: 'same',
					inputShape: [game.rowCount, game.columnCount, numHidden],
				}),
				tf.layers.batchNormalization(),
				tf.layers.activation({activation: 'relu'}),
				tf.layers.flatten(),
				tf.layers.dense({units: game.rowCount * game.columnCount * 3}),
				tf.layers.dense({units: 1, activation: 'tanh'}),
			],
		});
	}

	call(input: tf.Tensor): [tf.Tensor, tf.Tensor] {
		let value = this.startBlock.apply(input) as tf.Tensor;
		for (const resBlock of this.backbone) value = resBlock.call(value);
		const policy = this.policyHead.apply(value) as tf.Tensor;
		const valueHead = this.valueHead.apply(value) as tf.Tensor;
		return [policy, valueHead];
	}
}

class ResBlock extends tf.layers.Layer {
	readonly convolution1: tf.layers.Layer;
	readonly normalization1: tf.layers.Layer;
	readonly convolution2: tf.layers.Layer;
	readonly normalization2: tf.layers.Layer;

	constructor(numHidden: number) {
		super({
			name: 'ResBlock',
		});
		this.convolution1 = tf.layers.conv2d({
			filters: numHidden,
			kernelSize: 3,
			padding: 'same',
			activation: 'relu',
		});
		this.normalization1 = tf.layers.batchNormalization();
		this.convolution2 = tf.layers.conv2d({
			filters: numHidden,
			kernelSize: 3,
			padding: 'same',
			activation: 'relu',
		});
		this.normalization2 = tf.layers.batchNormalization();
	}

	override call(input: tf.Tensor): tf.Tensor {
		const residual = input;
		let value = this.convolution1.apply(input) as tf.Tensor;
		value = this.normalization1.apply(value) as tf.Tensor;
		value = tf.relu(value) as tf.Tensor;
		value = this.convolution2.apply(value) as tf.Tensor;
		value = this.normalization2.apply(value) as tf.Tensor;
		value = tf.add(value, residual) as tf.Tensor;
		value = tf.relu(value) as tf.Tensor;
		return value;
	}
}
