import {State} from '../engine/Game.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTreeCommon.js';
import {gameParams} from '../train/parameters.js';

function playTurn(state: State, action: number, player: number) {
	console.log(`Player ${player} plays action ${action}`);
	state.performAction(action, player);
	state.print();
	const hasWon = state.checkWin(action);
	if (hasWon) console.log(`Player ${player} has won!`);
}

// Set game and state data
const game = gameParams.game;
const state = game.getInitialState();
playTurn(state, 0, 1);
playTurn(state, 0, -1);
playTurn(state, 0, 1);
playTurn(state, 0, -1);
playTurn(state, 1, 1);
playTurn(state, 4, -1);
playTurn(state, 2, 1);
playTurn(state, 4, -1);
playTurn(state, 3, 1);

const mcts = new MonteCarloTreeSearch(game, {
	explorationConstant: 2,
	numSearches: 60,
});
const probabilities = mcts.search(state);
console.log(probabilities);
