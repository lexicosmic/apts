import { GameName } from "./types";

export function formatGameName(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return "Tic Tac Toe";
	else if (gameName === GameName.ConnectFour) return "Connect Four";
	else return "Unknown";
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function constructModelPath(
	gameName: GameName,
	type: string,
	innerPath: string
) {
	return `/${gameName}/${type}${innerPath}`;
}
