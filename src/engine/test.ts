import * as tf from '@tensorflow/tfjs';
import TicTacToe from './TicTacToe.js';
import ResNet from './ResNet.js';

const ticTacToe = new TicTacToe();
let state = ticTacToe.getInitialState();
state = ticTacToe.getNextState(state, 2, 1);
state = ticTacToe.getNextState(state, 7, -1);
const encondedState = ticTacToe.getEncondedState(state);

const tensorState = tf.tensor(encondedState).expandDims();
const model = new ResNet(ticTacToe, 4, 64);

const [policy, value] = model.call(tensorState);

const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]).print();
const valueData = value.dataSync()[0];
console.log(valueData);
