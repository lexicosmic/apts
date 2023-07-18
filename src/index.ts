import { TicTacToe } from "./TicTacToe";

const game = new TicTacToe();
const board = game.getInitialState();
game.printGame(board);
