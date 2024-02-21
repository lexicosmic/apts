import * as tf from "@tensorflow/tfjs";
import { getPredictionDataFromState_Value_Probabilities } from "./util.js";
import Game, { Action, ActionOutcome, Player, State } from "./Game.js";
import ResNet from "./ResNet.js";

export class MonteCarloNode {
	/// Attributes
	private game: Game;
	private state: State; // State of the game at this node
	private numSearches: number;
	private explorationConstant: number;
	private parent: MonteCarloNode | null;
	private actionTaken: Action | null; // Action that led to this node
	private priorProbability: number; // Probability of taking the action that led to this node

	private children: MonteCarloNode[] = [];
	private visitCount: number = 0;
	private valueSum: number = 0;

	constructor(
		game: Game,
		state: State,
		numSearches: number,
		explorationConstant: number,
		parent?: MonteCarloNode,
		actionTaken?: Action,
		priorProbability?: number
	) {
		this.game = game;
		this.state = state;
		this.numSearches = numSearches;
		this.explorationConstant = explorationConstant;
		this.parent = parent ? parent : null;
		this.actionTaken = typeof actionTaken === "number" ? actionTaken : null;
		this.priorProbability = priorProbability ? priorProbability : 0;
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
		return this.children.length > 0;
	}

	// Get the UCB value of a given child
	private getChildUcb(child: MonteCarloNode): number {
		let exploitation = 0;
		if (this.visitCount > 0)
			// Privileges the child with the lowest exploitation, as it means the opponent will have the lowest chance of winning
			exploitation = 1 - child.valueSum / (child.visitCount + 1) / 2;
		const exploration =
			this.explorationConstant *
			child.priorProbability *
			(Math.sqrt(this.visitCount) / (child.visitCount + 1));
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

	// Pick a random action and perform it, returning the outcome state as a child node
	public expand(policy: number[]) {
		policy.forEach((probability, action) => {
			if (probability > 0) {
				// Copy the state and play the action on the copy
				let childState = State.clone(this.state);
				childState.performAction(action, Player.X);
				childState.changePerspective(Player.X, Player.O);

				const child = new MonteCarloNode(
					this.game,
					childState,
					this.numSearches,
					this.explorationConstant,
					this,
					action,
					probability
				);
				this.children.push(child);
			}
		});
	}

	// Backpropagate the outcome value to the root node
	public backpropagate(outcomeValue: ActionOutcome["value"]) {
		this.valueSum += outcomeValue;
		this.visitCount++;
		outcomeValue = this.game.getOpponentValue(outcomeValue);
		if (this.parent !== null) this.parent.backpropagate(outcomeValue);
	}
}

export default class MonteCarloTreeSearch {
	/// Attributes
	private game: Game;
	private resNet: ResNet;
	private numSearches: number;
	private explorationConstant: number;

	constructor(
		game: Game,
		resNet: ResNet,
		numSearches: number,
		explorationConstant: number
	) {
		this.game = game;
		this.resNet = resNet;
		this.numSearches = numSearches;
		this.explorationConstant = explorationConstant;
	}

	/// Methods
	// Search for the best action to take
	public search(state: State): number[] {
		const neutralState = State.clone(state);
		const root = new MonteCarloNode(
			this.game,
			neutralState,
			this.numSearches,
			this.explorationConstant
		);

		for (let i = 0; i < this.numSearches; i++) {
			let node = root;

			// Selection phase
			while (node.isFullyExpanded()) node = node.selectBestChild();

			const actionOutcome = Game.getActionOutcome(
				node.getState(),
				node.getActionTaken()
			);
			// Flip the value, as the action was taken by the opponent
			let valueToBackpropagate = this.game.getOpponentValue(
				actionOutcome.value
			);

			if (!actionOutcome.isTerminal) {
				// Calculate the policy and value from the neural network
				const { value, probabilities } =
					getPredictionDataFromState_Value_Probabilities(
						node.getState(),
						this.resNet
					);

				valueToBackpropagate = value.arraySync() as number;
				tf.dispose(value);

				// Expansion phase
				node.expand(probabilities.arraySync() as number[]);
				tf.dispose(probabilities);
			}

			// Backpropagation phase
			node.backpropagate(valueToBackpropagate);
		}

		// Get the action probabilities from the root node
		let actionProbabilities: number[] = new Array(
			this.game.getActionSize()
		).fill(0);
		for (const child of root.getChildren()) {
			const action = child.getActionTaken();
			if (action == null) throw new Error("Action is null!");
			actionProbabilities[action] = child.getVisitCount();
		}
		const sum = actionProbabilities.reduce((sum, value) => sum + value, 0);
		actionProbabilities = actionProbabilities.map((value) => value / sum);
		return actionProbabilities;
	}
}
