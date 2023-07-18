import TicTacToe, { Action, Player } from "./TicTacToe";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
console.clear();

const game = new TicTacToe();
let player = Player.One;
let state = game.getInitialState();

async function askForAction(): Promise<Action> {
  let action = -1;

  const input = new Promise((resolve) => {
    readline.question(`P${player}: `, resolve);
  });
  action = parseInt((await input) as string);

  // Check if input is a valid move
  if (isNaN(action)) {
    console.log("Invalid input!");
    throw new Error("Invalid input!");
  } else if (action < 0 || action >= game.rowCount * game.columnCount) {
    console.log("Invalid move!");
    throw new Error("Invalid move!");
  }
  return action;
}

async function play(): Promise<boolean> {
  game.printState(state);
  try {
    let action = await askForAction();
    const validActions = game.getValidActions(state);

    // Perform the action if it is valid
    if (validActions[action] === true) {
      state = game.getNextState(state, action, player);

      const { isTerminal, hasWon } = game.getActionOutcome(state, action);

      if (isTerminal) {
        game.printState(state);
        if (hasWon) console.log(`Player ${player} has won!`);
        else console.log("It's a draw!");
        return false;
      }

      player = game.getOpponent(player);
    } else console.log("Invalid move!");

    return true;
  } catch (e) {
    return true;
  }
}

const ticTacToe = async () => {
  while (await play()) {}
  readline.close();
  return;
};
ticTacToe();
