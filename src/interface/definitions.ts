import TicTacToeGame from '../engine/games/TicTacToe.js';
import ConnectFourGame from '../engine/games/ConnectFour.js';

enum GameNames {
	TicTacToe = 'tictactoe',
	ConnectFour = 'connect4',
}

export const gameDefinitions = {
	game: new TicTacToeGame(3, 3),
	modelDirectory: `${GameNames.TicTacToe}/selfplay_1700439885953/iteration_0`,
};

// export const gameDefinitions = {
// 	game: new ConnectFourGame(6, 7),
// 	modelDirectory: `${GameNames.ConnectFour}/blind_1700467050607/beforeTrain`,
// };
