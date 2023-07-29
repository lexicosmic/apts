import React from 'react';
import {Box, Newline, Text} from 'ink';
import {GameMode} from '../types.js';
import MonteCarloTreeSearch from '../engine/MonteCarloTree.js';
import TicTacToe, {
	Action,
	ActionOutcome,
	Outcome,
	Player,
	State,
} from '../engine/TicTacToe.js';
import PvPGame, {
	formattedCellText as PvPFormattedCellText,
	formattedPlayerName as PvPFormattedPlayerName,
} from './PvPGame.js';
import PvCGame, {
	formattedCellText as PvCFormattedCellText,
	formattedPlayerName as PvCFormattedPlayerName,
} from './PvCGame.js';
import HistoryFrame from './HistoryFrame.js';
import CvCGame, {
	formattedCellText as CvCFormattedCellText,
	formattedPlayerName as CvCFormattedPlayerName,
} from './CvCGame.js';
import ResNet from '../engine/ResNet.js';

type ParsedActionParams = {
	input: string;
	game: TicTacToe;
};
export const parsedAction = ({input, game}: ParsedActionParams): Action => {
	let action: Action;
	action = Number.parseInt(input);
	if (
		Number.isNaN(action) ||
		action < 0 ||
		action >= game.rowCount * game.columnCount
	)
		throw new Error('Invalid move!');
	return action;
};

type GetValidActionParams = ParsedActionParams & {
	state: State;
	setInvalidMove: React.Dispatch<React.SetStateAction<boolean>>;
};
export function getValidAction({
	input,
	game,
	state,
	setInvalidMove,
}: GetValidActionParams): Action | null {
	setInvalidMove(false);
	try {
		const action = parsedAction({input, game});
		const validActions = game.getValidActions(state);
		if (validActions[action] !== true) throw new Error('Invalid move!');
		return action;
	} catch (e) {
		setInvalidMove(true);
		return null;
	}
}

type PerformActionParams = {
	action: Action;
	game: TicTacToe;
	state: State;
	player: Player;
	setOutcome: React.Dispatch<React.SetStateAction<ActionOutcome>>;
	setState: React.Dispatch<React.SetStateAction<State>>;
};
export function performAction({
	action,
	game,
	state,
	player,
	setOutcome,
	setState,
}: PerformActionParams): boolean {
	const nextState = game.getNextState(state, action, player);
	const actionOutcome = game.getActionOutcome(nextState, action);
	setOutcome(actionOutcome);
	setState(nextState);
	return actionOutcome.isTerminal;
}

interface GameProps {
	gameMode: GameMode;
}
export default function Game({gameMode}: GameProps) {
	const game = new TicTacToe();
	const model = new ResNet(game, 4, 64);
	const monteCarloTreeSearch = new MonteCarloTreeSearch(game, model, {
		numSearches: 1000,
		explorationConstant: 2,
	});
	let gameScreen = null;
	let formattedCellText: (player: Player) => string;
	let formattedPlayerName: (player: Player) => string;

	const [state, setState] = React.useState<State>(game.getInitialState());
	const [player, setPlayer] = React.useState<Player>(Player.X);
	const [history, setHistory] = React.useState<JSX.Element[]>([]);
	const [gameOutcome, setOutcome] = React.useState<ActionOutcome>({
		isTerminal: false,
		value: Outcome.Loss,
	});

	if (gameMode === GameMode.PvP) {
		formattedCellText = PvPFormattedCellText;
		formattedPlayerName = PvPFormattedPlayerName;
		gameScreen = (
			<PvPGame
				game={game}
				state={state}
				player={player}
				history={history}
				setState={setState}
				setPlayer={setPlayer}
				setOutcome={setOutcome}
				setHistory={setHistory}
			/>
		);
	} else if (gameMode === GameMode.PvC) {
		formattedCellText = PvCFormattedCellText;
		formattedPlayerName = PvCFormattedPlayerName;
		gameScreen = (
			<PvCGame
				game={game}
				state={state}
				player={player}
				history={history}
				monteCarloTreeSearch={monteCarloTreeSearch}
				setState={setState}
				setPlayer={setPlayer}
				setOutcome={setOutcome}
				setHistory={setHistory}
			/>
		);
	} else {
		formattedCellText = CvCFormattedCellText;
		formattedPlayerName = CvCFormattedPlayerName;
		gameScreen = (
			<CvCGame
				game={game}
				state={state}
				player={player}
				history={history}
				monteCarloTreeSearch={monteCarloTreeSearch}
				setState={setState}
				setPlayer={setPlayer}
				setOutcome={setOutcome}
				setHistory={setHistory}
			/>
		);
	}

	return (
		<Box flexDirection="column">
			<HistoryFrame
				key={`history--1`}
				game={game}
				state={game.getInitialState()}
				formattedCellText={formattedCellText}
				text="Good luck!"
			/>
			{history}
			{gameOutcome.isTerminal ? (
				<>
					<Text>
						{gameOutcome.value === Outcome.Win
							? `${formattedPlayerName(player)} has won!`
							: "It's a draw!"}
					</Text>
					<Newline />
				</>
			) : (
				gameScreen
			)}
		</Box>
	);
}
