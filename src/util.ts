import { GameName } from "./types";

export function formatGameName(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return "Tic Tac Toe";
	else if (gameName === GameName.ConnectFour) return "Connect Four";
	else return "Unknown";
}
