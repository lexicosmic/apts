import { GameName, LogMessage, ModelInfo } from "../types";
import Game from "../engine/Game";
import ResNet from "../engine/ResNet";

export enum WorkName {
	MCTSCommon = "testMCTSCommon",
	Structure = "testResNetStructure",
	Blind = "testBlindTraining",
	BuildMemory = "buildTrainingMemory",
	CreateModel = "createModel",
}

/// Parameters of the functions that perform some work related to models
export interface TrainingParams_MCTS_Base {
	logMessage: LogMessage;
	game: Game;
}
export interface TrainingParams_MCTS extends TrainingParams_MCTS_Base {
	workName: WorkName.MCTSCommon;
}

export interface TrainingParams_StructureBlind_Base
	extends TrainingParams_MCTS_Base {
	fileSystemProtocol: string;
}
export interface TrainingParams_StructureBlind
	extends TrainingParams_StructureBlind_Base {
	workName: WorkName.Structure | WorkName.Blind;
}

export interface TrainingParams_BuildMemoryCreateModel_Base
	extends TrainingParams_StructureBlind_Base {
	resNet: ResNet;
	numSearches: number;
	explorationConstant: number;
	numSelfPlayIterations: number;
}
export interface TrainingParams_BuildMemoryCreateModel
	extends TrainingParams_BuildMemoryCreateModel_Base {
	workName: WorkName.BuildMemory | WorkName.CreateModel;
}

export type TrainingParams =
	| TrainingParams_MCTS
	| TrainingParams_StructureBlind
	| TrainingParams_BuildMemoryCreateModel;

/// Parameters of the handlers that call the functions that perform some work related to models
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

/// Other types used by workers
export enum WorkerStatus {
	Ready = "ready",
	Working = "working",
	Finished = "finished",
	Error = "error",
}
export interface WorkerMessage {
	status: WorkerStatus;
	text: string;
}
