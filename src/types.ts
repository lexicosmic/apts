import * as tf from "@tensorflow/tfjs";
import Game from "./engine/Game";
import ResNet from "./engine/ResNet";

/// Common
export type TensorLikeArray =
	| number
	| number[]
	| number[][]
	| number[][][]
	| number[][][][]
	| number[][][][][]
	| number[][][][][][];

export enum GameName {
	TicTacToe = "tictactoe",
	ConnectFour = "connect4",
}

/// Interface
export enum GameMode {
	PvP = "Player vs. Player",
	PvC = "Player vs. Computer",
	CvC = "Computer vs. Computer",
}

/// Engine
export type LogMessage = (message: string) => void;

// export interface MonteCarloTreeSearchParams {
// 	readonly numSearches: number;
// 	readonly explorationConstant: number;
// }

// export interface SelfPlayMemoryParams extends MonteCarloTreeSearchParams {
// 	numSelfPlayIterations: number;
// }

export enum WorkName {
	MCTSCommon = "testMCTSCommon",
	Structure = "testResNetStructure",
	Blind = "testBlindTraining",
	BuildMemory = "buildTrainingMemory",
	CreateModel = "createModel",
}

export interface TrainModelParams {
	numIterations: number;
	numEpochs: number;
	batchSize: number;
	learningRate: number;
}

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

// export type TrainingFunction = (params: TrainingFunctionParams) => Promise<any>;

/// Export
// export type ParamsToExport_TrainingData = SelfPlayMemoryParams & {
// 	id: string;
// 	memoryLength: number;
// 	model: ParamsToExport_BuildModel | null;
// };

// export type ParamsToExport_BuildModel = {
// 	resNet: ResNetBuildModelParams;
// 	memory: (ParamsToExport_TrainingData | {})[];
// 	training: TrainModelParams;
// };

/// Database
export enum ModelType {
	Structure = "structure",
	Blind = "blind",
	SelfPlay = "selfPlay",
	Uploaded = "uploaded",
}

export interface ModelInfo {
	game: GameName;
	type: ModelType;
	innerPath: string;
	name: string;
}

export interface ModelFileContent extends ModelInfo {
	layersModel: tf.LayersModel;
	weights: Float32Array[];
}

export interface SerializedModel {
	game: string;
	type: string;
	innerPath: string;
	name: string;
	layersModel: string;
	weights: string[];
}
