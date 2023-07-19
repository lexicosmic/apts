import Game, { Action, State, ValidAction } from "./TicTacToe";

interface MonteCarloTreeSearchParams {
  readonly numSearches: number;
  readonly explorationConstant: number;
}

class MonteCarloNode {
  // Attributes
  readonly game: Game;
  readonly params: MonteCarloTreeSearchParams;
  readonly state: State;
  readonly parent: MonteCarloNode | null;
  readonly actionTaken: Action | null;

  readonly children: MonteCarloNode[] = [];
  readonly expandableActions: ValidAction[] = [];

  readonly visitCount: number = 0;
  readonly valueSum: number = 0;

  constructor(
    game: Game,
    params: MonteCarloTreeSearchParams,
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

  /// Methods

  // Check if the node is fully expanded, i.e. all valid actions have been explored
  isFullyExpanded(): boolean {
    const numValidActions = this.expandableActions.reduce(
      (counter, actionIsValid) => counter + (actionIsValid ? 1 : 0),
      0
    );
    return numValidActions === 0 && this.children.length > 0;
  }

  // Get the UCB value of a given child
  getChildUcb(child: MonteCarloNode): number {
    // Privileges the child with the lowest exploitation, as it means the opponent will have the lowest chance of winning
    const exploitation = 1 - (child.valueSum / child.visitCount + 1) / 2;
    const exploration =
      this.params.explorationConstant *
      Math.sqrt(Math.log(this.visitCount) / child.visitCount);
    return exploitation + exploration;
  }

  // Select the best node among children, i.e. the one with the highest UCB
  selectBestChild(): MonteCarloNode {
    let bestChild: MonteCarloNode = this.children[0];
    let bestUcb = this.getChildUcb(bestChild);

    for (let i = 1; i < this.children.length; i++) {
      const child = this.children[i];
      const ucb = this.getChildUcb(child);
      if (ucb > bestUcb) {
        bestChild = child;
        bestUcb = ucb;
      }
    }
    return bestChild;
  }
}

export default class MonteCarloTreeSearch {
  // Attributes
  readonly game: Game;
  readonly params: MonteCarloTreeSearchParams;

  constructor(game: Game, params: MonteCarloTreeSearchParams) {
    this.game = game;
    this.params = params;
  }

  /// Methods

  #selectionPhase(node: MonteCarloNode): MonteCarloNode {
    while (node.isFullyExpanded()) node = node.selectBestChild();
    return node;
  }

  // Search for the best action to take
  search(state: State) {
    const root = new MonteCarloNode(this.game, this.params, state);

    for (let i = 0; i < this.params.numSearches; i++) {
      let node = this.#selectionPhase(root);

      const actionOutcome = this.game.getActionOutcome(
        node.state,
        node.actionTaken
      );
      // Flip the value, as the action was taken by the opponent
      const outcomeValue = this.game.getOpponentValue(actionOutcome.value);

      if (!actionOutcome.isTerminal) {
        // Expansion phase
        // Simulation phase
      }

      // Backpropagation phase
    }
    return root;
  }
}
