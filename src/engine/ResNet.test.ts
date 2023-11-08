import * as tf from '@tensorflow/tfjs-node';
import ResNet from './ResNet.ts';
import TicTacToe from './TicTacToe.ts';

describe('ResNet', () => {
	let game: TicTacToe;
	let numResBlocks: number;
	let numHiddenChannels: number;
	let resNet: ResNet;

	beforeEach(() => {
		game = new TicTacToe();
		numResBlocks = 3;
		numHiddenChannels = 64;
		resNet = new ResNet(game, {numResBlocks, numHiddenChannels});
	});

	describe('call', () => {
		it('should return two tensors for policy and value heads', () => {
			// Set up a test input tensor
			const input: tf.Tensor4D = tf.randomNormal([
				1,
				game.rowCount,
				game.columnCount,
				3,
			]);

			// Call the ResNet's call method
			const [policyHead, valueHead] = resNet.predict(input);

			// Make assertions on the returned tensors
			expect(policyHead instanceof tf.Tensor).toBe(true);
			expect(valueHead instanceof tf.Tensor).toBe(true);
			expect(policyHead.shape).toEqual([1, game.getActionSize()]);
			expect(valueHead.shape).toEqual([1, 1]);
		});
	});
});

// TODO: Fix this test
// describe('ResBlock', () => {
// 	let numHidden: number;
// 	let resBlock: tf.Sequential;

// 	beforeEach(() => {
// 		numHidden = 64;
// 		const input: tf.Tensor = tf.randomNormal([1, 8, 8, numHidden]);
// 		resBlock = getResBlock(8, 8, numHidden, input, 0);
// 	});

// 	describe('call', () => {
// 		it('should return a tensor with the same shape as the input tensor', () => {
// 			// Set up a test input tensor
// 			const input: tf.Tensor = tf.randomNormal([1, 8, 8, numHidden]);

// 			// Call the ResBlock's call method
// 			const output: tf.Tensor = resBlock.predict(input) as tf.Tensor;

// 			// Make assertions on the returned tensor
// 			expect(output instanceof tf.Tensor).toBe(true);
// 			expect(output.shape).toEqual(input.shape);
// 		});
// 	});
// });
