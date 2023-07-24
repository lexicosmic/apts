import React, {useEffect} from 'react';
import TicTacToe, {ActionOutcome, Player, State} from '../engine/TicTacToe.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTree.js';
import HistoryFrame from './HistoryFrame.js';
import {performAction} from './Game.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Computer X' : 'Computer O';
};

interface CvCGameProps {
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
export default function CvCGame({
	game,
	state,
	player,
	history,
	monteCarloTreeSearch,
	setState,
	setPlayer,
	setOutcome,
	setHistory,
}: CvCGameProps) {
	const [gameOver, setGameOver] = React.useState<boolean>(false);

	useEffect(() => {
		if (gameOver) return;

		const neutralState = game.changePerspective(state, player);
		const actionProbabilities = monteCarloTreeSearch.search(neutralState);
		const action = actionProbabilities.indexOf(
			Math.max(...actionProbabilities),
		);
		setGameOver(
			performAction({
				action,
				game,
				state,
				player,
				setOutcome,
				setState,
			}),
		);
		const historyFrame = (
			<HistoryFrame
				key={`history-${history.length + 1}`}
				game={game}
				state={JSON.parse(JSON.stringify(state))}
				text={`${formattedPlayerName(player)} move: ${action}`}
				formattedCellText={formattedCellText}
			/>
		);
		if (historyFrame !== null) setHistory([...history, historyFrame]);

		setPlayer(game.getOpponent(player));
	}, [player]);

	return null;
}
