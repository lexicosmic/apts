import {
	gameParams,
	resNetBuildModelParams,
	monteCarloTreeSearchParams,
	selfPlayMemoryParams,
	trainModelParams,
} from './parameters.ts';
import {loadTrainingData, writeModelParameters} from './util.ts';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';

const game = gameParams.game;
const resNet = new ResNet(game, resNetBuildModelParams);
const alphaZero = new AlphaZero(game, resNet, monteCarloTreeSearchParams);
const trainingMemoryBatch = loadTrainingData(gameParams.trainingDataIds);

const currentTime = new Date().valueOf();
const modelDirectory = `${gameParams.directoryName}/selfplay_${currentTime}`;

writeModelParameters(
	modelDirectory,
	gameParams.trainingDataIds,
	resNetBuildModelParams,
	trainModelParams,
);
await alphaZero.learn(
	modelDirectory,
	selfPlayMemoryParams.numSelfPlayIterations,
	trainModelParams,
	trainingMemoryBatch,
);
