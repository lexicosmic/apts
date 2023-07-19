import { Action } from "./TicTacToe";
import { play } from "./InteractiveGame";

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
ticTacToe();
