import React from 'react';
import {Box, Text} from 'ink';
import TicTacToe, {
	Action,
	ActionOutcome,
	Player,
	State,
} from '../engine/TicTacToe.js';
import ActionSelector from './ActionSelector.js';
import {performAction} from './Game.js';
import HistoryFrame from './HistoryFrame.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Player X' : 'Player O';
};

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
	let newHistory = [...history];
	let userHistoryFrame: JSX.Element | null = null;

	function handleActionSelect(action: Action) {
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
		setHistory(newHistory);
	}

	return (
		<Box flexDirection="column">
			<Text>{formattedPlayerName(player)} move: </Text>
			<ActionSelector
				game={game}
				state={state}
				handleSelect={(action: Action) => handleActionSelect(action)}
			/>
		</Box>
	);
}
