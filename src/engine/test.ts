import * as tf from '@tensorflow/tfjs';
import TicTacToe from './TicTacToe.js';
import ResNet from './ResNet.js';

const game = new TicTacToe();
let state = game.getInitialState();
state = game.getNextState(state, 2, 1);
state = game.getNextState(state, 7, -1);
const model = new ResNet(game, 4, 64);

// Calculate the policy and value from the neural network
const tensorState = tf.tensor(game.getEncondedState(state)).expandDims(0);
const [policy, value] = model.call(tensorState);
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

console.table(state);
console.log(actionProbabilities);
console.log(valueData);
