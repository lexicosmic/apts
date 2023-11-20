import ConnectFourGame from '../engine/games/ConnectFour.ts';
import TicTacToeGame from '../engine/games/TicTacToe.ts';
import {
	ResNetBuildModelParams,
	MonteCarloTreeSearchParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types.ts';

enum GameNames {
	TicTacToe = 'tictactoe',
	ConnectFour = 'connect4',
}

// export const gameParams = {
// 	directoryName: GameNames.ConnectFour,
// 	game: new ConnectFourGame(6, 7),
// };

export const gameParams = {
	directoryName: GameNames.TicTacToe,
	game: new TicTacToeGame(3, 3),
	mainModelDirectory: `${GameNames.TicTacToe}/selfplay_1700439885953/iteration_0`,
	trainingDataIds: ['1700442540627'],
};

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
