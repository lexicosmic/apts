import TicTacToe, {Player} from '../engine/TicTacToe.js';
import ResNet from '../engine/ResNet.js';
import AlphaZero from '../engine/AlphaZero.js';

const game = new TicTacToe();
let state = game.getInitialState();
state = game.getNextState(state, 0, Player.X);
state = game.getNextState(state, 4, Player.O);
state = game.getNextState(state, 5, Player.X);
state = game.getNextState(state, 8, Player.O);
game.printState(state);

const numHidden = 64;
const params = {
	explorationConstant: 2,
	numSearches: 60,
	numIterations: 3,
	numSelfPlayIterations: 10, // TODO: Set to 500
	numEpochs: 4,
	batchSize: 64,
};
const resNet = new ResNet(game, 4, numHidden);

const alphaZero = new AlphaZero(resNet, game, params);
await alphaZero.learn();
