import { MonteCarloTreeSearchParams } from "../types.js";
import Game, {
	Action,
	ActionOutcome,
	Player,
	State,
	ValidAction,
} from "./Game.js";

class MonteCarloNode {
	/// Attributes
	private params: MonteCarloTreeSearchParams;
	private game: Game;
	private state: State;
	private parent: MonteCarloNode | null;
	private actionTaken: Action | null;

	private children: MonteCarloNode[] = [];
	private expandableActions: ValidAction[] = [];

	private visitCount: number = 0;
	private valueSum: number = 0;

	constructor(
		params: MonteCarloTreeSearchParams,
		game: Game,
		state: State,
		parent?: MonteCarloNode,
		actionTaken?: Action
	) {
		this.params = params;
		this.game = game;
		this.state = state;
		this.parent = parent ? parent : null;
		this.actionTaken = typeof actionTaken === "number" ? actionTaken : null;
		this.expandableActions = this.state.getValidActions();
	}

	/// Getters
	public getState(): State {
		return this.state;
	}

	public getActionTaken(): Action | null {
		return this.actionTaken;
	}

	public getChildren(): MonteCarloNode[] {
		return this.children;
	}

	public getVisitCount(): number {
		return this.visitCount;
	}

	/// Methods
	// Check if the node is fully expanded, i.e. all valid actions have been explored
	public isFullyExpanded(): boolean {
		const numValidActions = this.expandableActions.reduce(
			(counter, actionIsValid) => counter + (actionIsValid ? 1 : 0),
			0
		);
		return numValidActions === 0 && this.children.length > 0;
	}

	// Get the UCB value of a given child
	private getChildUcb(child: MonteCarloNode): number {
		// Privileges the child with the lowest exploitation, as it means the opponent will have the lowest chance of winning
		const exploitation = 1 - (child.valueSum / child.visitCount + 1) / 2;
		const exploration =
			this.params.explorationConstant *
			Math.sqrt(Math.log(this.visitCount) / child.visitCount);
		return exploitation + exploration;
	}

	// Select the best node among children, i.e. the one with the highest UCB
	public selectBestChild(): MonteCarloNode {
		if (this.children.length === 0)
			throw new Error("No children to select from!");

		let bestChild = this.children[0] as MonteCarloNode;
		let bestUcb = this.getChildUcb(bestChild);

		for (let i = 1; i < this.children.length; i++) {
			const child = this.children[i] as MonteCarloNode;
			const ucb = this.getChildUcb(child);
			if (ucb > bestUcb) {
				bestChild = child;
				bestUcb = ucb;
			}
		}
		return bestChild;
	}

	// Pick a random action from the list of valid actions
	private pickRandomAction(): Action {
		const validActions: Action[] = this.expandableActions.reduce(
			(actions, currentIsValid, index) =>
				currentIsValid ? [...actions, index] : actions,
			[] as Action[]
		);
		const randomIndex = Math.floor(Math.random() * validActions.length);
		const selectedAction = validActions[randomIndex];
		if (typeof selectedAction !== "number")
			throw new Error("No valid actions to pick from!");
		return selectedAction;
	}

	// Pick a random action and perform it, returning the outcome state as a child node
	public expand(): MonteCarloNode {
		const selectedAction = this.pickRandomAction();
		this.expandableActions[selectedAction] = false;

		// Copy the state and play the action on the copy
		let childState = State.clone(this.state);
		childState.performAction(selectedAction, Player.X);
		childState.changePerspective(Player.X, Player.O);

		const child = new MonteCarloNode(
			this.params,
			this.game,
			childState,
			this,
			selectedAction
		);
		this.children.push(child);
		return child;
	}

	// Simulate a game from the current state, returning the outcome value
	public simulate(): ActionOutcome["value"] {
		let { isTerminal, value } = Game.getActionOutcome(
			this.state,
			this.actionTaken
		);
		value = this.game.getOpponentValue(value);
		if (isTerminal) return value;

		// Copy the state and play random actions, with alternate players, until the game is over
		let rolloutState = State.clone(this.state);
		let rolloutPlayer = Player.X;
		while (true) {
			const selectedAction = this.pickRandomAction();
			rolloutState.performAction(selectedAction, rolloutPlayer);
			const actionOutcome = Game.getActionOutcome(rolloutState, selectedAction);
			isTerminal = actionOutcome.isTerminal;
			value = actionOutcome.value;
			if (isTerminal) {
				if (rolloutPlayer === Player.O)
					value = this.game.getOpponentValue(value);
				return value;
			}
			rolloutPlayer = this.game.getOpponent(rolloutPlayer);
		}
	}

	// Backpropagate the outcome value to the root node
	public backpropagate(outcomeValue: ActionOutcome["value"]) {
		this.valueSum += outcomeValue;
		this.visitCount++;

		outcomeValue = this.game.getOpponentValue(outcomeValue);
		if (this.parent) this.parent.backpropagate(outcomeValue);
	}
}

export default class MonteCarloTreeSearch {
	/// Attributes
	private game: Game;
	private params: MonteCarloTreeSearchParams;

	constructor(game: Game, params: MonteCarloTreeSearchParams) {
		this.game = game;
		this.params = params;
	}

	/// Methods
	// Search for the best action to take
	public search(state: State): number[] {
		const root = new MonteCarloNode(this.params, this.game, state);

		for (let i = 0; i < this.params.numSearches; i++) {
			let node = root;

			// Selection phase
			while (node.isFullyExpanded()) node = node.selectBestChild();

			const actionOutcome = Game.getActionOutcome(
				node.getState(),
				node.getActionTaken()
			);
			// Flip the value, as the action was taken by the opponent
			let outcomeValue = this.game.getOpponentValue(actionOutcome.value);

			if (!actionOutcome.isTerminal) {
				// Expansion phase
				node = node.expand();

				// Simulation phase
				outcomeValue = node.simulate();
			}

			// Backpropagation phase
			node.backpropagate(outcomeValue);
		}

		// Get the action probabilities from the root node
		let actionProbabilities: number[] = new Array(
			this.game.getActionSize()
		).fill(0);
		for (const child of root.getChildren())
			actionProbabilities[child.getActionTaken() as number] =
				child.getVisitCount();
		const sum = actionProbabilities.reduce((sum, value) => sum + value, 0);
		actionProbabilities = actionProbabilities.map(
			(value) => value / sum
		) as number[];
		return actionProbabilities;
	}
}
