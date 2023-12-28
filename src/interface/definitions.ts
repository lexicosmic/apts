import TicTacToeGame from "../engine/games/TicTacToe.js";
import ConnectFourGame from "../engine/games/ConnectFour.js";

enum GameName {
	TicTacToe = "tictactoe",
	ConnectFour = "connect4",
}

export const gameDefinitions = {
	game: new TicTacToeGame(3, 3),
	modelDirectory: `${GameName.TicTacToe}/structure`,
};

// export const gameDefinitions = {
// 	game: new ConnectFourGame(6, 7),
// 	modelDirectory: `${GameName.ConnectFour}/blind_1700467050607/beforeTrain`,
// };
