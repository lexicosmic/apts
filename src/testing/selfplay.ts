import * as tf from '@tensorflow/tfjs-node';
import TicTacToe, {Player} from '../engine/TicTacToe.js';
import ResNet from '../engine/ResNet.js';
import AlphaZero from '../engine/AlphaZero.js';

const game = new TicTacToe();
let state = game.getInitialState();
state = game.getNextState(state, 0, Player.X);
state = game.getNextState(state, 4, Player.O);
state = game.getNextState(state, 5, Player.X);
state = game.getNextState(state, 8, Player.O);
game.printState(state);

// const model = new ResNet(game, 4, 64);
// const params = {
// 	explorationConstant: 2,
// 	numSearches: 60,
// 	numIterations: 3,
// 	numSelfPlayIterations: 10,
// 	numEpochs: 4,
// 	batchSize: 64,
// };
// model.compile({
// 	optimizer,
// 	loss: ['categoricalCrossentropy', 'meanSquaredError'],
// 	metrics: ['accuracy'],
// });

// const alphaZero = new AlphaZero(model, optimizer, game, params);
// alphaZero.learn();

const numHidden = 64;
const resNet = new ResNet(game, 4, numHidden);

const encodedState = game.getEncodedState(state);
const outcome = game.getActionOutcome(state, 2);
const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
const outputPolicyTensor = tf.tensor2d([[0, 0, 0, 0, 0, 0, 0, 0, 0]]); // N - Batch of outcomes
const outputValueTensor = tf.tensor2d([[outcome.value]]); // N - Batch of outcomes
await resNet.save(`file://models/alphazero_${0}`);
// train();
resNet.train(inputsTensor, outputPolicyTensor, outputValueTensor, 1, 30);
await resNet.save(`file://models/alphazero_${1}`);

// function evaluate() {
// 	// Clean up created tensors automatically.
// 	let answer = tf.tidy(function () {
// 		let newInput = tf.tensor4d([game.getEncodedState(game.getInitialState())]);
// 		let output = startBlock.predict(newInput) as tf.Tensor1D[];
// 		output[0]!.print();
// 		output[1]!.print();
// 		// return output.squeeze([0]).argMax();
// 	});
// }
