import MonteCarloTreeSearch from '../engine/MonteCarloTreeCommon.ts';
import TicTacToe from '../engine/TicTacToe.ts';

// Set game and state data
const game = new TicTacToe();
let state = game.getInitialState();
// state = game.getNextState(state, 2, 1);
// state = game.getNextState(state, 7, -1);
const mcts = new MonteCarloTreeSearch(game, {
	explorationConstant: 2,
	numSearches: 60,
});
const probabilities = mcts.search(state);
console.log(probabilities);
