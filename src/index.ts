import TicTacToe, { Action } from "./TicTacToe";
import { play } from "./InteractiveGame";
import MonteCarloTreeSearch from "./MonteCarloTree";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
console.clear();

// Ask for an action, through user input on the console
export async function askForAction(questionText: string): Promise<Action> {
  let action = -1;

  const input = new Promise((resolve) => {
    readline.question(questionText, resolve);
  });
  action = parseInt((await input) as string);

  // Check if input is a valid move
  if (isNaN(action)) {
    console.log("Invalid input!");
    throw new Error("Invalid input!");
  }

  return action;
}

// Play a game of TicTacToe
const ticTacToe = async () => {
  console.log("TicTacToe\n");
  while (await play()) {}
  readline.close();
  return;
};
// ticTacToe();

const game = new TicTacToe();

const monteCarloTreeSearch = new MonteCarloTreeSearch(game, {
  numSearches: 1000,
  explorationConstant: 1.41,
});

const state = game.getInitialState();
monteCarloTreeSearch.search(state);
