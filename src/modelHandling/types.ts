import { GameName, LogMessage, ModelInfo } from "../types";
import Game from "../engine/Game";
import ResNet from "../engine/ResNet";

export enum JobName {
	MCTSCommon = "testMCTSCommon",
	Structure = "testResNetStructure",
	Blind = "testBlindTraining",
	BuildMemory = "buildTrainingMemory",
	CreateModel = "createModel",
}

/// Parameters of the functions that perform some work related to models
export interface JobParams_MCTS_Base {
	logMessage: LogMessage;
	game: Game;
}
export interface JobParams_MCTS extends JobParams_MCTS_Base {
	jobName: JobName.MCTSCommon;
}

export interface JobParams_StructureBlind_Base extends JobParams_MCTS_Base {
	fileSystemProtocol: string;
}
export interface JobParams_StructureBlind
	extends JobParams_StructureBlind_Base {
	jobName: JobName.Structure | JobName.Blind;
}

export interface JobParams_BuildMemoryCreateModel_Base
	extends JobParams_StructureBlind_Base {
	resNet: ResNet;
	numSearches: number;
	explorationConstant: number;
	numSelfPlayIterations: number;
}
export interface JobParams_BuildMemoryCreateModel
	extends JobParams_BuildMemoryCreateModel_Base {
	jobName: JobName.BuildMemory | JobName.CreateModel;
}

export type JobParams =
	| JobParams_MCTS
	| JobParams_StructureBlind
	| JobParams_BuildMemoryCreateModel;

/// Parameters of the handlers that call the functions that perform some work related to models
interface HandleWorkParams_MCTS_Base {
	gameName: GameName;
}
interface HandleWorkParams_MCTS extends HandleWorkParams_MCTS_Base {
	jobName: JobName.MCTSCommon;
}

interface HandleWorkParams_StructureBlind_Base
	extends HandleWorkParams_MCTS_Base {
	fileSystemProtocol: string;
}
interface HandleWorkParams_TestResNetStructure
	extends HandleWorkParams_StructureBlind_Base {
	jobName: JobName.Structure | JobName.Blind;
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
	jobName: JobName.BuildMemory | JobName.CreateModel;
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
