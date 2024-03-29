import * as tf from "@tensorflow/tfjs";
import { GameName } from "./types";
import Game from "./engine/Game";
import TicTacToeGame from "./engine/games/TicTacToe";
import ConnectFourGame from "./engine/games/ConnectFour";
import ResNet from "./engine/ResNet";

export const standardFileProtocol = "indexeddb";

export function formatGameName(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return "Tic Tac Toe";
	else if (gameName === GameName.ConnectFour) return "Connect Four";
	else return "Unknown";
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFullModelPath(
	gameName: GameName,
	type: string,
	innerPath: string
) {
	return `/${gameName}/${type}${innerPath}`;
}

function padTwoDigits(num: number) {
	return num.toString().padStart(2, "0");
}

export function getFormattedDate(date: Date) {
	const year = padTwoDigits(date.getFullYear());
	const month = padTwoDigits(date.getMonth() + 1);
	const day = padTwoDigits(date.getDate());
	const hour = padTwoDigits(date.getHours());
	const minutes = padTwoDigits(date.getMinutes());
	const seconds = padTwoDigits(date.getSeconds());
	return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

export function loadGame(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return new TicTacToeGame(3, 3);
	else if (gameName === GameName.ConnectFour) return new ConnectFourGame(6, 7);
	else throw new Error("Unknown game name");
}

// Retrieve a ResNet model from the Tensorflow IndexedDB, given its path, and pass it to the callback
export async function retrieveResNetModel(game: Game, path: string) {
	const formattedPath = `indexeddb://${path}`;
	const model = await tf.loadLayersModel(formattedPath);
	const resNet = new ResNet(game, { model });
	return resNet;
}
