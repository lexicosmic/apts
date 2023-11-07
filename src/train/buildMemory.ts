import * as tf from '@tensorflow/tfjs-node';
import ResNet from '../engine/ResNet.ts';
import AlphaZero from '../engine/AlphaZero.ts';
import {
	gameParams,
	mainModelDirectory,
	monteCarloTreeSearchParams,
	selfPlayMemoryParams,
} from './parameters.ts';
import {writeTrainingData} from './util.ts';

const game = gameParams.game;
const path = `file://models/${mainModelDirectory}/model.json`;
const model = await tf.loadLayersModel(path); // Use model previously trained
const resNet = new ResNet(game, {model});
const alphaZero = new AlphaZero(resNet, game, monteCarloTreeSearchParams);

const memory = await alphaZero.buildTrainingMemory(
	selfPlayMemoryParams.numSelfPlayIterations,
	true,
	true,
);
writeTrainingData(memory, mainModelDirectory, selfPlayMemoryParams);
