import Game from "./engine/Game";
import ResNet from "./engine/ResNet";

/// Common
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

export interface MonteCarloTreeSearchParams {
	readonly numSearches: number;
	readonly explorationConstant: number;
}

export interface SelfPlayMemoryParams extends MonteCarloTreeSearchParams {
	numSelfPlayIterations: number;
}

export interface TrainModelParams {
	numIterations: number;
	numEpochs: number;
	batchSize: number;
	learningRate: number;
}

export interface TrainingFunctionParams {
	logMessage: LogMessage;
	game: Game;
	fileSystemProtocol: string;
}

export type TestingFunction = ({
	logMessage,
	game,
	fileSystemProtocol,
}: TrainingFunctionParams) => Promise<void>;

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

export type ModelInfo = {
	game: GameName;
	type: ModelType;
	innerPath: string;
	name: string;
};

export type SerializedModel = {
	type: ModelType;
	innerPath: string;
	name: string;
	resNet: ResNet;
};
