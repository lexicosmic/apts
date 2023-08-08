// import * as tf from '@tensorflow/tfjs-node';
// import TicTacToe, {Player} from '../engine/TicTacToe.js';
// import ResNet from '../engine/ResNet.js';
// import AlphaZero from '../engine/AlphaZero.js';

// const game = new TicTacToe();
// let state = game.getInitialState();
// state = game.getNextState(state, 0, Player.X);
// state = game.getNextState(state, 4, Player.O);
// state = game.getNextState(state, 5, Player.X);
// state = game.getNextState(state, 8, Player.O);

// game.printState(state);

// // const model = new ResNet(game, 4, 64);
// // const params = {
// // 	explorationConstant: 2,
// // 	numSearches: 60,
// // 	numIterations: 3,
// // 	numSelfPlayIterations: 10,
// // 	numEpochs: 4,
// // 	batchSize: 64,
// // };
// // model.compile({
// // 	optimizer,
// // 	loss: ['categoricalCrossentropy', 'meanSquaredError'],
// // 	metrics: ['accuracy'],
// // });

// // const alphaZero = new AlphaZero(model, optimizer, game, params);
// // alphaZero.learn();

// // console.log('\nstartBlock');
// // model.startBlock.weights.forEach(w => {
// // 	console.log(w.name, w.shape);
// // });
// // console.log('\npolicyHead');
// // model.policyHead.weights.forEach(w => {
// // 	console.log(w.name, w.shape);
// // });
// // console.log('\nvalueHead');
// // model.valueHead.weights.forEach(w => {
// // 	console.log(w.name, w.shape);
// // });

// const numHidden = 64;
// const inputLayer = tf.input({shape: [game.rowCount, game.columnCount, 3]});
// const convLayer = tf.layers.conv2d({
// 	filters: numHidden, // Number of filters (output channels)
// 	kernelSize: 3, // 3x3
// 	strides: 1, // Move 1 pixel at a time
// 	padding: 'same', // Fill with zeros
// });
// const batchNormLayer = tf.layers.batchNormalization();
// const activationLayer = tf.layers.activation({activation: 'relu'});
// const flattenLayer = tf.layers.flatten();
// const denseLayer = tf.layers.dense({
// 	units: game.rowCount * game.columnCount * 3,
// });
// const outputLayer = tf.layers.dense({units: 1, activation: 'tanh'});
// const startBlock = tf.model({
// 	inputs: inputLayer,
// 	outputs: [
// 		outputLayer.apply(
// 			denseLayer.apply(
// 				flattenLayer.apply(
// 					activationLayer.apply(
// 						batchNormLayer.apply(convLayer.apply(inputLayer)),
// 					),
// 				),
// 			),
// 		) as tf.SymbolicTensor,
// 		outputLayer.apply(
// 			denseLayer.apply(
// 				flattenLayer.apply(
// 					activationLayer.apply(
// 						batchNormLayer.apply(convLayer.apply(inputLayer)),
// 					),
// 				),
// 			),
// 		) as tf.SymbolicTensor,
// 	],
// });

// startBlock.summary();

// const encodedState = game.getEncodedState(state);
// const outcome = game.getActionOutcome(state, 2);
// const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
// const outputsTensor1 = tf.tensor1d([outcome.value]); // N - Batch of outcomes
// const outputsTensor2 = tf.tensor1d([outcome.value]); // N - Batch of outcomes
// const optimizer = tf.train.adam(0.001);
// await startBlock.save(`file://models/alphazero_${0}`);
// train();
// await startBlock.save(`file://models/alphazero_${1}`);

// async function train() {
// 	// Compile the model with the defined optimizer and specify a loss function to use.
// 	startBlock.compile({
// 		optimizer: optimizer,
// 		loss: ['meanSquaredError', 'meanSquaredError'],
// 		metrics: ['accuracy'],
// 	});

// 	// Finally do the training itself
// 	let results = await startBlock.fit(
// 		inputsTensor,
// 		[outputsTensor1, outputsTensor2],
// 		{
// 			shuffle: true, // Ensure data is shuffled again before using each time.
// 			// validationSplit: 0.15,
// 			batchSize: 1, // Update weights after every 256 examples.
// 			epochs: 30, // Go over the data 30 times!
// 			callbacks: {onEpochEnd: (epoch, logs) => logProgress(epoch, logs!)},
// 		},
// 	);

// 	inputsTensor.dispose();
// 	outputsTensor1.dispose();
// 	outputsTensor2.dispose();

// 	// Once trained we can evaluate the model.
// 	evaluate();
// }

// function logProgress(epoch: number, logs: tf.Logs) {
// 	console.log('Data for epoch ' + epoch, logs);
// }

// function evaluate() {
// 	// Clean up created tensors automatically.
// 	let answer = tf.tidy(function () {
// 		let newInput = tf.tensor4d([game.getEncodedState(game.getInitialState())]);
// 		let output = startBlock.predict(newInput) as tf.Tensor1D[];
// 		output[0]!.print();
// 		output[1]!.print();
// 		// return output.squeeze([0]).argMax();
// 	});
// }
