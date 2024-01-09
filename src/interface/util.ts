import { EffectCallback, useRef, useEffect } from "react";
import { GameName } from "../types";
import TicTacToeGame from "../engine/games/TicTacToe";
import ConnectFourGame from "../engine/games/ConnectFour";

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
