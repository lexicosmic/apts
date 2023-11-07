import React, {useEffect} from 'react';
import Game, {ActionOutcome, Player, State} from '../engine/Game.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTree.js';
import HistoryFrame from './HistoryFrame.js';
import {performAction} from './PlayGame.js';

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? 'X' : player === Player.O ? 'O' : ' ';
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? 'Computer X' : 'Computer O';
};

interface CvCGameProps {
	game: Game;
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

		const neutralState = state.clone();
		neutralState.changePerspective(player, game.getOpponent(player));
		const actionProbabilities = monteCarloTreeSearch.search(neutralState);
		const computerAction = actionProbabilities.indexOf(
			Math.max(...actionProbabilities),
		);
		const [nextState, outcome] = performAction({
			action: computerAction,
			state,
			player: player,
			setOutcome,
			setState,
		});
		setGameOver(outcome.isTerminal);
		const historyFrame = (
			<HistoryFrame
				key={`history-${history.length + 1}`}
				game={game}
				state={JSON.parse(JSON.stringify(nextState))}
				text={`${formattedPlayerName(player)} move: ${computerAction}`}
				formattedCellText={formattedCellText}
			/>
		);
		if (historyFrame !== null) setHistory([...history, historyFrame]);

		if (!outcome.isTerminal) setPlayer(game.getOpponent(player));
	}, [player]);

	return null;
}
