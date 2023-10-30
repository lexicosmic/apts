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

export type EncodedState = Array<State>;
export type Action = number;
export type ActionOutcome = {
	isTerminal: boolean;
	value: number;
};

export default abstract class Game {
	/// Attributes
	protected rowCount: number;
	protected columnCount: number;
	protected state: State;

	constructor(rowCount?: number, columnCount?: number) {
		this.rowCount = rowCount || 3;
		this.columnCount = columnCount || 3;
		this.state = new State(this.rowCount, this.columnCount);
	}

	/// Getters
	public getState(): State {
		return this.state;
	}

	public abstract getOpponent(player: Player): Player;

	// Return the outcome value, considering that the opponent is the one playing
	public abstract getOpponentValue(
		value: ActionOutcome['value'],
	): ActionOutcome['value'];

	// Return if the game is over and if the player has won
	public getActionOutcome(action: Action | null): ActionOutcome {
		// Check if the player has won
		if (action === null ? false : this.state.checkWin(action))
			return {isTerminal: true, value: Outcome.Win};
		// Check if the board is full
		if (this.state.getValidActions().length === 0)
			return {isTerminal: true, value: Outcome.Loss};
		// No terminal state
		return {isTerminal: false, value: Outcome.Loss};
	}
}

export class State {
	/// Attributes
	private rowCount: number;
	private columnCount: number;
	private table: Array<Array<Player>>;

	constructor(rowCount: number, columnCount: number) {
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.table = Array.from(Array(rowCount), () =>
			Array(columnCount).fill(Player.None),
		);
	}

	/// Getters
	public getPlayerAt(line: number, column: number): Player | null {
		const player = this.table[line][column];
		if (player === undefined) return null;
		return player;
	}

	public getValidActions(): Array<Action> {
		let aux = 0;
		const validActions: Array<Action> = [];
		for (let i = 0; i < this.table.length; i++) {
			for (let j = 0; j < this.table[i].length; j++) {
				const cell = this.table[i]![j];
				if (cell === Player.None) validActions.push(aux);
				aux++;
			}
		}
		return validActions;
	}

	// Return three 2D-arrays. Each one represents a player.
	// The value is 1 if the cell is occupied by the player, or 0 otherwise
	// The order of the matrices is: O, None, X
	public getEncodedState() {
		const encodedState = Array.from(Array(3), () =>
			Array.from(Array(this.rowCount), () => Array(this.columnCount).fill(0)),
		);
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = this.table[i]![j];
				if (cell === Player.X) encodedState[2]![i]![j] = 1;
				else if (cell === Player.O) encodedState[0]![i]![j] = 1;
				else encodedState[1]![i]![j] = 1;
			}
		}
		return encodedState;
	}

	/// Setters
	public setPlayerAt(player: Player, line: number, column: number): void {
		this.table[line][column] = player;
	}

	/// Methods
	public changePerspective(player: Player): void {
		this.table = this.table.map(row =>
			row.map(cell => (cell * player === -0 ? 0 : cell * player)),
		);
	}

	public print(): void {
		let boardString = '';
		for (let i = 0; i < this.table.length; i++) {
			boardString += '|';
			for (let j = 0; j < this.table[i].length; j++) {
				const cell = this.table[i][j];
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

	public checkWin(action: Action): boolean {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		const player = this.table[row]![column];

		// Won on the row
		if (this.table[row]!.every(cell => cell === player)) return true;
		// Won on the column
		if (this.table.every(row => row[column] === player)) return true;
		// Won on the primary diagonal
		if (this.table.every((row, i) => row[i] === player)) return true;
		// Won on the secondary diagonal
		if (this.table.every((row, i) => row[this.columnCount - 1 - i] === player))
			return true;
		// No win
		return false;
	}

	public performAction(action: Action, player: Player): void {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		// Play the action on the given state
		this.table[row][column] = player;
	}
}
