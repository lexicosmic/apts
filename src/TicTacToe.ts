// Definitions
export enum Player {
  None = 0,
  One = 1,
  Two = 2,
}
type State = number[][];
type Action = number;

export default class TicTacToe {
  // Attributes
  readonly rowCount: number;
  readonly columnCount: number;
  readonly actionSize: number;

  constructor() {
    console.log("TicTacToe\n");
    this.rowCount = 3;
    this.columnCount = 3;
    this.actionSize = this.rowCount * this.columnCount;
  }

  /// Methods

  // Print the board to the console
  printGame(state: State) {
    let boardString = "";
    for (let i = 0; i < this.rowCount; i++) {
      boardString += "|";
      for (let j = 0; j < this.columnCount; j++) {
        const cell = state[i][j];
        boardString += " ";
        if (cell === Player.One) boardString += "X";
        else if (cell === Player.Two) boardString += "O";
        else boardString += "-";
        boardString += " |";
      }
      boardString += "\n";
    }
    console.log(boardString);
  }

  // Return the initial board (3x3 zero matrix)
  getInitialState(): State {
    return [
      [Player.None, Player.None, Player.None],
      [Player.None, Player.None, Player.None],
      [Player.None, Player.None, Player.None],
    ];
  }

  // Perform the move and return the new state
  getNextState(state: State, action: Action, player: Player): State {
    const row = action;
    const column = action % this.columnCount;
    // TODO: Check if the move is valid
    // Play the move
    state[row][column] = player;
    return state;
  }
}
