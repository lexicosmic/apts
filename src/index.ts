import TicTacToe, { Player } from "./TicTacToe";

const game = new TicTacToe();
let board = game.getInitialState();
let validActions = game.getValidActions(board);
game.printState(board);
console.table(validActions);

board = game.getNextState(board, 0, Player.One);
validActions = game.getValidActions(board);
game.printState(board);
console.table(validActions);
