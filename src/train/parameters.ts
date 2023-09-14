import {
	ResNetBuildModelParams,
	MonteCarloTreeSearchParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types.ts';

export const resNetBuildModelParams: ResNetBuildModelParams = {
	numResBlocks: 4,
	numHiddenChannels: 64,
};
export const monteCarloTreeSearchParams: MonteCarloTreeSearchParams = {
	explorationConstant: 2,
	numSearches: 60,
};
export const selfPlayMemoryParams: SelfPlayMemoryParams = {
	...monteCarloTreeSearchParams,
	numSelfPlayIterations: 500,
};
export const trainModelParams: TrainModelParams = {
	numIterations: 3,
	numEpochs: 20,
	batchSize: 32,
	learningRate: 0.00005,
};

export const mainModelDirectory = `main_model`;

export const trainingDataIds = [
	// '1694373039989',
	// '1694373330714',
	// '1694373607234',
];
