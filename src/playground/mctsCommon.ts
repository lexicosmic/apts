import { State } from "../engine/Game.js";
import MonteCarloTreeSearch from "../engine/MonteCarloTreeCommon.js";
import { gameParams } from "../train/parameters.js";

function playTurn(state: State, action: number, player: number): string {
	let returnString = `Player ${player} plays action ${action}`;
	state.performAction(action, player);
	returnString += "\n" + state.toString();
	const hasWon = state.checkWin(action);
	if (hasWon) returnString += "\n" + `Player ${player} has won!`;
	return returnString;
}

export async function testMCTSCommon(printMessage: (message: string) => void) {
	// Set game and state data
	const game = gameParams.game;
	const state = game.getInitialState();
	printMessage(state.toString());

	printMessage(playTurn(state, 0, 1));

	printMessage(playTurn(state, 0, -1));
	printMessage(playTurn(state, 0, 1));
	printMessage(playTurn(state, 0, -1));
	printMessage(playTurn(state, 1, 1));
	printMessage(playTurn(state, 4, -1));
	printMessage(playTurn(state, 2, 1));
	printMessage(playTurn(state, 4, -1));
	printMessage(playTurn(state, 3, 1));

	const mcts = new MonteCarloTreeSearch(game, {
		explorationConstant: 2,
		numSearches: 60,
	});
	const probabilities = mcts.search(state);
	printMessage(probabilities.toString());
}
