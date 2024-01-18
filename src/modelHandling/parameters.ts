import ConnectFourGame from "../engine/games/ConnectFour.js";
import TicTacToeGame from "../engine/games/TicTacToe.js";
import {
	ResNetBuildModelParams,
	MonteCarloTreeSearchParams,
	SelfPlayMemoryParams,
	TrainModelParams,
	GameName,
} from "../types.js";

export const fileSystemProtocol = "indexeddb";

export type GameParams = {
	gameName: GameName;
	game: TicTacToeGame | ConnectFourGame;
};

// export const gameParams = {
// 	...generalParams,
// 	directoryName: GameName.TicTacToe,
// 	game: new TicTacToeGame(3, 3),
// 	// mainModelDirectory: `${GameName.TicTacToe}/selfplay_1700439885953/iteration_0`,
// 	// trainingDataIds: ["1700442540627", "1700444129387", "1700444618455"],
// };

// export const gameParams = {
// 	directoryName: GameName.ConnectFour,
// 	game: new ConnectFourGame(6, 7),
// 	mainModelDirectory: `${GameName.ConnectFour}/blind_1700467050607/beforeTrain`,
// 	trainingDataIds: [],
// };

export const resNetBuildModelParams: ResNetBuildModelParams = {
	numResBlocks: 12,
	numHiddenChannels: 64,
};
export const monteCarloTreeSearchParams: MonteCarloTreeSearchParams = {
	explorationConstant: 2,
	numSearches: 60,
};
export const selfPlayMemoryParams: SelfPlayMemoryParams = {
	...monteCarloTreeSearchParams,
	numSelfPlayIterations: 100,
};
export const trainModelParams: TrainModelParams = {
	numIterations: 1,
	numEpochs: 25,
	batchSize: 128,
	learningRate: 0.01,
};
