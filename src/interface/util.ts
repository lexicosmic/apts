import * as tf from "@tensorflow/tfjs";
import { EffectCallback, useRef, useEffect } from "react";
import { GameName } from "../types";
import TicTacToeGame from "../engine/games/TicTacToe";
import ConnectFourGame from "../engine/games/ConnectFour";
import ResNet from "../engine/ResNet";
import Game from "../engine/Game";

export function useOnMountUnsafe(effect: EffectCallback) {
	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			effect();
		}
	}, []);
}

export function loadGame(gameName: GameName) {
	if (gameName === GameName.TicTacToe) return new TicTacToeGame(3, 3);
	else if (gameName === GameName.ConnectFour) return new ConnectFourGame(6, 7);
	else throw new Error("Unknown game name");
}

export async function loadResNetModel(
	game: Game,
	path: string,
	callback: (resNet: ResNet) => void
) {
	const formattedPath = `indexeddb://${path}`;
	const model = await tf.loadLayersModel(formattedPath);
	const resNet = new ResNet(game, { model });
	callback(resNet);
}
