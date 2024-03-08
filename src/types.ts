import * as tf from "@tensorflow/tfjs";
import { TrainingMemory } from "./engine/Trainer";

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

export interface TrainModelParams {
	numIterations: number;
	numEpochs: number;
	batchSize: number;
	learningRate: number;
}

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
	Trained = "trained",
	Retrained = "retrained",
}

export interface ModelInfo {
	game: GameName;
	type: ModelType;
	innerPath: string;
	name: string;
}

export interface StoredMemory {
	id: string;
	game: GameName;
	trainingMemory: TrainingMemory;
	name: string;
	length: number;
}

/// Export

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
