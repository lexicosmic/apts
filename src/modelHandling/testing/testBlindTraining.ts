import * as tf from "@tensorflow/tfjs";
import { fileSystemProtocol } from "../parameters.js";
import { ModelType, TrainingFunctionParams } from "../../types.js";
import Game from "../../engine/Game.js";
import ResNet from "../../engine/ResNet.js";

export default async function testBlindTraining({
	printMessage,
	game,
}: TrainingFunctionParams) {
	let state = game.getInitialState();
	// state.performAction(0, Player.X);
	// state.performAction(4, Player.O);
	// state.performAction(5, Player.X);
	// state.performAction(8, Player.O);
	printMessage(state.toString());

	const resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });

	const encodedState = state.getEncodedState();
	const outcome = Game.getActionOutcome(state, 2);
	const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
	const outputPolicyTensor = tf.tensor2d([Array(game.getActionSize()).fill(0)]); // N - Batch of outcomes
	const outputValueTensor = tf.tensor2d([[outcome.value]]); // N - Batch of outcomes

	// const currentTime = new Date().valueOf();
	printMessage("\nSaving model before training...");
	let innerPath = `/beforeTrain`;
	await resNet.save(fileSystemProtocol, ModelType.Blind, innerPath);
	printMessage("Model saved!\n");

	printMessage("Training model...");
	resNet.train(
		inputsTensor,
		outputPolicyTensor,
		outputValueTensor,
		1,
		30,
		0.001,
		0,
		printMessage
	);
	printMessage("Model trained!\n");

	printMessage("\nSaving model after training...");
	innerPath = `/afterTrain`;
	await resNet.save(fileSystemProtocol, ModelType.Blind, innerPath);
	printMessage("Model saved!\n");
}
