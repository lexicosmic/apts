import React from 'react';
import {Box, Text} from 'ink';
import Game, {Action, ActionOutcome, Player, State} from '../engine/Game.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTree.js';
import HistoryFrame from './HistoryFrame.js';
import {performAction} from './PlayGame.js';
import ActionSelector from './ActionSelector.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Player X' : 'Computer';
};

interface PvCGameProps {
	game: Game;
	state: State;
	player: Player;
	history: JSX.Element[];
	monteCarloTreeSearch: MonteCarloTreeSearch;
	setState: React.Dispatch<React.SetStateAction<State>>;
	setPlayer: React.Dispatch<React.SetStateAction<Player>>;
	setOutcome: React.Dispatch<React.SetStateAction<ActionOutcome>>;
	setHistory: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}
export default function PvCGame({
	game,
	state,
	player,
	history,
	monteCarloTreeSearch,
	setState,
	setPlayer,
	setOutcome,
	setHistory,
}: PvCGameProps) {
	// Interface
	let nextHistory: JSX.Element[] = [...history];
	let userHistoryFrame: JSX.Element | null = null;
	let computerHistoryFrame: JSX.Element | null = null;

	function handleActionSelect(state: State, player: Player, action: Action) {
		if (state === null || player === null || action === null) return;
		let currentState = state.clone();
		let currentPlayer = player;

		// User turn
		const [nextState, outcome] = performAction({
			action,
			state: currentState,
			player: currentPlayer,
			setOutcome,
			setState,
		});
		userHistoryFrame = (
			<HistoryFrame
				key={`history-${history.length}`}
				game={game}
				state={nextState}
				text={`${formattedPlayerName(currentPlayer)} move: ${action}`}
				formattedCellText={formattedCellText}
			/>
		);
		if (userHistoryFrame !== null) nextHistory.push(userHistoryFrame);
		currentState = nextState;

		if (!outcome.isTerminal) {
			currentPlayer = game.getOpponent(currentPlayer);
			// Computer turn
			let neutralState = currentState.clone();
			neutralState.changePerspective(
				currentPlayer,
				game.getOpponent(currentPlayer),
			);
			const actionProbabilities = monteCarloTreeSearch.search(neutralState);
			let computerAction = actionProbabilities.indexOf(
				Math.max(...actionProbabilities),
			);
			const [nextState, outcome] = performAction({
				action: computerAction,
				state: currentState,
				player: currentPlayer,
				setOutcome,
				setState,
			});
			computerHistoryFrame = (
				<HistoryFrame
					key={`history-${history.length + 1}`}
					game={game}
					state={nextState}
					text={`${formattedPlayerName(currentPlayer)} move: ${computerAction}`}
					formattedCellText={formattedCellText}
				/>
			);
			if (computerHistoryFrame !== null) nextHistory.push(computerHistoryFrame);
			if (outcome.isTerminal) setPlayer(currentPlayer);
		}

		setHistory(nextHistory);
	}

	return (
		<Box flexDirection="column">
			<Text>{formattedPlayerName(player)} move: </Text>
			{player === Player.X ? (
				<ActionSelector
					game={game}
					state={state}
					handleSelect={(action: Action) =>
						handleActionSelect(state, player, action)
					}
				/>
			) : null}
		</Box>
	);
}
