import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';
import fs from 'fs';

const game = new TicTacToe();

const resNetParams = {game, numResBlocks: 4, numHiddenChannels: 64};
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

const memory = await alphaZero.buildTrainingMemory(true, true);

const currentTime = new Date().valueOf();
try {
	fs.writeFileSync(
		`./trainingData/trainingData_${currentTime}.json`,
		JSON.stringify(memory),
	);
} catch (e) {
	console.error(e);
}
