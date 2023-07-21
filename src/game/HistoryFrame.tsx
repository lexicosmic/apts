import React from 'react';
import {Box, Text} from 'ink';
import TicTacToe, {Player, State} from '../engine/TicTacToe.js';
import Board from '../Board.js';

type HistoryFrameProps = {
	game: TicTacToe;
	state: State;
	text: string;
	formattedCellText: (player: Player) => string;
};
export default function HistoryFrame({
	game,
	state,
	text,
	formattedCellText,
}: HistoryFrameProps) {
	return (
		<Box flexDirection="column">
			<Text>{text}</Text>
			<Board game={game} state={state} formattedCellText={formattedCellText} />
		</Box>
	);
}
