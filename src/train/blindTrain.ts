import * as tf from '@tensorflow/tfjs-node';
import TicTacToe, {Player} from '../engine/TicTacToe.ts';
import ResNet from '../engine/ResNet.ts';
import fs from 'fs';

const game = new TicTacToe();
let state = game.getInitialState();
state = game.getNextState(state, 0, Player.X);
state = game.getNextState(state, 4, Player.O);
state = game.getNextState(state, 5, Player.X);
state = game.getNextState(state, 8, Player.O);
game.printState(state);

const resNet = new ResNet({game, numResBlocks: 4, numHiddenChannels: 64});

const encodedState = game.getEncodedState(state);
const outcome = game.getActionOutcome(state, 2);
const inputsTensor = tf.tensor4d([encodedState]); // Nx3x3x3 - Batch of encoded states
const outputPolicyTensor = tf.tensor2d([[0, 0, 0, 0, 0, 0, 0, 0, 0]]); // N - Batch of outcomes
const outputValueTensor = tf.tensor2d([[outcome.value]]); // N - Batch of outcomes

const currentTime = new Date().valueOf();
const modelDirectory = `models/blind_${currentTime}`;
try {
	fs.mkdirSync(`./${modelDirectory}`);
} catch (e) {
	console.error(e);
}
await resNet.save(`file://${modelDirectory}/blind_beforeTrain`);
resNet.train(inputsTensor, outputPolicyTensor, outputValueTensor, 1, 30, 0.001);
await resNet.save(`file://${modelDirectory}/blind_afterTrain`);