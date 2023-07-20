import React from 'react';
import {Box, Text} from 'ink';
import TicTacToe, {Player, State} from './engine/TicTacToe.js';
import {Board} from './Game.js';

// interface PvPGameProps {
// 	game: TicTacToe;
// 	player: Player;
// 	state: State;
// }
// export default function PvPGame({game, state}: PvPGameProps) {
// 	const formattedCellText = (player: Player) => {
// 		const cellText =
// 			player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
// 		return `| ${cellText} `;
// 	};

// 	return (
// 		<Box>
// 			<Board game={game} state={state} formattedCellText={formattedCellText} />
// 		</Box>
// 	);
// }

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};
