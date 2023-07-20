// import {Action} from './TicTacToe.js';
// import {play as PvCPlay} from './PvCGame.js';
// import {play as PvPPlay} from './PvPGame.js';

// const readline = require('readline').createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// 	terminal: false,
// });
// console.clear();

// // Ask for an action, through user input on the console
// export async function askForAction(questionText: string): Promise<Action> {
// 	let action = -1;

// 	const input = new Promise(resolve => {
// 		readline.question(questionText, resolve);
// 	});
// 	action = parseInt((await input) as string);

// 	// Check if input is a valid move
// 	if (isNaN(action)) {
// 		console.log('Invalid input!');
// 		throw new Error('Invalid input!');
// 	}

// 	return action;
// }

// // Play a game of TicTacToe
// const ticTacToe = async () => {
// 	console.log('== TicTacToe ==\n');
// 	let gameMode = -1;
// 	do {
// 		gameMode = await askForAction('Pick a game mode\n[0] PvP [1] PvC ');
// 	} while (gameMode !== 0 && gameMode !== 1);

// 	console.log('\nGood luck!\n');

// 	if (gameMode === 0) while (await PvPPlay()) {}
// 	else while (await PvCPlay()) {}

// 	readline.close();
// 	return;
// };
// ticTacToe();
