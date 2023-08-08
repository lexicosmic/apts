import React from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';
import TicTacToe, {ActionOutcome, Player, State} from '../engine/TicTacToe.js';
import {getValidAction, performAction} from './Game.js';
import HistoryFrame from './HistoryFrame.js';
import Board from './Board.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Player X' : 'Player O';
};

interface HandleSubmitParams {
	game: TicTacToe;
	state: State;
	player: Player;
	input: string;
	history: JSX.Element[];
	setState: React.Dispatch<React.SetStateAction<State>>;
	setPlayer: React.Dispatch<React.SetStateAction<Player>>;
	setInvalidMove: React.Dispatch<React.SetStateAction<boolean>>;
	setOutcome: React.Dispatch<React.SetStateAction<ActionOutcome>>;
	setHistory: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
	setInput: React.Dispatch<React.SetStateAction<string>>;
}
function handleSubmit({
	game,
	state,
	player,
	input,
	history,
	setState,
	setPlayer,
	setInvalidMove,
	setOutcome,
	setHistory,
	setInput,
}: HandleSubmitParams): void {
	try {
		setInvalidMove(false);
		let action: number;

		// Validate the move
		action = Number.parseInt(input);
		if (
			Number.isNaN(action) ||
			action < 0 ||
			action >= game.rowCount * game.columnCount
		)
			throw new Error('Invalid move!');

		// Perform the action if it is valid
		const validActions = game.getValidActions(state);
		if (validActions[action] === true) {
			const nextState = game.getNextState(state, action, player);
			const actionOutcome = game.getActionOutcome(nextState, action);
			if (!actionOutcome.isTerminal) setPlayer(game.getOpponent(player));
			setOutcome(actionOutcome);
			setState(nextState);
		} else throw new Error('Invalid move!');

		setHistory([
			...history,
			<Box key={`history-${history.length}`} flexDirection="column">
				<Text>
					{formattedPlayerName(player)} move: {action}
				</Text>
				<Board
					game={game}
					state={state}
					formattedCellText={formattedCellText}
				/>
			</Box>,
		]);
	} catch (e) {
		setInvalidMove(true);
	}
	// Clear the input
	setInput('');
}

interface PvPGameProps {
	game: TicTacToe;
	state: State;
	player: Player;
	history: JSX.Element[];
	setState: React.Dispatch<React.SetStateAction<State>>;
	setPlayer: React.Dispatch<React.SetStateAction<Player>>;
	setOutcome: React.Dispatch<React.SetStateAction<ActionOutcome>>;
	setHistory: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}
export default function PvPGame({
	game,
	state,
	player,
	history,
	setState,
	setPlayer,
	setOutcome,
	setHistory,
}: PvPGameProps) {
	const [input, setInput] = React.useState<string>('');
	const [invalidMove, setInvalidMove] = React.useState<boolean>(false);

	function handleSubmit(input: string) {
		let newHistory = [...history];
		let userHistoryFrame: JSX.Element | null = null;

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
					state={state}
					text={`${formattedPlayerName(player)} move: ${action}`}
					formattedCellText={formattedCellText}
				/>
			);
			if (userHistoryFrame !== null) newHistory.push(userHistoryFrame);

			if (!gameOver) setPlayer(game.getOpponent(player));
		}

		setHistory(newHistory);
		setInput('');
	}

	return (
		<Box flexDirection="column">
			<Box>
				<Text>{formattedPlayerName(player)} move: </Text>
				<TextInput
					value={input}
					onChange={value => setInput(value)}
					onSubmit={() => handleSubmit(input)}
				/>
			</Box>
			{invalidMove && <Text>Invalid move!</Text>}
		</Box>
	);
}
