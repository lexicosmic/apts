import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';
import fs from 'fs';

const game = new TicTacToe();

const params = {
	explorationConstant: 2,
	numSearches: 60,
	numIterations: 3,
	numSelfPlayIterations: 25,
	numEpochs: 4,
	batchSize: 64,
	learningRate: 0.001,
};
const resNet = new ResNet({game, numResBlocks: 4, numHiddenChannels: 64});
const alphaZero = new AlphaZero(resNet, game, params);

const currentTime = new Date().valueOf();
const modelDirectory = `models/selfplay_${currentTime}`;
try {
	fs.mkdirSync(`./${modelDirectory}`);
} catch (e) {
	console.error(e);
}
await alphaZero.learn(modelDirectory);
