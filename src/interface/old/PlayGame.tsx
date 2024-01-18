import * as tf from "@tensorflow/tfjs";
import React, { useEffect } from "react";
import { Box, Newline, Text } from "ink";
import { GameMode } from "../../types.js";
import ResNet from "../../engine/ResNet.js";
import MonteCarloTreeSearch from "../../engine/MonteCarloTree.js";
import Game, {
	Action,
	ActionOutcome,
	Outcome,
	Player,
	State,
} from "../../engine/Game.js";
import HistoryFrame from "./HistoryFrame.js";
import PvPGame, {
	formattedCellText as PvPFormattedCellText,
	formattedPlayerName as PvPFormattedPlayerName,
} from "./PvPGame.js";
import PvCGame, {
	formattedCellText as PvCFormattedCellText,
	formattedPlayerName as PvCFormattedPlayerName,
} from "./PvCGame.js";
import CvCGame, {
	formattedCellText as CvCFormattedCellText,
	formattedPlayerName as CvCFormattedPlayerName,
} from "./CvCGame.js";
import { gameDefinitions } from "../definitions.js";

type ParsedActionParams = {
	input: string;
	game: Game;
};
export const parsedAction = ({ input, game }: ParsedActionParams): Action => {
	let action: Action;
	action = Number.parseInt(input);
	if (Number.isNaN(action) || action < 0 || action >= game.getActionSize())
		throw new Error("Invalid move!");
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
		const action = parsedAction({ input, game });
		const validActions = state.getValidActions();
		if (validActions[action] !== true) throw new Error("Invalid move!");
		return action;
	} catch (e) {
		setInvalidMove(true);
		return null;
	}
}

type PerformActionParams = {
	action: Action;
	// game: Game;
	state: State;
	player: Player;
	setOutcome: React.Dispatch<React.SetStateAction<ActionOutcome>>;
	setState: React.Dispatch<React.SetStateAction<State>>;
};
export function performAction({
	action,
	// game,
	state,
	player,
	setOutcome,
	setState,
}: PerformActionParams): [State, ActionOutcome] {
	const nextState = State.clone(state);
	nextState.performAction(action, player);
	const actionOutcome = Game.getActionOutcome(nextState, action);
	setOutcome(actionOutcome);
	setState(nextState);
	return [nextState, actionOutcome];
}

// Load the model and create the Monte Carlo Tree Search object
async function loadModel(
	game: Game,
	setMonteCarloTreeSearch: (monteCarloTreeSearch: MonteCarloTreeSearch) => void
) {
	const model = await tf.loadLayersModel(
		`indexeddb://models/${gameDefinitions.modelDirectory}`
	);

	const resNet = new ResNet(game, { model });
	const monteCarloTreeSearch = new MonteCarloTreeSearch(game, resNet, {
		numSearches: 1000,
		explorationConstant: 2,
	});
	setMonteCarloTreeSearch(monteCarloTreeSearch);
}

interface PlayGameProps {
	gameMode: GameMode;
}
export default function PlayGame({ gameMode }: PlayGameProps) {
	const [game, setGame] = React.useState<Game>(gameDefinitions.game);
	const [monteCarloTreeSearch, setMonteCarloTreeSearch] =
		React.useState<MonteCarloTreeSearch | null>(null);
	const [state, setState] = React.useState<State>(game.getInitialState());
	const [player, setPlayer] = React.useState<Player>(Player.X);
	const [history, setHistory] = React.useState<JSX.Element[]>([]);
	const [gameOutcome, setOutcome] = React.useState<ActionOutcome>({
		isTerminal: false,
		value: Outcome.Loss,
	});

	// useEffect(() => {
	// 	if (gameMode === GameMode.PvC || gameMode === GameMode.CvC) {
	// 		loadModel(game, setMonteCarloTreeSearch);
	// 	}
	// }, []);

	let gameScreen = null;
	let formattedCellText: (player: Player) => string;
	let formattedPlayerName: (player: Player) => string;

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
	} else if (gameMode === GameMode.PvC && monteCarloTreeSearch !== null) {
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
	} else if (gameMode === GameMode.CvC && monteCarloTreeSearch !== null) {
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
	} else return null;

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
