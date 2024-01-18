import React from "react";
import { Box, Text } from "ink";
import Game, {
	Action,
	ActionOutcome,
	Player,
	State,
} from "../../engine/Game.js";
import ActionSelector from "./ActionSelector.js";
import { performAction } from "./PlayGame.js";
import HistoryFrame from "./HistoryFrame.js";

export const formattedCellText = (player: Player) => {
	const cellText = player === Player.X ? "X" : player === Player.O ? "O" : " ";
	return `| ${cellText} `;
};

export const formattedPlayerName = (player: Player) => {
	return player === Player.X ? "Player X" : "Player O";
};

interface PvPGameProps {
	game: Game;
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
	// Interface
	let nextHistory = [...history];
	let userHistoryFrame: JSX.Element | null = null;

	function handleActionSelect(state: State, player: Player, action: Action) {
		if (state === null || player === null || action === null) return;
		let currentState = State.clone(state);
		let currentPlayer = player;

		let [nextState, outcome] = performAction({
			action,
			state: currentState,
			player: currentPlayer,
			setOutcome,
			setState,
		});
		userHistoryFrame = (
			<HistoryFrame
				key={`history-${history.length}`}
				game={game}
				state={nextState}
				text={`${formattedPlayerName(currentPlayer)} move: ${action}`}
				formattedCellText={formattedCellText}
			/>
		);
		if (userHistoryFrame !== null) nextHistory.push(userHistoryFrame);
		if (!outcome.isTerminal) setPlayer(game.getOpponent(currentPlayer));
		setHistory(nextHistory);
	}

	return (
		<Box flexDirection="column">
			<Text>{formattedPlayerName(player)} move: </Text>
			<ActionSelector
				game={game}
				state={state}
				handleSelect={(action: Action) =>
					handleActionSelect(state, player, action)
				}
			/>
		</Box>
	);
}
