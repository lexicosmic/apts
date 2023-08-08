import * as tf from '@tensorflow/tfjs';
import TicTacToe from '../engine/TicTacToe.js';
import getResNet from '../engine/ResNet.js';

const game = new TicTacToe();

let state = game.getInitialState();
state = game.getNextState(state, 2, 1);
state = game.getNextState(state, 7, -1);

const resNet = getResNet(game, 4, 64);
await resNet.save('file://models/resnet-test');

// Calculate the policy and value from the neural network
const tensorState = tf
	.tensor(game.getEncodedState(state))
	.expandDims(0) as tf.Tensor4D;
const [policy, value] = resNet.predict(tensorState) as [
	tf.Tensor2D,
	tf.Tensor2D,
];
const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);

// Mask the policy to only allow valid actions
const validActions = game.getValidActions(state);
const maskedPolicy = softMaxPolicy.mul(tf.tensor(validActions).expandDims(0));
const sum = maskedPolicy.sum().arraySync() as number;
const actionProbabilities = maskedPolicy
	.div(sum)
	.squeeze()
	.arraySync() as number[];
const valueData = value.dataSync()[0];

// // Convert raw probabilities to log probabilities
// const logActionProbabilities = actionProbabilities.map(p => Math.log(p));
// const action = tf.tidy(() => {
// 	const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
// 	const actionIndex = tf.multinomial(actionTensor, 1).dataSync()[0];
// 	return actionIndex;
// });

// console.log('action', action);

// console.table(state);
// console.log(actionProbabilities);
// console.log(valueData);
