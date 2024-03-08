import { JobParams_CreateModel_Base } from "../types.js";
import { standardFileProtocol } from "../../util.js";
import Trainer from "../../engine/Trainer.js";

export default async function createModel({
	logMessage,
	game,
	fileSystemProtocol = standardFileProtocol,
	resNet,
	numSearches,
	explorationConstant,
	maxNumIterations,
	numEpochs,
	batchSize,
	learningRate,
	trainingMemories,
}: JobParams_CreateModel_Base) {
	const trainer = new Trainer(game, resNet, numSearches, explorationConstant);
	logMessage("=-= APTS LEARNING =-=");

	await trainer.learn({
		fileSystemProtocol,
		logMessage,
		maxNumIterations,
		numEpochs,
		batchSize,
		learningRate,
		trainingMemories,
	});
}
