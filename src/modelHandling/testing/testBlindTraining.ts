import * as tf from "@tensorflow/tfjs";
import { ModelType, TrainingFunctionParams } from "../../types.js";
import Game from "../../engine/Game.js";
import ResNet from "../../engine/ResNet.js";

export default async function testBlindTraining({
	logMessage,
	game,
	fileSystemProtocol = "indexeddb",
}: TrainingFunctionParams) {
	let state = game.getInitialState();
	logMessage("Initial state:");
	logMessage(state.toString());

	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });

	const encodedState = state.getEncodedState();
	const outcome = Game.getActionOutcome(state, 2);
	const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
	const outputPolicyTensor = tf.tensor2d([Array(game.getActionSize()).fill(0)]); // N - Batch of outcomes
	const outputValueTensor = tf.tensor2d([[outcome.value]]); // N - Batch of outcomes

	logMessage("Saving model before training...");
	let innerPath = `/beforeTrain`;
	await resNet.save({
		protocol: fileSystemProtocol,
		type: ModelType.Blind,
		innerPath,
		name: "beforeTrain",
	});
	logMessage("Model saved!\n");

	logMessage("Training model...");
	await resNet.train({
		inputsBatch: inputsTensor,
		policyOutputsBatch: outputPolicyTensor,
		valueOutputsBatch: outputValueTensor,
		batchSize: 1,
		numEpochs: 30,
		learningRate: 0.001,
		validationSplit: 0,
		logMessage,
	});
	logMessage("Model trained!");

	logMessage("\nSaving model after training...");
	innerPath = `/afterTrain`;
	await resNet.save({
		protocol: fileSystemProtocol,
		type: ModelType.Blind,
		innerPath,
		name: "afterTrain",
	});
	logMessage("Model saved!");

	inputsTensor.dispose();
	outputPolicyTensor.dispose();
	outputValueTensor.dispose();
	resNet.dispose();
}
