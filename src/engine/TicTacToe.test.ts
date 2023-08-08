import TicTacToe, { Player, State, Action, Outcome, ActionOutcome, ValidAction } from './TicTacToe.ts';

describe('TicTacToe', () => {
  let ticTacToe: TicTacToe;

  beforeEach(() => {
    ticTacToe = new TicTacToe();
  });

  describe('getInitialState', () => {
    it('should return a 3x3 zero matrix', () => {
      const initialState: State = ticTacToe.getInitialState();
      const expectedInitialState: State = [
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ];
      expect(initialState).toEqual(expectedInitialState);
    });
  });

  describe('getNextState', () => {
    it('should correctly update the state with the player action', () => {
      const initialState: State = ticTacToe.getInitialState();
      const nextState: State = ticTacToe.getNextState(initialState, 4, Player.X);

      // Expected state after placing X at position (1, 1)
      const expectedNextState: State = [
        [Player.None, Player.None, Player.None],
        [Player.None, Player.X, Player.None],
        [Player.None, Player.None, Player.None],
      ];

      expect(nextState).toEqual(expectedNextState);
    });
  });

  describe('getValidActions', () => {
    it('should return an array with valid actions', () => {
      const initialState: State = ticTacToe.getInitialState();
      const validActions: ValidAction[] = ticTacToe.getValidActions(initialState);

      // For the initial state, all actions should be valid
      const expectedValidActions: ValidAction[] = [
        true, true, true,
        true, true, true,
        true, true, true,
      ];

      expect(validActions).toEqual(expectedValidActions);
    });
  });

  describe('checkWin', () => {
    it('should return true for a winning row', () => {
      const state: State = [
        [Player.X, Player.X, Player.X],
        [Player.O, Player.X, Player.None],
        [Player.O, Player.O, Player.None],
      ];

      const action: Action = 2; // Player X wins with action 2 (row 0, column 2)

      const isWinningAction: boolean = ticTacToe.checkWin(state, action);
      expect(isWinningAction).toBe(true);
    });

    it('should return true for a winning column', () => {
      const state: State = [
        [Player.X, Player.O, Player.None],
        [Player.X, Player.O, Player.X],
        [Player.X, Player.None, Player.O],
      ];

      const action: Action = 0; // Player X wins with action 0 (row 0, column 0)

      const isWinningAction: boolean = ticTacToe.checkWin(state, action);
      expect(isWinningAction).toBe(true);
    });

    it('should return true for a winning primary diagonal', () => {
      const state: State = [
        [Player.X, Player.O, Player.None],
        [Player.O, Player.X, Player.None],
        [Player.None, Player.O, Player.X],
      ];

      const action: Action = 8; // Player X wins with action 8 (row 2, column 2)

      const isWinningAction: boolean = ticTacToe.checkWin(state, action);
      expect(isWinningAction).toBe(true);
    });

    it('should return true for a winning secondary diagonal', () => {
      const state: State = [
        [Player.None, Player.O, Player.X],
        [Player.O, Player.X, Player.None],
        [Player.X, Player.O, Player.None],
      ];

      const action: Action = 2; // Player X wins with action 2 (row 0, column 2)

      const isWinningAction: boolean = ticTacToe.checkWin(state, action);
      expect(isWinningAction).toBe(true);
    });

    it('should return false for a non-winning action', () => {
      const state: State = [
        [Player.X, Player.O, Player.None],
        [Player.O, Player.None, Player.None],
        [Player.X, Player.O, Player.X],
      ];

      const action: Action = 3; // Player X plays at action 3 (row 1, column 0)

      const isWinningAction: boolean = ticTacToe.checkWin(state, action);
      expect(isWinningAction).toBe(false);
    });
  });

  describe('getActionOutcome', () => {
    it('should return a winning outcome when the player wins', () => {
      const state: State = [
        [Player.X, Player.O, Player.None],
        [Player.None, Player.X, Player.O],
        [Player.X, Player.None, Player.X],
      ];

      const action: Action = 8; // Player X wins with action 8 (row 2, column 2)

      const actionOutcome: ActionOutcome = ticTacToe.getActionOutcome(state, action);
      expect(actionOutcome).toEqual({ isTerminal: true, value: Outcome.Win });
    });

    it('should return a loss outcome when the board is full', () => {
      const state: State = [
        [Player.X, Player.O, Player.X],
        [Player.O, Player.O, Player.X],
        [Player.X, Player.X, Player.O],
      ];

      const action: Action = 4; // The board is full after this action

      const actionOutcome: ActionOutcome = ticTacToe.getActionOutcome(state, action);
      expect(actionOutcome).toEqual({ isTerminal: true, value: Outcome.Loss });
    });

    it('should return a non-terminal outcome when the game is not over', () => {
      const state: State = [
        [Player.X, Player.None, Player.O],
        [Player.O, Player.None, Player.None],
        [Player.None, Player.X, Player.O],
      ];

      const action: Action = 1; // Player O plays at action 1 (row 0, column 1)

      const actionOutcome: ActionOutcome = ticTacToe.getActionOutcome(state, action);
      expect(actionOutcome).toEqual({ isTerminal: false, value: Outcome.Loss });
    });
  });

  describe('getOpponent', () => {
    it('should return Player.O for Player.X', () => {
      const opponent: Player = ticTacToe.getOpponent(Player.X);
      expect(opponent).toBe(Player.O);
    });

    it('should return Player.X for Player.O', () => {
      const opponent: Player = ticTacToe.getOpponent(Player.O);
      expect(opponent).toBe(Player.X);
    });
  });

  describe('getOpponentValue', () => {
    it('should return the negation of the input value', () => {
      const value: ActionOutcome['value'] = 1;
      const opponentValue: ActionOutcome['value'] = ticTacToe.getOpponentValue(value);
      expect(opponentValue).toBe(-value);
    });
  });

  describe('changePerspective', () => {
    it('should return the state with the perspective changed', () => {
      const state: State = [
        [Player.X, Player.None, Player.O],
        [Player.O, Player.None, Player.None],
        [Player.None, Player.X, Player.O],
      ];

      const player: Player = Player.O;

      const changedState: State = ticTacToe.changePerspective(state, player);

      const expectedChangedState: State = [
        [-1, 0, 1],
        [1, 0, 0],
        [0, -1, 1],
      ];

      expect(changedState).toEqual(expectedChangedState);
    });
  });
});
