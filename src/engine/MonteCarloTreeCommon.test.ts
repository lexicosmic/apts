import {MonteCarloTreeSearchParams} from '../types.js';
import MonteCarloTreeSearch from './MonteCarloTreeCommon.js';
import Game, {Player, State} from './TicTacToe.js';

describe('MonteCarloTreeSearch', () => {
	let game: Game;
	let params: MonteCarloTreeSearchParams;
	let monteCarloTreeSearch: MonteCarloTreeSearch;

	beforeEach(() => {
		game = new Game();
		params = {
			numSearches: 100,
			explorationConstant: 1.0,
		};
		monteCarloTreeSearch = new MonteCarloTreeSearch(game, params);
	});

	// Add test cases for MonteCarloNode methods here

	describe('search', () => {
		it('should return an array of action probabilities', () => {
			// Set up a test state
			const testState: State = [
				[Player.None, Player.None, Player.None],
				[Player.None, Player.None, Player.None],
				[Player.None, Player.None, Player.None],
			];

			// Execute the search
			const actionProbabilities: number[] =
				monteCarloTreeSearch.search(testState);

			// Make assertions on the returned action probabilities
			expect(actionProbabilities).toHaveLength(game.actionSize);
			expect(actionProbabilities.every(probability => probability >= 0)).toBe(
				true,
			);
			expect(
				actionProbabilities.reduce((sum, value) => sum + value, 0),
			).toBeCloseTo(1, 5); // Close to 1 due to rounding errors
		});
	});
});
