import { TrainingParams_MCTS_Base } from "../../types.js";
import { getRandomValidAction } from "../../engine/util.js";
import { State } from "../../engine/Game.js";
import MonteCarloTreeSearch from "../../engine/MonteCarloTreeCommon.js";

export default async function testMCTSCommon({
	logMessage,
	game,
}: TrainingParams_MCTS_Base) {
	// Set game and state data
	const state = game.getInitialState();
	logMessage("Initial state:");
	logMessage(state.toString());

	logMessage(playTurn(state, getRandomValidAction(state), 1));
	logMessage(playTurn(state, getRandomValidAction(state), -1));
	logMessage(playTurn(state, getRandomValidAction(state), 1));
	logMessage(playTurn(state, getRandomValidAction(state), -1));

	const mcts = new MonteCarloTreeSearch(game, {
		explorationConstant: 2,
		numSearches: 60,
	});
	const actionProbabilities = mcts.search(state);
	logMessage("Action probabilities: " + "\n[");
	actionProbabilities.forEach((p) => logMessage(p.toString() + ","));
	logMessage("]");
}

function playTurn(state: State, action: number, player: number): string {
	let returnString = `Player ${player} plays action ${action}`;
	state.performAction(action, player);
	returnString += "\n" + state.toString();
	const hasWon = state.checkWin(action);
	if (hasWon) returnString += "\n" + `Player ${player} has won!`;
	return returnString;
}
