import * as tf from '@tensorflow/tfjs';
import TicTacToe from '../engine/TicTacToe.js';
import ResNet from '../engine/ResNet.js';
import AlphaZero from '../engine/AlphaZero.js';

const game = new TicTacToe();
const model = new ResNet(game, 4, 64);
const optimizer = tf.train.adam(0.001);
const params = {
	explorationConstant: 2,
	numSearches: 60,
	numIterations: 3,
	numSelfPlayIterations: 10,
	numEpochs: 4,
	batchSize: 64,
};
model.compile({
	optimizer,
	loss: ['categoricalCrossentropy', 'meanSquaredError'],
	metrics: ['accuracy'],
});

const alphaZero = new AlphaZero(model, optimizer, game, params);
// alphaZero.learn();

console.log('\nstartBlock');
model.startBlock.weights.forEach(w => {
	console.log(w.name, w.shape);
});
console.log('\npolicyHead');
model.policyHead.weights.forEach(w => {
	console.log(w.name, w.shape);
});
console.log('\nvalueHead');
model.valueHead.weights.forEach(w => {
	console.log(w.name, w.shape);
});
