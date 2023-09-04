import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import {
	MonteCarloTreeSearchParams,
	ResNetBuildModelParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types.ts';
import TicTacToe from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';

const resNetParams: ResNetBuildModelParams = {
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
let trainModelParams: TrainModelParams | {} = {};

const game = new TicTacToe();
const path = 'file://models/main_model/model.json';
const model = await tf.loadLayersModel(path); // Use the model trained in the previous step
const resNet = new ResNet(game, {model});
const alphaZero = new AlphaZero(resNet, game, monteCarloTreeSearchParams);

const memory = await alphaZero.buildTrainingMemory(
	selfPlayMemoryParams.numSelfPlayIterations,
	true,
	true,
);

try {
	const parametersString = fs
		.readFileSync('./models/main_model/parameters.json')
		.toString();
	trainModelParams = JSON.parse(parametersString).trainModelParams;
} catch (e) {
	console.error(e);
}

const paramsToExport = {
	resNetParams: resNetParams,
	selfPlayMemoryParams: selfPlayMemoryParams,
	trainModelParams: trainModelParams,
};

const currentTime = new Date().valueOf();
try {
	fs.mkdirSync(`./trainingData/trainingData_${currentTime}`);
	fs.writeFileSync(
		`./trainingData/trainingData_${currentTime}/trainingData.json`,
		JSON.stringify(memory),
	);
	fs.writeFileSync(
		`./trainingData/trainingData_${currentTime}/parameters.json`,
		JSON.stringify(paramsToExport),
	);
} catch (e) {
	console.error(e);
}
