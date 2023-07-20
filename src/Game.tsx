import React from 'react';
import {Box, Text} from 'ink';
import {GameMode} from './types.js';
import TicTacToe, {Player, State} from './engine/TicTacToe.js';
import {formattedCellText} from './PvPGame.js';

interface GameProps {
	gameMode: GameMode;
}
export default function Game({gameMode}: GameProps) {
	const game = new TicTacToe();
	let player = Player.X;
	let state = game.getInitialState();

	if (gameMode === GameMode.PvP)
		return (
			<Board
				game={game}
				state={state}
				formattedCellText={formattedCellText}
			></Board>
		);

	return null;
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
	return <Box flexDirection="column">{board}</Box>;
}
