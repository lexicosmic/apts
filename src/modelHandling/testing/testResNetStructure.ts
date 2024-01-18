import * as tf from "@tensorflow/tfjs";
import { getPredictionDataFromState, getRandomValidAction } from "../util.js";
import { fileSystemProtocol } from "../parameters.js";
import { ModelType, TrainingFunctionParams } from "../../types.js";
import ResNet from "../../engine/ResNet.js";

export default async function testResNetStructure({
	printMessage,
	game,
}: TrainingFunctionParams) {
	// Set game and state data
	const state = game.getInitialState();

	// Build model and save it
	printMessage("Building model...");
	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });
	resNet.summary(printMessage);
	printMessage("Model built!");
	printMessage("\nSaving model...");
	await resNet.save(fileSystemProtocol, ModelType.Structure);
	printMessage("Model saved!\n");

	// Play a few moves
	printMessage("Initial state:");
	printMessage(state.toString());
	state.performAction(getRandomValidAction(state), -1);
	printMessage(state.toString());

	// Print the encoded state as a 3D array
	const encodedState = state.getEncodedState();
	printMessage("Encoded state: ");
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
			printMessage(encodedStateString);
			encodedStateString = "";
		}
	}
	encodedStateString += "]\n";
	printMessage(encodedStateString);

	// Predict
	const { policy, value, probabilities, action } = tf.tidy(() => {
		const { policy, value, probabilities, action } = getPredictionDataFromState(
			state,
			resNet,
			{
				policy: true,
				value: true,
				probabilities: true,
				action: true,
			}
		);
		return {
			policy: policy!.arraySync(),
			value: value!.arraySync(),
			probabilities: probabilities!.arraySync(),
			action: action,
		};
	});

	printMessage("Policy: " + "\n[");
	policy.forEach((p) => printMessage(p.toString() + ","));
	printMessage("]");
	printMessage("Action probabilities: " + "\n[");
	probabilities.forEach((p) => printMessage(p.toString() + ","));
	printMessage("]");
	printMessage("Action: " + action);
	printMessage("Value: " + value.toString());
}
