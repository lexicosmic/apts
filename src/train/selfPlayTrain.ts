import fs from 'fs';
import {
	ResNetBuildModelParams,
	MonteCarloTreeSearchParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types.ts';
import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero, {TrainingMemory} from '../engine/AlphaZero.ts';

const resNetBuildModelParams: ResNetBuildModelParams = {
	numResBlocks: 4,
	numHiddenChannels: 64,
};
const monteCarloTreeSearchParams: MonteCarloTreeSearchParams = {
	explorationConstant: 2,
	numSearches: 60,
};
const selfPlayMemoryParams: SelfPlayMemoryParams = {
	...monteCarloTreeSearchParams,
	numSelfPlayIterations: 1000,
};
const trainModelParams: TrainModelParams = {
	numIterations: 3,
	numEpochs: 4,
	batchSize: 64,
	learningRate: 0.0001,
};
const paramsToExport = {
	resNetParams: resNetBuildModelParams,
	selfPlayMemoryParams: selfPlayMemoryParams,
	trainModelParams: trainModelParams,
};

const game = new TicTacToe();
const resNet = new ResNet(game, resNetBuildModelParams);
const alphaZero = new AlphaZero(resNet, game, monteCarloTreeSearchParams);

const trainingMemoryBatch: TrainingMemory[] = [];

const currentTime = new Date().valueOf();
const modelDirectory = `selfplay_${currentTime}`;
try {
	fs.mkdirSync(`./models/${modelDirectory}`);
	const firstBlock = fs
		.readFileSync('./trainingData/trainingData_1693822474325/trainingData.json')
		.toString();
	const secondBlock = fs
		.readFileSync('./trainingData/trainingData_1693822676517/trainingData.json')
		.toString();
	const thirdBlock = fs
		.readFileSync('./trainingData/trainingData_1693822689263/trainingData.json')
		.toString();
	trainingMemoryBatch.push(JSON.parse(firstBlock));
	trainingMemoryBatch.push(JSON.parse(secondBlock));
	trainingMemoryBatch.push(JSON.parse(thirdBlock));

	fs.writeFileSync(
		`./models/${modelDirectory}/parameters.json`,
		JSON.stringify(paramsToExport),
	);
} catch (e) {
	console.error(e);
}

await alphaZero.learn(
	modelDirectory,
	selfPlayMemoryParams.numSelfPlayIterations,
	trainModelParams,
	trainingMemoryBatch,
);
