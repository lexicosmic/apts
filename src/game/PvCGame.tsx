import React from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';
import TicTacToe, {ActionOutcome, Player, State} from '../engine/TicTacToe.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTree.js';
import HistoryFrame from './HistoryFrame.js';
import {getValidAction, performAction} from './Game.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Player X' : 'Computer';
};

interface PvCGameProps {
	game: TicTacToe;
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
	const [input, setInput] = React.useState<string>('');
	const [invalidMove, setInvalidMove] = React.useState<boolean>(false);

	let newHistory = [...history];
	let userHistoryFrame: JSX.Element | null = null;
	let computerHistoryFrame: JSX.Element | null = null;

	function handleSubmit(input: string) {
		// User turn
		let action = getValidAction({
			input,
			game,
			state,
			setInvalidMove,
		});
		if (action !== null) {
			let gameOver = performAction({
				action,
				game,
				state,
				player,
				setOutcome,
				setState,
			});
			userHistoryFrame = (
				<HistoryFrame
					key={`history-${history.length}`}
					game={game}
					state={JSON.parse(JSON.stringify(state))}
					text={`${formattedPlayerName(player)} move: ${action}`}
					formattedCellText={formattedCellText}
				/>
			);
			if (userHistoryFrame !== null) newHistory.push(userHistoryFrame);

			if (!gameOver) {
				player = game.getOpponent(player);

				// Computer turn
				const neutralState = game.changePerspective(state, player);
				const actionProbabilities = monteCarloTreeSearch.search(neutralState);
				action = actionProbabilities.indexOf(Math.max(...actionProbabilities));
				gameOver = performAction({
					action,
					game,
					state,
					player,
					setOutcome,
					setState,
				});
				computerHistoryFrame = (
					<HistoryFrame
						key={`history-${history.length + 1}`}
						game={game}
						state={JSON.parse(JSON.stringify(state))}
						text={`${formattedPlayerName(player)} move: ${action}`}
						formattedCellText={formattedCellText}
					/>
				);
				if (computerHistoryFrame !== null)
					newHistory.push(computerHistoryFrame);
				if (gameOver) setPlayer(player);
			}
		}

		setHistory(newHistory);
		setInput('');
	}

	return (
		<Box flexDirection="column">
			<Box>
				<Text>{formattedPlayerName(player)} move: </Text>
				{player === Player.X ? (
					<TextInput
						value={input}
						onChange={value => setInput(value)}
						onSubmit={() => handleSubmit(input)}
					/>
				) : null}
			</Box>
			{invalidMove && <Text>Invalid move!</Text>}
		</Box>
	);
}
