import Game, {
	Action,
	ActionOutcome,
	Player,
	State,
	ValidAction,
} from './TicTacToe.js';

export interface MonteCarloTreeSearchParams {
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

	visitCount: number = 0;
	valueSum: number = 0;

	constructor(
		game: Game,
		params: MonteCarloTreeSearchParams,
		state: State,
		parent?: MonteCarloNode,
		actionTaken?: Action,
	) {
		this.game = game;
		this.params = params;
		this.state = state;
		this.parent = parent ? parent : null;
		this.actionTaken = typeof actionTaken === 'number' ? actionTaken : null;

		this.expandableActions = this.game.getValidActions(this.state);
	}

	/// Methods

	// Check if the node is fully expanded, i.e. all valid actions have been explored
	isFullyExpanded(): boolean {
		const numValidActions = this.expandableActions.reduce(
			(counter, actionIsValid) => counter + (actionIsValid ? 1 : 0),
			0,
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
		if (this.children.length === 0)
			throw new Error('No children to select from!');

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
	#pickRandomAction(): Action {
		const validActions: Action[] = this.expandableActions.reduce(
			(actions, currentIsValid, index) =>
				currentIsValid ? [...actions, index] : actions,
			[] as Action[],
		);
		const randomIndex = Math.floor(Math.random() * validActions.length);
		const selectedAction = validActions[randomIndex];
		if (typeof selectedAction !== 'number')
			throw new Error('No valid actions to pick from!');
		return selectedAction;
	}

	// Pick a random action and perform it, returning the outcome state as a child node
	expand(): MonteCarloNode {
		const selectedAction = this.#pickRandomAction();
		this.expandableActions[selectedAction] = false;

		// Copy the state and play the action on the copy
		let childState = this.state.map(row => row.slice());
		childState = this.game.getNextState(childState, selectedAction, Player.X);
		childState = this.game.changePerspective(childState, Player.O);

		const child = new MonteCarloNode(
			this.game,
			this.params,
			childState,
			this,
			selectedAction,
		);
		this.children.push(child);
		return child;
	}

	// Simulate a game from the current state, returning the outcome value
	simulate(): ActionOutcome['value'] {
		const actionOutcome = this.game.getActionOutcome(
			this.state,
			this.actionTaken,
		);
		let outcomeValue = this.game.getOpponentValue(actionOutcome.value);
		if (actionOutcome.isTerminal) return outcomeValue;

		// Copy the state and play random actions, with alternate players, until the game is over
		let rolloutState = this.state.map(row => row.slice());
		let rolloutPlayer = Player.X;
		while (true) {
			const selectedAction = this.#pickRandomAction();
			rolloutState = this.game.getNextState(
				rolloutState,
				selectedAction,
				rolloutPlayer,
			);
			const actionOutcome = this.game.getActionOutcome(
				rolloutState,
				selectedAction,
			);
			if (actionOutcome.isTerminal) {
				if (rolloutPlayer === Player.O)
					outcomeValue = this.game.getOpponentValue(actionOutcome.value);
				return outcomeValue;
			}
			rolloutPlayer = this.game.getOpponent(rolloutPlayer);
		}
	}

	// Backpropagate the outcome value to the root node
	backpropagate(outcomeValue: ActionOutcome['value']) {
		this.valueSum += outcomeValue;
		this.visitCount++;

		outcomeValue = this.game.getOpponentValue(outcomeValue);
		if (this.parent) this.parent.backpropagate(outcomeValue);
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

	// Search for the best action to take
	search(state: State): number[] {
		const root = new MonteCarloNode(this.game, this.params, state);

		for (let i = 0; i < this.params.numSearches; i++) {
			let node = root;

			// Selection phase
			while (node.isFullyExpanded()) node = node.selectBestChild();

			const actionOutcome = this.game.getActionOutcome(
				node.state,
				node.actionTaken,
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
		let actionProbabilities: number[] = new Array(this.game.actionSize).fill(0);
		for (const child of root.children)
			actionProbabilities[child.actionTaken as number] = child.visitCount;
		const sum = actionProbabilities.reduce((sum, value) => sum + value, 0);
		actionProbabilities = actionProbabilities.map(
			value => value / sum,
		) as number[];
		return actionProbabilities;
	}
}
