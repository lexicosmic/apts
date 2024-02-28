import { TrainingParams_BuildMemoryCreateModel_Base } from "../types.js";
import Trainer from "../../engine/Trainer.js";

export default async function buildTrainingMemory({
	logMessage,
	game,
	resNet,
	numSearches,
	explorationConstant,
	numSelfPlayIterations,
}: TrainingParams_BuildMemoryCreateModel_Base) {
	const trainer = new Trainer(game, resNet, numSearches, explorationConstant);

	logMessage("=-=-=-=-=-=-=-= APTS BUILDING MEMORY =-=-=-=-=-=-=-=");
	const trainingMemoryPromise = await trainer.buildTrainingMemory({
		numSelfPlayIterations,
		progressStep: 1,
		showMemorySize: true,
		logMessage,
	});
	return trainingMemoryPromise;
}
