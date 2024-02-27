import ResNet from "../../engine/ResNet.js";
import { TrainingFunctionParams } from "../../types.js";
import AlphaZero, { TrainingMemory } from "../../engine/AlphaZero.js";

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
export type BuildTrainingMemory = (
	params: BuildTrainingMemoryParams
) => Promise<TrainingMemory>;
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

	logMessage("=-=-=-=-=-=-=-= AlphaZero BUILDING MEMORY =-=-=-=-=-=-=-=");
	const trainingMemory = await alphaZeroTraining.buildTrainingMemory({
		numSelfPlayIterations: 10,
		progressStep: 1,
		showMemorySize: true,
		logMessage,
	});

	return trainingMemory;
}
