import {
	HandleWorkParams,
	JobName,
	WorkerMessage,
	WorkerStatus,
} from "./types";
import { ModelInfo } from "../types";
import { getFullModelPath, loadGame, retrieveResNetModel } from "../util";
import Game from "../engine/Game";
import ResNet from "../engine/ResNet";
import testMCTSCommon from "./testing/testMCTSCommon";
import testResNetStructure from "./testing/testResNetStructure";
import testBlindTraining from "./testing/testBlindTraining";
import buildTrainingMemory from "./training/buildMemory";
import createModel from "./training/createModel";

self.onmessage = async (e) => {
	const params: HandleWorkParams = e.data;
	const game = loadGame(params.gameName);

	switch (params.jobName) {
		case JobName.MCTSCommon: {
			const promise = testMCTSCommon({
				logMessage: (text) => sendWorkingMessage(text),
				game,
			});
			promise
				.then(() => sendFinishedMessage("MCTS common"))
				.catch((error) => sendErrorMessage(error.toString()));
			break;
		}
		case JobName.Structure: {
			const { fileSystemProtocol } = params;
			const promise = testResNetStructure({
				logMessage: (text) => sendWorkingMessage(text),
				game,
				fileSystemProtocol,
			});
			promise
				.then(() => sendFinishedMessage("ResNet structure"))
				.catch((error) => sendErrorMessage(error.toString()));
			break;
		}
		case JobName.Blind: {
			const { fileSystemProtocol } = params;
			const promise = testBlindTraining({
				logMessage: (text) => sendWorkingMessage(text),
				game,
				fileSystemProtocol,
			});
			promise
				.then(() => sendFinishedMessage("Blind training"))
				.catch((error) => sendErrorMessage(error.toString()));
			break;
		}
		case JobName.BuildMemory: {
			let resNet = await getResNet(game, params.modelInfo);
			const {
				fileSystemProtocol,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			} = params;
			const promise = buildTrainingMemory({
				logMessage: (text) => sendWorkingMessage(text),
				game,
				fileSystemProtocol,
				resNet,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			});
			promise
				.then(() => sendFinishedMessage("Memory building"))
				.catch((error) => sendErrorMessage(error.toString()));
			break;
		}
		case JobName.CreateModel: {
			let resNet = await getResNet(game, params.modelInfo);
			const {
				fileSystemProtocol,
				numSearches,
				explorationConstant,
				maxNumIterations,
				numEpochs,
				batchSize,
				learningRate,
				trainingMemories,
			} = params;
			const promise = createModel({
				logMessage: (text) => sendWorkingMessage(text),
				game,
				fileSystemProtocol,
				resNet,
				numSearches,
				explorationConstant,
				maxNumIterations,
				numEpochs,
				batchSize,
				learningRate,
				trainingMemories,
			});
			promise
				.then(() => sendFinishedMessage("Model creation"))
				.catch((error) => sendErrorMessage(error.toString()));
			break;
		}
		default: {
			throw new Error(`Unknown jobName`);
		}
	}
};

function sendWorkingMessage(text: string) {
	const message = {
		text,
		status: WorkerStatus.Working,
	};
	sendMessage(message);
}

function sendFinishedMessage(legibleJobName: string) {
	const message = {
		text: `${legibleJobName} finished!`,
		status: WorkerStatus.Finished,
	};
	sendMessage(message);
}

function sendErrorMessage(text: string) {
	const message = {
		text,
		status: WorkerStatus.Error,
	};
	sendMessage(message);
}

function sendMessage(message: WorkerMessage) {
	self.postMessage(message);
}

async function getResNet(game: Game, modelInfo?: ModelInfo): Promise<ResNet> {
	if (modelInfo) {
		const modelPath = getFullModelPath(
			modelInfo.game,
			modelInfo.type,
			modelInfo.innerPath
		);
		return await retrieveResNetModel(game, modelPath);
	} else throw new Error(`ResNet could not be loaded`);
}
