import * as tf from "@tensorflow/tfjs";
import { v4 as uuidv4 } from "uuid";
import { ModelType, TrainingFunctionParams } from "../../types.js";
import { getFormattedDate, standardFileProtocol } from "../../util.js";
import {
	getPredictionDataFromState_Policy_Value_Probabilities_Action,
	getRandomValidAction,
} from "../../engine/util.js";
import ResNet from "../../engine/ResNet.js";

export default async function testResNetStructure({
	logMessage,
	game,
	fileSystemProtocol = standardFileProtocol,
}: TrainingFunctionParams) {
	// Set state data
	const date = getFormattedDate(new Date());
	const state = game.getInitialState();

	// Build model and save it
	logMessage("Building model...");
	const resNet = new ResNet(game, {
		numResBlocks: 4,
		numHiddenChannels: 64,
	});
	resNet.summary(logMessage);
	logMessage("Model built!");
	logMessage("\nSaving model...");
	await resNet.save({
		protocol: fileSystemProtocol,
		type: ModelType.Structure,
		innerPath: `/${uuidv4()}`,
		name: `Structure ${date}`,
	});
	logMessage("Model saved!\n");

	// Play a few moves
	logMessage("Initial state:");
	logMessage(state.toString());
	state.performAction(getRandomValidAction(state), -1);
	logMessage(state.toString());

	// Print the encoded state as a 3D array
	const encodedState = state.getEncodedState();
	logMessage("Encoded state: ");
	let encodedStateString = "[";
	for (let i = 0; i < encodedState.length; i++) {
		for (let j = 0; j < encodedState[i].length; j++) {
			encodedStateString += "[";
			for (let k = 0; k < encodedState[i][j].length; k++) {
				encodedStateString += encodedState[i][j][k];
				if (k !== encodedState[i][j].length - 1) encodedStateString += ",";
			}
			encodedStateString += "]";
			if (j !== encodedState[i].length - 1) encodedStateString += ",";
		}
		if (i !== encodedState.length - 1) {
			encodedStateString += ",";
			logMessage(encodedStateString);
			encodedStateString = "";
		}
	}
	encodedStateString += "]\n";
	logMessage(encodedStateString);

	// Predict
	const { policy, value, probabilities, action } = tf.tidy(() => {
		const { policy, value, probabilities, action } =
			getPredictionDataFromState_Policy_Value_Probabilities_Action(
				state,
				resNet
			);
		return {
			policy: policy.arraySync(),
			value: value.arraySync(),
			probabilities: probabilities.arraySync(),
			action: action,
		};
	});

	// Log prediction data
	logMessage("Policy: " + "\n[");
	policy.forEach((p) => logMessage(p.toString() + ","));
	logMessage("]");
	logMessage("Action probabilities: " + "\n[");
	probabilities.forEach((p) => logMessage(p.toString() + ","));
	logMessage("]");
	logMessage("Action: " + action);
	logMessage("Value: " + value.toString());

	// Dispose tensors
	resNet.dispose();
}
