import * as tf from "@tensorflow/tfjs";
import { EffectCallback, useRef, useEffect } from "react";
import { GameName, ModelInfo, SerializedModel } from "../types";
import TicTacToeGame from "../engine/games/TicTacToe";
import ConnectFourGame from "../engine/games/ConnectFour";
import ResNet from "../engine/ResNet";
import Game from "../engine/Game";
import { constructModelPath } from "../util";

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

// export async function saveLayersModel(path: string) {
// 	const model = await tf.loadLayersModel(`indexeddb://${path}`);
// 	await model.save(`downloads://${path}`);
// }

export async function saveResNetModel(modelInfo: ModelInfo) {
	const game = loadGame(modelInfo.game);
	const path = constructModelPath(
		modelInfo.game,
		modelInfo.type,
		modelInfo.innerPath
	);
	loadResNetModel(game, path, (loadedModel) => {
		const serializedModel: SerializedModel = {
			type: modelInfo.type,
			innerPath: modelInfo.innerPath,
			name: modelInfo.name,
			resNet: loadedModel,
		};
		const stringifiedModel = JSON.stringify(serializedModel);
		const blob = new Blob([stringifiedModel], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a") as HTMLAnchorElement;
		a.href = url;
		a.download = `${modelInfo.name}.json`;
		a.click();
		URL.revokeObjectURL(url);
		a.remove();
		loadedModel.dispose();
	});
}
