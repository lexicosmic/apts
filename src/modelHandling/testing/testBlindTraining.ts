import * as tf from "@tensorflow/tfjs";
import { v4 as uuidv4 } from "uuid";
import { ModelType, TrainingParams_StructureBlind_Base } from "../../types.js";
import { getFormattedDate, standardFileProtocol } from "../../util.js";
import Game from "../../engine/Game.js";
import ResNet from "../../engine/ResNet.js";

export default async function testBlindTraining({
	logMessage,
	game,
	fileSystemProtocol = standardFileProtocol,
}: TrainingParams_StructureBlind_Base) {
	// Set state data
	const randomId = uuidv4();
	const date = getFormattedDate(new Date());
	let state = game.getInitialState();
	logMessage("Initial state:");
	logMessage(state.toString());
	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });

	// Prepare data for training
	const encodedState = state.getEncodedState();
	const outcome = Game.getActionOutcome(state, 2);
	const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
	const outputPolicyTensor = tf.tensor2d([Array(game.getActionSize()).fill(0)]); // N - Batch of outcomes
	const outputValueTensor = tf.tensor2d([[outcome.value]]); // N - Batch of outcomes

	// Save model before training
	logMessage("Saving model before training...");
	let innerPath = `/beforeTrain/${randomId}`;
	await resNet.save({
		protocol: fileSystemProtocol,
		type: ModelType.Blind,
		innerPath,
		name: `Before train ${date}`,
	});
	logMessage("Model saved!\n");

	// Train model
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

	// Save model after training
	logMessage("\nSaving model after training...");
	innerPath = `/afterTrain/${randomId}`;
	await resNet.save({
		protocol: fileSystemProtocol,
		type: ModelType.Blind,
		innerPath,
		name: `After train ${date}`,
	});
	logMessage("Model saved!");

	// Dispose tensors
	inputsTensor.dispose();
	outputPolicyTensor.dispose();
	outputValueTensor.dispose();
	resNet.dispose();
}
