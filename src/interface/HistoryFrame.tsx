import React from 'react';
import {Box, Text} from 'ink';
import Board from './Board.js';
import Game, {Player, State} from '../engine/Game.js';

type HistoryFrameProps = {
	game: Game;
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
