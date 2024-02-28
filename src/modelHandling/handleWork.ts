import { GameName, ModelInfo, WorkName } from "../types";
import { getFullModelPath } from "../util";
import { loadGame, retrieveResNetModel } from "../interface/util";
import Game from "../engine/Game";
import ResNet from "../engine/ResNet";
import testMCTSCommon from "./testing/testMCTSCommon";
import testResNetStructure from "./testing/testResNetStructure";
import testBlindTraining from "./testing/testBlindTraining";
import buildTrainingMemory from "./training/buildMemory";
import createModel from "./training/createModel";

interface HandleWorkParams_MCTS_Base {
	gameName: GameName;
}
interface HandleWorkParams_MCTS extends HandleWorkParams_MCTS_Base {
	workName: WorkName.MCTSCommon;
}

interface HandleWorkParams_StructureBlind_Base
	extends HandleWorkParams_MCTS_Base {
	fileSystemProtocol: string;
}
interface HandleWorkParams_TestResNetStructure
	extends HandleWorkParams_StructureBlind_Base {
	workName: WorkName.Structure | WorkName.Blind;
}

interface HandleWorkParams_BuildMemoryCreateModel_Base
	extends HandleWorkParams_StructureBlind_Base {
	modelInfo: ModelInfo;
	numSearches: number;
	explorationConstant: number;
	numSelfPlayIterations: number;
}
interface HandleWorkParams_BuildMemoryCreateModel
	extends HandleWorkParams_BuildMemoryCreateModel_Base {
	workName: WorkName.BuildMemory | WorkName.CreateModel;
}

export type HandleWorkParams =
	| HandleWorkParams_MCTS
	| HandleWorkParams_TestResNetStructure
	| HandleWorkParams_BuildMemoryCreateModel;

self.onmessage = async (e) => {
	const params: HandleWorkParams = e.data;
	const game = loadGame(params.gameName);

	switch (params.workName) {
		case "testMCTSCommon": {
			testMCTSCommon({ logMessage: sendMessage, game });
			break;
		}
		case "testResNetStructure": {
			const { fileSystemProtocol } = params;
			testResNetStructure({
				logMessage: sendMessage,
				game,
				fileSystemProtocol,
			});
			break;
		}
		case "testBlindTraining": {
			const { fileSystemProtocol } = params;
			testBlindTraining({ logMessage: sendMessage, game, fileSystemProtocol });
			break;
		}
		case "buildTrainingMemory": {
			let resNet = await getResNet(game, params.modelInfo);
			const {
				fileSystemProtocol,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			} = params;
			buildTrainingMemory({
				logMessage: sendMessage,
				game,
				fileSystemProtocol,
				resNet,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			});
			break;
		}
		case "createModel": {
			let resNet = await getResNet(game, params.modelInfo);
			const {
				fileSystemProtocol,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			} = params;
			createModel({
				logMessage: sendMessage,
				game,
				fileSystemProtocol,
				resNet,
				numSearches,
				explorationConstant,
				numSelfPlayIterations,
			});
			break;
		}
		default: {
			throw new Error(`Unknown workName`);
		}
	}
};

function sendMessage(message: string) {
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
