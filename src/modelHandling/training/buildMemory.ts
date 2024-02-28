import ResNet from "../../engine/ResNet.js";
import { TrainingParams_BuildMemoryCreateModel_Base } from "../../types.js";
import AlphaZero from "../../engine/AlphaZero.js";

export default async function buildTrainingMemory({
	logMessage,
	game,
	resNet,
	numSearches,
	explorationConstant,
	numSelfPlayIterations,
}: TrainingParams_BuildMemoryCreateModel_Base) {
	const alphaZeroTraining = new AlphaZero(
		game,
		resNet,
		numSearches,
		explorationConstant
	);

	logMessage("=-=-=-=-=-=-=-= AlphaZero BUILDING MEMORY =-=-=-=-=-=-=-=");
	const trainingMemoryPromise = await alphaZeroTraining.buildTrainingMemory({
		numSelfPlayIterations,
		progressStep: 1,
		showMemorySize: true,
		logMessage,
	});
	return trainingMemoryPromise;
}
