import * as tf from '@tensorflow/tfjs';
import ResNet from './ResNet.ts';
import Game, {Action, ActionOutcome, Player, State} from './TicTacToe.ts';

export interface MonteCarloTreeSearchParams {
	readonly numSearches: number;
	readonly explorationConstant: number;
}

export class MonteCarloNode {
	// Attributes
	readonly game: Game;
	readonly params: MonteCarloTreeSearchParams;
	readonly state: State; // State of the game at this node
	readonly parent: MonteCarloNode | null;
	readonly actionTaken: Action | null; // Action that led to this node
	readonly priorProbability: number; // Probability of taking the action that led to this node

	readonly children: MonteCarloNode[] = [];
	visitCount: number = 0;
	valueSum: number = 0;

	constructor(
		game: Game,
		params: MonteCarloTreeSearchParams,
		state: State,
		parent?: MonteCarloNode,
		actionTaken?: Action,
		priorProbability?: number,
	) {
		this.game = game;
		this.params = params;
		this.state = state;
		this.parent = parent ? parent : null;
		this.actionTaken = typeof actionTaken === 'number' ? actionTaken : null;
		this.priorProbability = priorProbability ? priorProbability : 0;
	}

	/// Methods

	// Check if the node is fully expanded, i.e. all valid actions have been explored
	isFullyExpanded(): boolean {
		return this.children.length > 0;
	}

	// Get the UCB value of a given child
	getChildUcb(child: MonteCarloNode): number {
		let exploitation = 0;
		if (this.visitCount > 0)
			// Privileges the child with the lowest exploitation, as it means the opponent will have the lowest chance of winning
			exploitation = 1 - (child.valueSum / child.visitCount + 1) / 2;
		const exploration =
			this.params.explorationConstant *
			child.priorProbability *
			(Math.sqrt(this.visitCount) / (child.visitCount + 1));
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

	// Pick a random action and perform it, returning the outcome state as a child node
	expand(policy: number[]) {
		policy.forEach((probability, action) => {
			if (probability > 0) {
				// Copy the state and play the action on the copy
				let childState = this.state.map(row => row.slice());
				childState = this.game.getNextState(childState, action, Player.X);
				childState = this.game.changePerspective(childState, Player.O);

				const child = new MonteCarloNode(
					this.game,
					this.params,
					childState,
					this,
					action,
					probability,
				);
				this.children.push(child);
			}
		});
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
	readonly model: ResNet;

	constructor(game: Game, model: ResNet, params: MonteCarloTreeSearchParams) {
		this.game = game;
		this.model = model;
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
			let valueToBackpropagate = this.game.getOpponentValue(
				actionOutcome.value,
			);

			if (!actionOutcome.isTerminal) {
				// Calculate the policy and value from the neural network
				const tensorState = tf
					.tensor(this.game.getEncondedState(node.state))
					.expandDims(0) as tf.Tensor4D;
				const [policy, value] = this.model.call(tensorState);
				const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);

				// Mask the policy to only allow valid actions
				const validActions = this.game.getValidActions(node.state);
				const maskedPolicy = softMaxPolicy.mul(
					tf.tensor(validActions).expandDims(0),
				);
				const sum = maskedPolicy.sum().arraySync();
				const actionProbabilities = maskedPolicy
					.div(sum)
					.squeeze()
					.arraySync() as number[];

				valueToBackpropagate = value.dataSync()[0]!;

				// Expansion phase
				node.expand(actionProbabilities);
			}

			// Backpropagation phase
			node.backpropagate(valueToBackpropagate);
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
