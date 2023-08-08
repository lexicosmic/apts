// Definitions
export enum Player {
	None = 0,
	X = 1,
	O = -1,
}
export enum Outcome {
	Win = 1,
	Loss = 0,
}

export type State = Array<Array<Player>>;
export type EncodedState = Array<State>;
export type Action = number;
export type ValidAction = boolean;
export type ActionOutcome = {
	isTerminal: boolean;
	value: number;
};

export default class TicTacToe {
	// Attributes
	readonly rowCount: number;
	readonly columnCount: number;
	readonly actionSize: number;

	constructor(rowCount?: number, columnCount?: number) {
		this.rowCount = rowCount || 3;
		this.columnCount = columnCount || 3;
		this.actionSize = this.rowCount * this.columnCount;
	}

	/// Methods

	// Print the state to the console
	printState(state: State) {
		let boardString = '';
		for (let i = 0; i < this.rowCount; i++) {
			boardString += '|';
			for (let j = 0; j < this.columnCount; j++) {
				const cell = state[i]![j];
				boardString += ' ';
				if (cell === Player.X) boardString += 'X';
				else if (cell === Player.O) boardString += 'O';
				else boardString += '-';
				boardString += ' |';
			}
			boardString += '\n';
		}
		console.log(boardString);
	}

	// Return the initial board (3x3 zero matrix)
	getInitialState(): State {
		return Array.from(Array(this.rowCount), () =>
			Array(this.columnCount).fill(Player.None),
		);
	}

	// Perform the action and return the new state
	getNextState(state: State, action: Action, player: Player): State {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		// Play the action on the given state
		state[row]![column] = player;
		return state;
	}

	// Return the list of valid actions
	getValidActions(state: State): ValidAction[] {
		const validActions: ValidAction[] = [];
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = state[i]![j];
				validActions.push(cell === Player.None);
			}
		}
		return validActions;
	}

	// Return if the player has won when playing the action
	checkWin(state: State, action: Action | null): boolean {
		if (action === null) return false;

		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		const player = state[row]![column];

		// Won on the row
		if (state[row]!.every(cell => cell === player)) return true;
		// Won on the column
		if (state.every(row => row[column] === player)) return true;
		// Won on the primary diagonal
		if (state.every((row, i) => row[i] === player)) return true;
		// Won on the secondary diagonal
		if (state.every((row, i) => row[this.columnCount - 1 - i] === player))
			return true;
		// No win
		return false;
	}

	// Return if the game is over and if the player has won
	getActionOutcome(state: State, action: Action | null): ActionOutcome {
		// Check if the player has won
		if (this.checkWin(state, action))
			return {isTerminal: true, value: Outcome.Win};
		// Check if the board is full
		if (!this.getValidActions(state).some(valid => valid))
			return {isTerminal: true, value: Outcome.Loss};
		// No terminal state
		return {isTerminal: false, value: Outcome.Loss};
	}

	// Return the opponent of the given player
	getOpponent(player: Player): Player {
		return player === Player.X ? Player.O : Player.X;
	}

	// Return the outcome value, considering that the opponent is the one playing
	getOpponentValue(value: ActionOutcome['value']): ActionOutcome['value'] {
		return -value;
	}

	// Return the state with the perspective changed, i.e. the opponent is now the player
	changePerspective(state: State, player: Player): State {
		return state.map(row => row.map(cell => cell * player));
	}

	// Return three 2D-arrays. Each one represents a player.
	// The value is 1 if the cell is occupied by the player, or 0 otherwise
	// The order of the matrices is: O, None, X
	getEncodedState(state: State): EncodedState {
		const encodedState = Array.from(Array(3), () =>
			Array.from(Array(this.rowCount), () => Array(this.columnCount).fill(0)),
		);
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = state[i]![j];
				if (cell === Player.X) encodedState[2]![i]![j] = 1;
				else if (cell === Player.O) encodedState[0]![i]![j] = 1;
				else encodedState[1]![i]![j] = 1;
			}
		}
		return encodedState;
	}
}
