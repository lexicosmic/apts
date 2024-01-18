import { GameName } from "../types";

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

export type EncodedState = Array<Array<Array<number>>>;
export type Action = number;
export type ValidAction = boolean;
export type ActionOutcome = {
	isTerminal: boolean;
	value: number;
};

export default abstract class Game {
	/// Getters
	public abstract getName(): GameName;

	public abstract getRowCount(): number;

	public abstract getColumnCount(): number;

	public abstract getActionSize(): number;

	public abstract getInitialState(): State;

	public abstract getPlayerName(player: Player): string;

	public abstract getOpponent(player: Player): Player;

	// Return the outcome value, considering that the opponent is the one playing
	public abstract getOpponentValue(
		value: ActionOutcome["value"]
	): ActionOutcome["value"];

	/// Static methods
	// Return if the game is over and if the player has won
	public static getActionOutcome(
		state: State,
		action: Action | null
	): ActionOutcome {
		// Check if the player has won
		if (action === null ? false : state.checkWin(action))
			return { isTerminal: true, value: Outcome.Win };
		// Check if the game is a draw
		if (state.getValidActions().some((validAction) => validAction) === false)
			return { isTerminal: true, value: Outcome.Loss };
		// No terminal state
		return { isTerminal: false, value: Outcome.Loss };
	}
}

export abstract class State {
	/// Getters
	public abstract getValidActions(): Array<ValidAction>;

	public abstract getPlayerAt(position: number): Player | null;

	// Return three 2D-arrays. Each one represents a player.
	// The value is 1 if the cell is occupied by the player, or 0 otherwise
	// The order of the matrices is: O, None, X
	public abstract getEncodedState(): EncodedState;

	/// Setters
	public abstract setPlayerAt(player: Player, position: number): void;

	/// Methods
	public abstract toString(): string;

	public abstract checkWin(action: Action): boolean;

	public abstract performAction(action: Action, player: Player): void;

	// Return the state with the perspective changed, i.e. the opponent is now the player
	public abstract changePerspective(
		currentPlayer: Player,
		opponentPlayer: Player
	): void;

	/// Static methods
	public static clone(state: State): State {
		const clone = Object.create(state);
		return clone;
	}
}
