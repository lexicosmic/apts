// import {
// 	resNetBuildModelParams,
// 	monteCarloTreeSearchParams,
// 	selfPlayMemoryParams,
// 	trainModelParams,
// } from "../parameters.js";
// import ResNet from "../../engine/ResNet.js";
// import AlphaZero from "../../engine/AlphaZero.js";
//
// export default async function createModel() {
// 	const game = gameParams.game;
// 	const resNet = new ResNet(game, resNetBuildModelParams);
// 	const alphaZero = new AlphaZero(game, resNet, monteCarloTreeSearchParams);
// 	const trainingMemoryBatch = loadTrainingData(gameParams.trainingDataIds);

// 	const currentTime = new Date().valueOf();
// 	const modelDirectory = `${gameParams.directoryName}/selfplay_${currentTime}`;

// 	writeModelParameters(
// 		modelDirectory,
// 		gameParams.trainingDataIds,
// 		resNetBuildModelParams,
// 		trainModelParams
// 	);
// 	await alphaZero.learn(
// 		modelDirectory,
// 		selfPlayMemoryParams.numSelfPlayIterations,
// 		trainModelParams,
// 		trainingMemoryBatch
// 	);
// }
