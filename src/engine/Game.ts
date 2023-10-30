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
export type ValidAction = boolean;
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
		this.state = this.getInitialState();
	}

	/// Getters
	protected abstract getInitialState(): State;

	public abstract getOpponent(player: Player): Player;

	// Return the outcome value, considering that the opponent is the one playing
	public abstract getOpponentValue(
		value: ActionOutcome['value'],
	): ActionOutcome['value'];

	public getState(): State {
		return this.state;
	}

	public getRowCount(): number {
		return this.rowCount;
	}

	public getColumnCount(): number {
		return this.columnCount;
	}

	public getActionSize(): number {
		return this.rowCount * this.columnCount;
	}

	// Return if the game is over and if the player has won
	public static getActionOutcome(
		state: State,
		action: Action | null,
	): ActionOutcome {
		// Check if the player has won
		if (action === null ? false : state.checkWin(action))
			return {isTerminal: true, value: Outcome.Win};
		// Check if the board is full
		if (state.getValidActions().length === 0)
			return {isTerminal: true, value: Outcome.Loss};
		// No terminal state
		return {isTerminal: false, value: Outcome.Loss};
	}
}

export abstract class State {
	/// Attributes
	protected rowCount: number;
	protected columnCount: number;
	protected table: Array<Array<Player>>;

	constructor(rowCount: number, columnCount: number) {
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.table = Array.from(Array(rowCount), () =>
			Array(columnCount).fill(Player.None),
		);
	}

	/// Getters
	public abstract getValidActions(): Array<ValidAction>;

	public getPlayerAt(line: number, column: number): Player | null {
		const player = this.table[line][column];
		if (player === undefined) return null;
		return player;
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
	public abstract print(): void;

	public abstract checkWin(action: Action): boolean;

	public abstract performAction(action: Action, player: Player): void;

	public clone(): State {
		const clone = Object.create(this);
		clone.table = this.table.map(row => row.slice());
		return clone;
	}

	// Return the state with the perspective changed, i.e. the opponent is now the player
	public changePerspective(
		currentPlayer: Player,
		opponentPlayer: Player,
	): void {
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = this.getPlayerAt(i, j);
				if (cell === null) break;
				if (cell === currentPlayer) this.setPlayerAt(opponentPlayer, i, j);
				else if (cell === opponentPlayer) this.setPlayerAt(currentPlayer, i, j);
			}
		}
	}
}
