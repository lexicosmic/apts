import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero, {TrainingMemory} from '../engine/AlphaZero.ts';
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

const trainingMemoryBatch: TrainingMemory[] = [];

const currentTime = new Date().valueOf();
const modelDirectory = `selfplay_${currentTime}`;
try {
	fs.mkdirSync(`./models/${modelDirectory}`);
	const firstBlock = fs
		.readFileSync('./trainingData/trainingData_1693374609309.json')
		.toString();
	const secondBlock = fs
		.readFileSync('./trainingData/trainingData_1693374959753.json')
		.toString();
	const thirdBlock = fs
		.readFileSync('./trainingData/trainingData_1693376930463.json')
		.toString();
	const fourthBlock = fs
		.readFileSync('./trainingData/trainingData_1693729283658.json')
		.toString();
	trainingMemoryBatch.push(JSON.parse(firstBlock));
	trainingMemoryBatch.push(JSON.parse(secondBlock));
	trainingMemoryBatch.push(JSON.parse(thirdBlock));
	trainingMemoryBatch.push(JSON.parse(fourthBlock));
} catch (e) {
	console.error(e);
}

await alphaZero.learn(modelDirectory, trainingMemoryBatch);
