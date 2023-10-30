import MonteCarloTreeSearch from '../engine/MonteCarloTreeCommon.ts';
import TicTacToe from '../engine/TicTacToe.ts';

// Set game and state data
const game = new TicTacToe();
game.getState().performAction(0, 1);
game.getState().performAction(6, -1);
game.getState().performAction(1, 1);
const mcts = new MonteCarloTreeSearch(game, {
	explorationConstant: 2,
	numSearches: 60,
});
const probabilities = mcts.search(game.getState());
console.log(probabilities);
