import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';
import fs from 'fs';

const game = new TicTacToe();

const resNetParams = {game, numResBlocks: 4, numHiddenChannels: 64};
// const resNetParams = {game, path: 'file://models/main_model/model.json'};
const alphaZeroParams = {
	explorationConstant: 2,
	numSearches: 60,
	numIterations: 3,
	numSelfPlayIterations: 500,
	numEpochs: 4,
	batchSize: 64,
	learningRate: 0.001,
};
const resNet = new ResNet(resNetParams);
const alphaZero = new AlphaZero(resNet, game, alphaZeroParams);

const currentTime = new Date().valueOf();
const modelDirectory = `selfplay_${currentTime}`;
try {
	fs.mkdirSync(`./models/${modelDirectory}`);
} catch (e) {
	console.error(e);
}
await alphaZero.learn(modelDirectory);
