import { v4 as uuidv4 } from "uuid";
import { JobParams_BuildMemoryCreateModel_Base } from "../types.js";
import Trainer from "../../engine/Trainer.js";
import { DBOperations_Memories } from "../../database.js";

export default async function buildTrainingMemory({
	logMessage,
	game,
	resNet,
	numSearches,
	explorationConstant,
	numSelfPlayIterations,
}: JobParams_BuildMemoryCreateModel_Base) {
	const trainer = new Trainer(game, resNet, numSearches, explorationConstant);

	logMessage("=-= APTS BUILDING MEMORY =-=");
	const trainingMemory = await trainer.buildTrainingMemory({
		numSelfPlayIterations,
		progressStep: 1,
		showMemorySize: true,
		logMessage,
	});

	const id = uuidv4();

	const storedMemory = {
		id,
		game: game.getName(),
		trainingMemory,
		name: `Memory ${id}`,
		length: trainingMemory.encodedStates.length,
	};

	DBOperations_Memories.put(
		storedMemory,
		() => {},
		() => {
			throw new Error("An error occurred when saving memory to IndexedDB");
		}
	);
}
