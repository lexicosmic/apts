import TicTacToe, { Player } from "./TicTacToe";

const game = new TicTacToe();
const board = game.getInitialState();
game.printGame(board);

game.getNextState(board, 0, Player.One);
game.printGame(board);
