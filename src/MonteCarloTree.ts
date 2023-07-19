import Game, { Action, State, ValidAction } from "./TicTacToe";

class MonteCarloNode {
  // Attributes
  readonly game: Game;
  readonly params: MonteCarloTreeParams;
  readonly state: State;
  readonly parent: MonteCarloNode | null;
  readonly actionTaken: Action | null;

  readonly children: MonteCarloNode[] = [];
  readonly expandableActions: ValidAction[] = [];

  readonly visitCount: number = 0;
  readonly valueSum: number = 0;

  constructor(
    game: Game,
    params: MonteCarloTreeParams,
    state: State,
    parent?: MonteCarloNode,
    actionTaken?: Action
  ) {
    this.game = game;
    this.params = params;
    this.state = state;
    this.parent = parent ? parent : null;
    this.actionTaken = actionTaken ? actionTaken : null;

    this.expandableActions = this.game.getValidActions(this.state);
  }
}

interface MonteCarloTreeParams {
  readonly numSearches: number;
}
export default class MonteCarloTree {
  // Attributes
  readonly game: Game;
  readonly params: MonteCarloTreeParams;

  constructor(game: Game, params: MonteCarloTreeParams) {
    this.game = game;
    this.params = params;
  }

  /// Methods

  search(state: State) {}
}
