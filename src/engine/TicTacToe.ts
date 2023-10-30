import Game, {ActionOutcome, Player} from './Game.ts';

export default class TicTacToeGame extends Game {
	constructor(rowCount?: number, columnCount?: number) {
		super(rowCount, columnCount);
	}

	/// Getters
	public getOpponent(player: Player): Player {
		return player === Player.X ? Player.O : Player.X;
	}

	// Return the outcome value, considering that the opponent is the one playing
	public getOpponentValue(
		value: ActionOutcome['value'],
	): ActionOutcome['value'] {
		return -value;
	}
}
