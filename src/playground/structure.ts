import * as tf from '@tensorflow/tfjs-node';
import ResNet from '../engine/ResNet.ts';
import {gameParams} from '../train/parameters.ts';

// Set game and state data
const game = gameParams.game;
const state = game.getInitialState();

// Build model and save it
const resNet = new ResNet(game, {numResBlocks: 4, numHiddenChannels: 64});
resNet.summary();
await resNet.save(`file://models/${gameParams.directoryName}/structure`);

// Play a few moves
state.print();
state.performAction(2, 1);
state.print();
state.performAction(6, -1);
state.print();

// Calculate the policy and value from the neural network
const encodedState = state.getEncodedState();
const tensorState = tf.tensor(encodedState).expandDims(0) as tf.Tensor4D;
const [policy, value] = resNet.predict(tensorState);
const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);

// Mask the policy to only allow valid actions
const validActions = state.getValidActions();
const maskedPolicy = softMaxPolicy.mul(tf.tensor(validActions).expandDims(0));
const sum = maskedPolicy.sum().arraySync() as number;
const actionProbabilities = maskedPolicy
	.div(sum)
	.squeeze()
	.arraySync() as number[];
const valueData = value.dataSync()[0];

// Convert raw probabilities to log probabilities
const logActionProbabilities = actionProbabilities.map(p => Math.log(p));
const action = tf.tidy(() => {
	const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
	const actionIndex = tf.multinomial(actionTensor, 1).dataSync()[0];
	return actionIndex;
});

// Log the results
console.table(state.getEncodedState());
console.log(actionProbabilities);
console.log('action', action);
console.log(valueData);
