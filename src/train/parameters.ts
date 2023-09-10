import {
	ResNetBuildModelParams,
	MonteCarloTreeSearchParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types';

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
	numIterations: 1,
	numEpochs: 4,
	batchSize: 64,
	learningRate: 0.001,
};

export const mainModelDirectory = `main_model`;

export const trainingDataIds = ['1693823484363'];
