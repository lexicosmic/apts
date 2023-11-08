import MonteCarloTreeSearch from '../engine/MonteCarloTreeCommon.ts';
import {gameParams} from '../train/parameters.ts';

// Set game and state data
const game = gameParams.game;
const state = game.getInitialState();
state.print();
state.performAction(0, 1);
state.performAction(6, -1);
state.performAction(1, 1);
state.performAction(6, -1);
state.print();

const mcts = new MonteCarloTreeSearch(game, {
	explorationConstant: 2,
	numSearches: 60,
});
const probabilities = mcts.search(state);
console.log(probabilities);
