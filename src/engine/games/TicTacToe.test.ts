import Game, {
	Action,
	ActionOutcome,
	Outcome,
	Player,
	State,
	ValidAction,
} from "../Game";
import TicTacToeGame, { TicTacToeState } from "./TicTacToe";

describe("TicTacToe", () => {
	let ticTacToe: TicTacToeGame;

	beforeEach(() => {
		ticTacToe = new TicTacToeGame(3, 3);
	});

	describe("getInitialState", () => {
		it("should return a 3x3 zero matrix", () => {
			const initialState: State = ticTacToe.getInitialState();
			const expectedInitialState: State = new TicTacToeState(3, 3);
			for (let i = 0; i < 9; i++)
				expectedInitialState.setPlayerAt(Player.None, i);
			expect(initialState).toEqual(expectedInitialState);
		});
	});

	describe("getNextState", () => {
		it("should correctly update the state with the player action", () => {
			const initialState: State = ticTacToe.getInitialState();
			let nextState: State = initialState.clone();
			nextState.performAction(4, Player.X);

			// Expected state after placing X at position (1, 1)
			const expectedNextState: State = new TicTacToeState(3, 3);
			for (let i = 0; i < 9; i++) expectedNextState.setPlayerAt(Player.None, i);
			expectedNextState.setPlayerAt(Player.X, 4);

			expect(nextState).toEqual(expectedNextState);
		});
	});

	describe("getValidActions", () => {
		it("should return an array with valid actions", () => {
			const initialState: State = ticTacToe.getInitialState();
			const validActions: ValidAction[] = initialState.getValidActions();

			// For the initial state, all actions should be valid
			const expectedValidActions: ValidAction[] = [
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
			];

			expect(validActions).toEqual(expectedValidActions);
		});
	});

	describe("checkWin", () => {
		it("should return true for a winning row", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.X, 1);
			state.setPlayerAt(Player.X, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.X, 4);
			state.setPlayerAt(Player.None, 5);
			state.setPlayerAt(Player.O, 6);
			state.setPlayerAt(Player.O, 7);
			state.setPlayerAt(Player.None, 8);

			const action: Action = 2; // Player X wins with action 2 (row 0, column 2)

			const isWinningAction: boolean = state.checkWin(action);
			expect(isWinningAction).toBe(true);
		});

		it("should return true for a winning column", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.None, 2);
			state.setPlayerAt(Player.X, 3);
			state.setPlayerAt(Player.O, 4);
			state.setPlayerAt(Player.X, 5);
			state.setPlayerAt(Player.X, 6);
			state.setPlayerAt(Player.None, 7);
			state.setPlayerAt(Player.O, 8);

			const action: Action = 0; // Player X wins with action 0 (row 0, column 0)

			const isWinningAction: boolean = state.checkWin(action);
			expect(isWinningAction).toBe(true);
		});

		it("should return true for a winning primary diagonal", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.None, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.X, 4);
			state.setPlayerAt(Player.None, 5);
			state.setPlayerAt(Player.None, 6);
			state.setPlayerAt(Player.O, 7);
			state.setPlayerAt(Player.X, 8);

			const action: Action = 8; // Player X wins with action 8 (row 2, column 2)

			const isWinningAction: boolean = state.checkWin(action);
			expect(isWinningAction).toBe(true);
		});

		it("should return true for a winning secondary diagonal", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.None, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.X, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.X, 4);
			state.setPlayerAt(Player.None, 5);
			state.setPlayerAt(Player.X, 6);
			state.setPlayerAt(Player.O, 7);
			state.setPlayerAt(Player.None, 8);

			const action: Action = 2; // Player X wins with action 2 (row 0, column 2)

			const isWinningAction: boolean = state.checkWin(action);
			expect(isWinningAction).toBe(true);
		});

		it("should return false for a non-winning action", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.None, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.None, 4);
			state.setPlayerAt(Player.None, 5);
			state.setPlayerAt(Player.X, 6);
			state.setPlayerAt(Player.O, 7);
			state.setPlayerAt(Player.X, 8);

			const action: Action = 3; // Player X plays at action 3 (row 1, column 0)

			const isWinningAction: boolean = state.checkWin(action);
			expect(isWinningAction).toBe(false);
		});
	});

	describe("getActionOutcome", () => {
		it("should return a winning outcome when the player wins", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.None, 2);
			state.setPlayerAt(Player.None, 3);
			state.setPlayerAt(Player.X, 4);
			state.setPlayerAt(Player.O, 5);
			state.setPlayerAt(Player.X, 6);
			state.setPlayerAt(Player.None, 7);
			state.setPlayerAt(Player.X, 8);

			const action: Action = 8; // Player X wins with action 8 (row 2, column 2)

			const actionOutcome: ActionOutcome = Game.getActionOutcome(state, action);
			expect(actionOutcome).toEqual({ isTerminal: true, value: Outcome.Win });
		});

		it("should return a loss outcome when the board is full", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.O, 1);
			state.setPlayerAt(Player.X, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.O, 4);
			state.setPlayerAt(Player.X, 5);
			state.setPlayerAt(Player.X, 6);
			state.setPlayerAt(Player.X, 7);
			state.setPlayerAt(Player.O, 8);

			const action: Action = 4; // The board is full after this action

			const actionOutcome: ActionOutcome = Game.getActionOutcome(state, action);
			expect(actionOutcome).toEqual({ isTerminal: true, value: Outcome.Loss });
		});

		it("should return a non-terminal outcome when the game is not over", () => {
			const state = new TicTacToeState(3, 3);
			state.setPlayerAt(Player.X, 0);
			state.setPlayerAt(Player.None, 1);
			state.setPlayerAt(Player.O, 2);
			state.setPlayerAt(Player.O, 3);
			state.setPlayerAt(Player.None, 4);
			state.setPlayerAt(Player.None, 5);
			state.setPlayerAt(Player.None, 6);
			state.setPlayerAt(Player.X, 7);
			state.setPlayerAt(Player.O, 8);

			const action: Action = 1; // Player O plays at action 1 (row 0, column 1)

			const actionOutcome: ActionOutcome = Game.getActionOutcome(state, action);
			expect(actionOutcome).toEqual({ isTerminal: false, value: Outcome.Loss });
		});
	});

	describe("getOpponent", () => {
		it("should return Player.O for Player.X", () => {
			const opponent: Player = ticTacToe.getOpponent(Player.X);
			expect(opponent).toBe(Player.O);
		});

		it("should return Player.X for Player.O", () => {
			const opponent: Player = ticTacToe.getOpponent(Player.O);
			expect(opponent).toBe(Player.X);
		});
	});

	describe("getOpponentValue", () => {
		it("should return the negation of the input value", () => {
			const value: ActionOutcome["value"] = 1;
			const opponentValue: ActionOutcome["value"] =
				ticTacToe.getOpponentValue(value);
			expect(opponentValue).toBe(-value);
		});
	});

	describe("changePerspective", () => {
		it("should return the state with the perspective changed", () => {
			const changedState = new TicTacToeState(3, 3);
			changedState.setPlayerAt(Player.X, 0);
			changedState.setPlayerAt(Player.None, 1);
			changedState.setPlayerAt(Player.O, 2);
			changedState.setPlayerAt(Player.O, 3);
			changedState.setPlayerAt(Player.None, 4);
			changedState.setPlayerAt(Player.None, 5);
			changedState.setPlayerAt(Player.None, 6);
			changedState.setPlayerAt(Player.X, 7);
			changedState.setPlayerAt(Player.O, 8);
			const player: Player = Player.O;
			changedState.changePerspective(player, Player.X);

			const expectedChangedState = new TicTacToeState(3, 3);
			expectedChangedState.setPlayerAt(Player.O, 0);
			expectedChangedState.setPlayerAt(Player.None, 1);
			expectedChangedState.setPlayerAt(Player.X, 2);
			expectedChangedState.setPlayerAt(Player.X, 3);
			expectedChangedState.setPlayerAt(Player.None, 4);
			expectedChangedState.setPlayerAt(Player.None, 5);
			expectedChangedState.setPlayerAt(Player.None, 6);
			expectedChangedState.setPlayerAt(Player.O, 7);
			expectedChangedState.setPlayerAt(Player.X, 8);

			expect(changedState).toEqual(expectedChangedState);
		});
	});
});
