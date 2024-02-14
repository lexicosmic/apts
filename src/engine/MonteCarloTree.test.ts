import { MonteCarloTreeSearchParams } from "../types.js";
import { State } from "./Game.js";
import MonteCarloTreeSearch from "./MonteCarloTree.js";
import ResNet from "./ResNet.js";
import TicTacToeGame from "./games/TicTacToe.js";
import Game from "./games/TicTacToe.js";

describe("MonteCarloTreeSearch", () => {
	let game: Game;
	let resNet: ResNet;
	let params: MonteCarloTreeSearchParams;
	let monteCarloTreeSearch: MonteCarloTreeSearch;

	beforeEach(() => {
		game = new TicTacToeGame(3, 3);
		resNet = new ResNet(game, { numResBlocks: 4, numHiddenChannels: 64 });
		monteCarloTreeSearch = new MonteCarloTreeSearch(game, resNet, 100, 1);
	});

	// Add test cases for MonteCarloNode methods here

	describe("search", () => {
		it("should return an array of action probabilities", () => {
			// Set up a test state
			const testState: State = game.getInitialState();

			// Execute the search
			const actionProbabilities: number[] =
				monteCarloTreeSearch.search(testState);

			// Make assertions on the returned action probabilities
			expect(actionProbabilities).toHaveLength(game.getActionSize());
			expect(actionProbabilities.every((probability) => probability >= 0)).toBe(
				true
			);
			expect(
				actionProbabilities.reduce((sum, value) => sum + value, 0)
			).toBeCloseTo(1, 5); // Close to 1 due to rounding errors
		});
	});
});
