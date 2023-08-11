import * as tf from '@tensorflow/tfjs-node';
import TicTacToe, {Player} from '../engine/TicTacToe.js';
import ResNet from '../engine/ResNet.js';
import AlphaZero from '../engine/AlphaZero.js';

// const model = new ResNet(game, 4, 64);
// const params = {
// 	explorationConstant: 2,
// 	numSearches: 60,
// 	numIterations: 3,
// 	numSelfPlayIterations: 10,
// 	numEpochs: 4,
// 	batchSize: 64,
// };
// const alphaZero = new AlphaZero(model, optimizer, game, params);
// alphaZero.learn();

// Create a game state
const game = new TicTacToe();
let state = game.getInitialState();
state = game.getNextState(state, 0, Player.X);
state = game.getNextState(state, 4, Player.O);
state = game.getNextState(state, 5, Player.X);
state = game.getNextState(state, 8, Player.O);
game.printState(state);

// Get the training data
const encodedState = game.getEncodedState(state);
const outcome = game.getActionOutcome(state, 2);
const probabilities = [0, 0.2, 0.25, 0.25, 0, 0, 0.3, 0, 0];

// Create tensors from the training data
const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
const policyOutputsTensor = tf.tensor2d([probabilities]); // Nx9 - Batch of action probabilities
const valueOutputsTensor = tf.tensor2d([[outcome.value]]); // Nx1 - Batch of outcome values
inputsTensor.print();
policyOutputsTensor.print();
valueOutputsTensor.print();

// Train the model
const numHidden = 64;
const resNet = new ResNet(game, 4, numHidden);
await resNet.save(`file://models/alphazero_${0}`);
resNet.train(inputsTensor, policyOutputsTensor, valueOutputsTensor, 1, 30);
await resNet.save(`file://models/alphazero_${1}`);

// Dispose of the tensors
tf.dispose([inputsTensor, policyOutputsTensor, valueOutputsTensor]);
resNet.dispose();
