import React from "react";
import { Box, Text } from "ink";
import Game, { Player, State } from "../../engine/Game.js";

interface BoardProps {
	game: Game;
	state: State;
	formattedCellText: (player: Player) => string;
}
export default function Board({ game, state, formattedCellText }: BoardProps) {
	const board = [];
	for (let i = 0; i < game.getRowCount(); i++) {
		const row = [];
		for (let j = 0; j < game.getColumnCount(); j++) {
			const cell = state.getPlayerAt(i * game.getColumnCount() + j);
			row.push(
				<Text key={`cell-${i + j}`}>
					{formattedCellText(cell ?? Player.None)}
				</Text>
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
