// // import {askForAction} from './index.js';
// import MonteCarloTreeSearch from './MonteCarloTree.js';
// import TicTacToe, {Outcome, Player} from './TicTacToe.js';

// const game = new TicTacToe();
// let player = Player.X;
// let state = game.getInitialState();
// const monteCarloTreeSearch = new MonteCarloTreeSearch(game, {
// 	numSearches: 1000,
// 	explorationConstant: 1.41,
// });

// const formattedPlayerName = (player: Player) => {
// 	if (player === Player.X) return 'Player X';
// 	else if (player === Player.O) return 'Computer';
// 	else return 'None';
// };

// // Play a turn of TicTacToe and return whether the game is over
// export async function play(): Promise<boolean> {
// 	game.printState(state);

// 	try {
// 		const validActions = game.getValidActions(state);
// 		let action;
// 		if (player === Player.X) {
// 			action = await askForAction(`${formattedPlayerName(player)} move: `);
// 			if (
// 				action < 0 ||
// 				action >= game.rowCount * game.columnCount ||
// 				validActions[action] !== true
// 			) {
// 				console.log('Invalid move!');
// 				throw new Error('Invalid move!');
// 			}
// 		} else {
// 			const neutralState = game.changePerspective(state, player);
// 			const actionProbabilities = monteCarloTreeSearch.search(neutralState);
// 			action = actionProbabilities.indexOf(Math.max(...actionProbabilities));
// 			console.log(`Computer move: ${action}`);
// 		}

// 		// Perform the action if it is valid
// 		state = game.getNextState(state, action, player);
// 		const actionOutcome = game.getActionOutcome(state, action);
// 		if (actionOutcome.isTerminal) {
// 			game.printState(state);
// 			if (actionOutcome.value === Outcome.Win)
// 				console.log(`${formattedPlayerName(player)} has won!`);
// 			else console.log("It's a draw!");
// 			return false;
// 		}

// 		player = game.getOpponent(player);
// 		return true;
// 	} catch (e) {
// 		return true;
// 	}
// }
