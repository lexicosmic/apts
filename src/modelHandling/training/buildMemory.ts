import * as tf from "@tensorflow/tfjs";
import ResNet from "../../engine/ResNet.js";
import { TrainingFunctionParams } from "../../types.js";
import AlphaZero from "../../engine/AlphaZero.js";

// const game = gameParams.game;
// const path = `file://models/${gameParams.mainModelDirectory}/model.json`;
// const model = await tf.loadLayersModel(path); // Use model previously trained
// const resNet = new ResNet(game, { model });
// const alphaZero = new AlphaZero(game, resNet, monteCarloTreeSearchParams);

// const memory = await alphaZero.buildTrainingMemory(
// 	selfPlayMemoryParams.numSelfPlayIterations,
// 	true,
// 	true
// );
// writeTrainingData(memory, gameParams.mainModelDirectory, selfPlayMemoryParams);

interface BuildTrainingMemoryParams extends TrainingFunctionParams {
	resNet: ResNet;
	numSearches: number;
	explorationConstant: number;
}
export default async function buildTrainingMemory({
	logMessage,
	game,
	resNet,
	numSearches,
	explorationConstant,
}: BuildTrainingMemoryParams) {
	const alphaZeroTraining = new AlphaZero(
		game,
		resNet,
		numSearches,
		explorationConstant
	);

	const { encodedStates, policyTargets, valueTargets } =
		await alphaZeroTraining.buildTrainingMemory({
			numSelfPlayIterations: 1,
			progressStep: 50,
			showMemorySize: true,
			logMessage,
		});
}
