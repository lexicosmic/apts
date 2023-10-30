import React from 'react';
import {Box, Text} from 'ink';
import TicTacToe, {State, Player} from '../engine/TicTacToe.js';

interface BoardProps {
	game: TicTacToe;
	state: State;
	formattedCellText: (player: Player) => string;
}
export default function Board({game, state, formattedCellText}: BoardProps) {
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
