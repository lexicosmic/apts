export enum GameMode {
	PvP = 'PvP',
	PvC = 'PvC',
	CvC = 'CvC',
}
export interface SelectListItem {
	label: string;
	value: string;
}

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

export type ParamsToExport_TrainingData = SelfPlayMemoryParams & {
	id: string;
	model: ParamsToExport_BuildModel | null;
};

export type ParamsToExport_BuildModel = {
	resNet: ResNetBuildModelParams;
	memory: (ParamsToExport_TrainingData | {})[];
	training: TrainModelParams;
};
