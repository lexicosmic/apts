import * as tf from "@tensorflow/tfjs";
import {
	GameName,
	ModelInfo,
	ModelType,
	SerializedModel,
	TensorLikeArray,
} from "../types";
import { getFullModelPath, loadGame } from "../util";
import ResNet from "../engine/ResNet";
import Game from "../engine/Game";

// Retrieve a ResNet model from the Tensorflow IndexedDB, given its path, and pass it to the callback
export async function retrieveResNetModelOld(
	game: Game,
	path: string,
	callback: (resNet: ResNet) => void
) {
	const formattedPath = `indexeddb://${path}`;
	const model = await tf.loadLayersModel(formattedPath);
	const resNet = new ResNet(game, { model });
	callback(resNet);
}

export async function exportResNetModel(modelInfo: ModelInfo) {
	const game = loadGame(modelInfo.game);
	const fullPath = getFullModelPath(
		modelInfo.game,
		modelInfo.type,
		modelInfo.innerPath
	);
	retrieveResNetModelOld(game, fullPath, (loadedResNet) => {
		const encodedWeights: string[] = [];
		loadedResNet.getWeights().forEach((weight) => {
			encodedWeights.push(btoa(JSON.stringify(weight)));
		});
		const encodedLayersModel = loadedResNet.getModel().toJSON();
		const serializedModel: SerializedModel = {
			game: modelInfo.game,
			type: modelInfo.type,
			innerPath: modelInfo.innerPath,
			name: modelInfo.name,
			layersModel: encodedLayersModel as string,
			weights: encodedWeights,
		};
		const stringifiedModel = JSON.stringify(serializedModel);
		const blob = new Blob([stringifiedModel], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a") as HTMLAnchorElement;
		a.href = url;
		a.download = `${fullPath}.json`;
		a.click();
		URL.revokeObjectURL(url);
		a.remove();
		loadedResNet.dispose();
	});
}

export async function importResNetModel(
	stringifiedModel: string,
	currentGame: GameName,
	onSuccess = (modelInfo: ModelInfo, resNet: ResNet) => {},
	onError: () => void
) {
	try {
		const serializedModel = JSON.parse(stringifiedModel) as SerializedModel;
		if (serializedModel.game !== currentGame) {
			alert("This model is not compatible with the current game!");
		}
		const decodedWeights: TensorLikeArray[] = [];
		serializedModel.weights.forEach((base64) => {
			decodedWeights.push(JSON.parse(atob(base64)));
		});
		const decodedLayersModel = await tf.models.modelFromJSON(
			JSON.parse(serializedModel.layersModel)
		);
		const game = loadGame(serializedModel.game as GameName);
		const resNet = new ResNet(game, {
			model: decodedLayersModel,
		});
		resNet.setWeights(decodedWeights);
		const modelInfo: ModelInfo = {
			game: serializedModel.game as GameName,
			type: serializedModel.type as ModelType,
			innerPath: serializedModel.innerPath,
			name: serializedModel.name,
		};
		onSuccess(modelInfo, resNet);
	} catch {
		onError();
	}
}

export function testApplication() {
	// tf.tidy(() => {
	// 	const game = new TicTacToeGame(3, 3);
	// 	const state = game.getInitialState();
	// 	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });
	// 	const action = getPredictionDataFromState_Action(state, resNet);
	// 	console.log(action);
	// });
}
