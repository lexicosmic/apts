import { Action, State } from "../../engine/Game.js";
import MonteCarloTreeSearch from "../../engine/MonteCarloTreeCommon.js";
import { TrainingFunctionParams } from "../../types.js";

export default async function testMCTSCommon({
	printMessage,
	game,
}: TrainingFunctionParams) {
	// Set game and state data
	const state = game.getInitialState();
	printMessage("Initial state:");
	printMessage(state.toString());

	printMessage(playTurn(state, getRandomValidAction(state), 1));
	printMessage(playTurn(state, getRandomValidAction(state), -1));
	printMessage(playTurn(state, getRandomValidAction(state), 1));
	printMessage(playTurn(state, getRandomValidAction(state), -1));

	const mcts = new MonteCarloTreeSearch(game, {
		explorationConstant: 2,
		numSearches: 60,
	});
	const actionProbabilities = mcts.search(state);
	printMessage("Action probabilities: " + "\n[");
	actionProbabilities.forEach((p) => printMessage(p.toString() + ","));
	printMessage("]");
}

function playTurn(state: State, action: number, player: number): string {
	let returnString = `Player ${player} plays action ${action}`;
	state.performAction(action, player);
	returnString += "\n" + state.toString();
	const hasWon = state.checkWin(action);
	if (hasWon) returnString += "\n" + `Player ${player} has won!`;
	return returnString;
}

function getRandomValidAction(state: State): Action {
	const validActionsEncoded = state.getValidActions();
	const validActions = [];
	for (let i = 0; i < validActionsEncoded.length; i++) {
		if (validActionsEncoded[i]) validActions.push(i);
	}
	return validActions[Math.floor(Math.random() * validActions.length)];
}
