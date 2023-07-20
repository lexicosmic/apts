import React from 'react';
import {Box, Newline, Text} from 'ink';
import {GameMode} from './types.js';
import TicTacToe, {
	ActionOutcome,
	Outcome,
	Player,
	State,
} from './engine/TicTacToe.js';
import {formattedCellText, formattedPlayerName} from './PvPGame.js';
import TextInput from 'ink-text-input';

interface GameProps {
	gameMode: GameMode;
}
export default function Game({gameMode}: GameProps) {
	const game = new TicTacToe();

	const [state, setState] = React.useState<State>(game.getInitialState());
	const [player, setPlayer] = React.useState<Player>(Player.X);
	const [input, setInput] = React.useState<string>('');
	const [invalidMove, setInvalidMove] = React.useState<boolean>(false);
	const [history, setHistory] = React.useState<JSX.Element[]>([
		<Box key={`history--1`} flexDirection="column">
			<Text>Good Luck!</Text>
			<Board game={game} state={state} formattedCellText={formattedCellText} />
		</Box>,
	]);
	const [gameOutcome, setOutcome] = React.useState<ActionOutcome>({
		isTerminal: false,
		value: Outcome.Loss,
	});

	function handleSubmit(input: string): void {
		try {
			// Validate the move
			setInvalidMove(false);
			const action = Number.parseInt(input);
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

	let gameScreen = null;
	if (gameMode === GameMode.PvP)
		gameScreen = (
			<Box flexDirection="column">
				<Box>
					<Text>{formattedPlayerName(player)} move: </Text>
					<TextInput
						value={input}
						onChange={value => setInput(value)}
						onSubmit={handleSubmit}
					/>
				</Box>
				{invalidMove && <Text>Invalid move!</Text>}
			</Box>
		);

	return (
		<Box flexDirection="column">
			{history}
			{gameOutcome.isTerminal ? (
				<>
					<Text>
						{gameOutcome.value === Outcome.Win
							? `${formattedPlayerName(player)} has won!`
							: "It's a draw!"}
					</Text>
					<Newline />
				</>
			) : (
				gameScreen
			)}
		</Box>
	);
}

interface BoardProps {
	game: TicTacToe;
	state: State;
	formattedCellText: (player: Player) => string;
}
export function Board({game, state, formattedCellText}: BoardProps) {
	const board = [];
	for (let i = 0; i < game.rowCount; i++) {
		const row = [];
		for (let j = 0; j < game.columnCount; j++) {
			const cell = state[i]![j];
			row.push(
				<Text key={`cell-${i + j}`}>
					{formattedCellText(cell ?? Player.None)}
				</Text>,
			);
		}
		board.push(<Text key={`row-${i}`}>{row}|</Text>);
	}
	return (
		<Box flexDirection="column" marginBottom={1}>
			{board}
		</Box>
	);
}
