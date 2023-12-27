import Game, {
	ActionOutcome,
	EncodedState,
	Player,
	State,
	ValidAction,
} from "../Game.js";

export default class TicTacToeGame extends Game {
	/// Attributes
	private readonly rowCount: number;
	private readonly columnCount: number;
	private readonly actionSize: number;

	constructor(rowCount: number, columnCount: number) {
		super();
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.actionSize = rowCount * columnCount;
	}

	/// Getters
	public getRowCount(): number {
		return this.rowCount;
	}

	public getColumnCount(): number {
		return this.columnCount;
	}

	public getActionSize(): number {
		return this.actionSize;
	}

	public getInitialState(): State {
		return new TicTacToeState(this.rowCount, this.columnCount);
	}

	public getOpponent(player: Player): Player {
		if (player === Player.None) return Player.None;
		return player === Player.X ? Player.O : Player.X;
	}

	// Return the outcome value, considering that the opponent is the one playing
	public getOpponentValue(
		value: ActionOutcome["value"]
	): ActionOutcome["value"] {
		return -value + 0;
	}
}

export class TicTacToeState extends State {
	/// Attributes
	private readonly rowCount: number;
	private readonly columnCount: number;
	private table: Array<Array<Player>>;

	constructor(rowCount: number, columnCount: number) {
		super();
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.table = Array.from(Array(rowCount), () =>
			Array.from(Array(columnCount), () => Player.None)
		);
	}

	/// Getters
	public getValidActions(): Array<ValidAction> {
		const validActions: Array<ValidAction> = [];
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = this.table[i]![j];
				validActions.push(cell === Player.None);
			}
		}
		return validActions;
	}

	public getPlayerAt(position: number): Player | null {
		const row = Math.floor(position / this.columnCount);
		const column = position % this.columnCount;
		return this.table[row]![column];
	}

	public getEncodedState(): Array<Array<Array<number>>> {
		const encodedState: EncodedState = Array.from(Array(this.rowCount), () =>
			Array.from(Array(this.columnCount), () => Array(3).fill(0))
		);
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = this.table[i]![j];
				if (cell === Player.X) encodedState[i]![j]![2] = 1;
				else if (cell === Player.O) encodedState[i]![j]![0] = 1;
				else encodedState[i]![j]![1] = 1;
			}
		}
		return encodedState;
	}

	/// Setters
	public setPlayerAt(player: Player, position: number): void {
		const row = Math.floor(position / this.columnCount);
		const column = position % this.columnCount;
		this.table[row][column] = player;
	}

	/// Methods
	public toString(): string {
		let boardString = "";
		for (let i = 0; i < this.table.length; i++) {
			boardString += "|";
			for (let j = 0; j < this.table[i].length; j++) {
				const cell = this.table[i][j];
				boardString += " ";
				if (cell === Player.X) boardString += "X";
				else if (cell === Player.O) boardString += "O";
				else boardString += "-";
				boardString += " |";
			}
			boardString += "\n";
		}
		return boardString;
	}

	public checkWin(action: number): boolean {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		const player = this.table[row]![column];

		// Won on the row
		if (this.table[row]!.every((cell) => cell === player)) return true;
		// Won on the column
		if (this.table.every((row) => row[column] === player)) return true;
		// Won on the primary diagonal
		if (this.table.every((row, i) => row[i] === player)) return true;
		// Won on the secondary diagonal
		if (this.table.every((row, i) => row[this.columnCount - 1 - i] === player))
			return true;
		// No win
		return false;
	}

	public performAction(action: number, player: Player): void {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		// Play the action on the given state
		this.table[row][column] = player;
	}

	/// Static methods
	public changePerspective(
		currentPlayer: Player,
		opponentPlayer: Player
	): void {
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.columnCount; j++) {
				const cell = this.table[i]![j];
				if (cell === currentPlayer) this.table[i]![j] = opponentPlayer;
				else if (cell === opponentPlayer) this.table[i]![j] = currentPlayer;
			}
		}
	}
}
