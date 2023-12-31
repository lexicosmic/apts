import * as tf from "@tensorflow/tfjs";
import ResNet from "../../engine/ResNet.js";
import { gameParams } from "../parameters.js";

export default async function testResNetStructure(
	printMessage: (message: string) => void
) {
	// Set game and state data
	const game = gameParams.game;
	const state = game.getInitialState();

	// Build model and save it
	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });
	resNet.summary(printMessage);
	printMessage("\nSaving model...");
	await resNet.save(
		`${gameParams.protocol}://models/${gameParams.directoryName}/structure`
	);
	printMessage("Model saved!\n");

	// Play a few moves
	printMessage(state.toString());
	state.performAction(6, -1);
	printMessage(state.toString());

	// Calculate the policy and value from the neural network
	let encodedState = state.getEncodedState();
	const tensorState = tf.tensor(encodedState).expandDims(0) as tf.Tensor4D;
	const [policy, value] = resNet.predict(tensorState);
	const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);

	// Mask the policy to only allow valid actions
	const validActions = state.getValidActions();
	const maskedPolicy = softMaxPolicy.mul(tf.tensor(validActions).expandDims(0));
	const sum = maskedPolicy.sum().arraySync() as number;
	const actionProbabilities = maskedPolicy
		.div(sum)
		.squeeze()
		.arraySync() as number[];
	const valueData = value.dataSync()[0];

	// Convert raw probabilities to log probabilities
	const logActionProbabilities = actionProbabilities.map((p) => Math.log(p));
	const action = tf.tidy(() => {
		const actionTensor = tf.tensor(logActionProbabilities) as tf.Tensor1D;
		const actionIndex = tf.multinomial(actionTensor, 1).dataSync()[0];
		return actionIndex;
	});

	// Log the results
	encodedState = state.getEncodedState();
	// Print the encoded state as a 3D array
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
	printMessage("Action probabilities: " + "\n[");
	actionProbabilities.forEach((p) => printMessage(p.toString()));
	printMessage("]");
	printMessage("Action: " + action);
	printMessage("Value: " + valueData.toString());
}
