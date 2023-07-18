// Definitions
export enum Player {
  None = 0,
  One = 1,
  Two = 2,
}
export type State = Player[][];
type Action = number;
type ActionOutcome = {
  isTerminal: boolean;
  hasWon: boolean;
};

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

  // Print the state to the console
  printState(state: State) {
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

  // Perform the action and return the new state
  getNextState(state: State, action: Action, player: Player): State {
    const row = action;
    const column = action % this.columnCount;
    // Play the action on the given state
    state[row][column] = player;
    return state;
  }

  // Return the list of valid actions
  getValidActions(state: State): boolean[] {
    const validActions: boolean[] = [];
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        const cell = state[i][j];
        validActions.push(cell === Player.None);
      }
    }
    return validActions;
  }

  // Return if the player has won when playing the action
  checkWin(state: State, action: Action): boolean {
    const row = action;
    const column = action % this.columnCount;
    const player = state[row][column];

    // Won on the row
    if (state[row].every((cell) => cell === player)) return true;
    // Won on the column
    if (state.every((row) => row[column] === player)) return true;
    // Won on the primary diagonal
    if (state.every((row, i) => row[i] === player)) return true;
    // Won on the secondary diagonal
    if (state.every((row, i) => row[this.columnCount - 1 - i] === player))
      return true;
    // No win
    return false;
  }

  // Return if the game is over and if the player has won
  getActionOutcome(state: State, action: Action): ActionOutcome {
    // Check if the player has won
    if (this.checkWin(state, action)) return { isTerminal: true, hasWon: true };
    // Check if the board is full
    if (!this.getValidActions(state).some((valid) => valid))
      return { isTerminal: true, hasWon: false };
    // No terminal state
    return { isTerminal: false, hasWon: false };
  }
}
