import MonteCarloTreeSearch from '../engine/MonteCarloTreeCommon.ts';
import TicTacToe from '../engine/TicTacToe.ts';

// Set game and state data
const game = new TicTacToe();
const state = game.getInitialState();
state.performAction(0, 1);
state.performAction(6, -1);
state.performAction(1, 1);
const mcts = new MonteCarloTreeSearch(game, {
	explorationConstant: 2,
	numSearches: 60,
});
const probabilities = mcts.search(state);
console.log(probabilities);
