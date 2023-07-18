export class TicTacToe {
  // Attributes
  readonly rowCount: number;
  readonly columnCount: number;
  readonly actionSize: number;

  constructor() {
    console.log("TicTacToe");
    this.rowCount = 3;
    this.columnCount = 3;
    this.actionSize = this.rowCount * this.columnCount;
  }

  // Methods
  //
  // Print the board to the console
  printGame(board: number[][]) {
    let boardString = "";
    for (let i = 0; i < this.rowCount; i++) {
      boardString += "|";
      for (let j = 0; j < this.columnCount; j++) {
        const cell = board[i][j];
        boardString += " ";
        if (cell === 1) boardString += "X";
        else if (cell === 2) boardString += "O";
        else boardString += "-";
        boardString += " |";
      }
      boardString += "\n";
    }
    console.log(boardString);
  }

  // Returns the initial board (3x3 zero matrix)
  getInitialState(): number[][] {
    // 0: empty; 1: player 1; 2: player 2
    return [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
}
