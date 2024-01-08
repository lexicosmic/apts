import Game from "./engine/Game";

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
export interface ResNetBuildModelParams {
	numResBlocks: number; // Length of the backbone
	numHiddenChannels: number; // Number of channels in each block
}

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

/// Export
export type ParamsToExport_TrainingData = SelfPlayMemoryParams & {
	id: string;
	memoryLength: number;
	model: ParamsToExport_BuildModel | null;
};

export type ParamsToExport_BuildModel = {
	resNet: ResNetBuildModelParams;
	memory: (ParamsToExport_TrainingData | {})[];
	training: TrainModelParams;
};

export interface TrainingFunctionParams {
	printMessage: (message: string) => void;
	game: Game;
}

export type TestingFunction = ({
	printMessage,
	game,
}: TrainingFunctionParams) => Promise<void>;

/// Database
export enum ModelType {
	Structure = "structure",
	Blind = "blind",
	selfPlay = "selfPlay",
}

export type ModelInfo = {
	path: string;
	game: GameName;
	type: ModelType;
};
