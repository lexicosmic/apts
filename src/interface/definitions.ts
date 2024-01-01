import TicTacToeGame from "../engine/games/TicTacToe.js";
import ConnectFourGame from "../engine/games/ConnectFour.js";
import { GameName } from "../types.js";

// export const gameDefinitions = {
// 	game: new TicTacToeGame(3, 3),
// 	modelDirectory: `${GameName.TicTacToe}/structure`,
// };

// export const gameDefinitions = {
// 	game: new ConnectFourGame(6, 7),
// 	modelDirectory: `${GameName.ConnectFour}/blind_1700467050607/beforeTrain`,
// };

export function loadGame(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return new TicTacToeGame(3, 3);
	else if (gameName === GameName.ConnectFour) return new ConnectFourGame(6, 7);
	else throw new Error("Unknown game name");
}
