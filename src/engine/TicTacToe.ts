import Game, {ActionOutcome, Player, State, ValidAction} from './Game.js';

export default class TicTacToeGame extends Game {
	constructor(rowCount?: number, columnCount?: number) {
		super(rowCount, columnCount);
	}

	/// Getters
	public getInitialState(): State {
		return new TicTacToeState(this.rowCount, this.columnCount);
	}

	public getOpponent(player: Player): Player {
		if (player === Player.None) return Player.None;
		return player === Player.X ? Player.O : Player.X;
	}

	// Return the outcome value, considering that the opponent is the one playing
	public getOpponentValue(
		value: ActionOutcome['value'],
	): ActionOutcome['value'] {
		return -value;
	}
}

export class TicTacToeState extends State {
	constructor(rowCount: number, columnCount: number) {
		super(rowCount, columnCount);
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

	/// Methods
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

	public checkWin(action: number): boolean {
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

	public performAction(action: number, player: Player): void {
		const row = Math.floor(action / this.columnCount);
		const column = action % this.columnCount;
		// Play the action on the given state
		this.table[row][column] = player;
	}
}
