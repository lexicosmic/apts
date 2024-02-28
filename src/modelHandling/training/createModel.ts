import { TrainingParams_BuildMemoryCreateModel_Base } from "../../types.js";
import { standardFileProtocol } from "../../util.js";
import ResNet from "../../engine/ResNet.js";
import AlphaZero from "../../engine/AlphaZero.js";

export default async function createModel({
	logMessage,
	game,
	fileSystemProtocol = standardFileProtocol,
	resNet,
	numSearches,
	explorationConstant,
}: TrainingParams_BuildMemoryCreateModel_Base) {
	const alphaZero = new AlphaZero(
		game,
		resNet,
		numSearches,
		explorationConstant
	);
	// const trainingMemoryBatch = buildTrainingMemory({
	// 	logMessage,
	// 	game,
	// 	fileSystemProtocol,
	// 	resNet,
	// 	numSearches,
	// 	explorationConstant,
	// });

	// const modelDirectory = `${gameParams.directoryName}/selfplay_${currentTime}`;

	// writeModelParameters(
	// 	modelDirectory,
	// 	gameParams.trainingDataIds,
	// 	resNetBuildModelParams,
	// 	trainModelParams
	// );
	// await alphaZero.learn(
	// 	modelDirectory,
	// 	selfPlayMemoryParams.numSelfPlayIterations,
	// 	trainModelParams,
	// 	trainingMemoryBatch
	// );
}
