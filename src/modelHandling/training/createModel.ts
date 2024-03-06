import { TrainingParams_BuildMemoryCreateModel_Base } from "../types.js";
import { standardFileProtocol } from "../../util.js";
import Trainer from "../../engine/Trainer.js";

export default async function createModel({
	logMessage,
	game,
	fileSystemProtocol = standardFileProtocol,
	resNet,
	numSearches,
	explorationConstant,
}: TrainingParams_BuildMemoryCreateModel_Base) {
	const trainer = new Trainer(game, resNet, numSearches, explorationConstant);
	logMessage("=-= APTS LEARNING =-=");
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
	// await trainer.learn(
	// 	modelDirectory,
	// 	selfPlayMemoryParams.numSelfPlayIterations,
	// 	trainModelParams,
	// 	trainingMemoryBatch
	// );
}
