import * as tf from "@tensorflow/tfjs";
import ResNet from "../../engine/ResNet.js";
import AlphaZero from "../../engine/AlphaZero.js";
import {
	gameParams,
	monteCarloTreeSearchParams,
	selfPlayMemoryParams,
} from "../parameters.js";
import { writeTrainingData } from "../util.js";

const game = gameParams.game;
const path = `file://models/${gameParams.mainModelDirectory}/model.json`;
const model = await tf.loadLayersModel(path); // Use model previously trained
const resNet = new ResNet(game, { model });
const alphaZero = new AlphaZero(game, resNet, monteCarloTreeSearchParams);

const memory = await alphaZero.buildTrainingMemory(
	selfPlayMemoryParams.numSelfPlayIterations,
	true,
	true
);
writeTrainingData(memory, gameParams.mainModelDirectory, selfPlayMemoryParams);
