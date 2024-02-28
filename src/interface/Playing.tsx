import { useEffect, useState } from "react";
import { GameMode, GameName, ModelInfo } from "../types";
import {
	getFullModelPath,
	formatGameName,
	retrieveResNetModel,
	loadGame,
} from "../util";
import { getPredictionDataFromState_Action } from "../engine/util";
import Game, { Action, Player, State } from "../engine/Game";
import ResNet from "../engine/ResNet";
import TerminalPage from "./TerminalPage";
import Button from "./Button";

interface PlayingProps {
	gameName: GameName;
	modelInfo: ModelInfo | null;
	gameMode: GameMode;
	handleReturn: () => void;
}

export default function Playing({
	gameName,
	modelInfo,
	gameMode,
	handleReturn,
}: PlayingProps) {
	const game = loadGame(gameName);

	const [terminalText, setTerminalText] = useState<string>(``);
	const [actions, setActions] = useState<Action[]>([]);
	const [state, setState] = useState<State>(game.getInitialState());
	const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.X);
	const [resNet, setResNet] = useState<ResNet | null>(null);

	useEffect(() => {
		if (game === null) return;
		if (modelInfo !== null) {
			const modelPath = getFullModelPath(
				modelInfo.game,
				modelInfo.type,
				modelInfo.innerPath
			);
			const resNetPromise = retrieveResNetModel(game, modelPath);
			resNetPromise.then((loadedResNet) => {
				setResNet(loadedResNet);
			});
		}
		startGame();
	}, []);

	useEffect(() => {
		if (gameMode === GameMode.CvC && resNet !== null) playCvCGame(resNet);
	}, [resNet]);

	function startGame() {
		setState(state);
		writeToTerminal(`Game mode: ${gameMode}\n`);
		setActions(getValidActions(state));
		writeToTerminal("Good luck!");
		writeToTerminal(state.toString());
	}

	function playTurnPvP(state: State, action: Action) {
		const nextState = performAction(
			game,
			state,
			currentPlayer,
			action,
			writeToTerminal
		);
		const { nextPlayer, nextTurnActions } = getNextTurnData(
			game,
			nextState,
			currentPlayer,
			action,
			writeToTerminal
		);
		setState(nextState);
		setCurrentPlayer(nextPlayer);
		setActions(nextTurnActions);
	}

	function playTurnPvC(state: State, action: Action) {
		if (resNet === null) return;
		let nextPlayer = currentPlayer;
		let nextState = performAction(
			game,
			state,
			currentPlayer,
			action,
			writeToTerminal
		);
		const nextTurnData = getNextTurnData(
			game,
			nextState,
			currentPlayer,
			action,
			writeToTerminal
		);
		nextPlayer = nextTurnData.nextPlayer;
		let nextTurnActions = nextTurnData.nextTurnActions;
		if (nextTurnActions.length > 0) {
			const { action: computerAction } = getPredictionDataFromState_Action(
				nextState,
				resNet
			);
			nextState = performAction(
				game,
				nextState,
				nextPlayer,
				computerAction,
				writeToTerminal
			);
			const postComputerTurnData = getNextTurnData(
				game,
				nextState,
				nextPlayer,
				computerAction,
				writeToTerminal
			);
			nextPlayer = postComputerTurnData.nextPlayer;
			nextTurnActions = postComputerTurnData.nextTurnActions;
		}
		setState(nextState);
		setCurrentPlayer(nextPlayer);
		setActions(nextTurnActions);
	}

	function playCvCGame(resNet: ResNet) {
		let nextState = state;
		let nextPlayer = currentPlayer;
		let nextTurnActions = getValidActions(nextState);
		while (nextTurnActions.length > 0) {
			const { action: computerAction } = getPredictionDataFromState_Action(
				nextState,
				resNet
			);
			nextState = performAction(
				game,
				nextState,
				nextPlayer,
				computerAction,
				writeToTerminal
			);
			const nextTurnData = getNextTurnData(
				game,
				nextState,
				nextPlayer,
				computerAction,
				writeToTerminal
			);
			nextPlayer = nextTurnData.nextPlayer;
			nextTurnActions = nextTurnData.nextTurnActions;
		}
		setState(nextState);
		setCurrentPlayer(nextPlayer);
		setActions(nextTurnActions);
	}

	function writeToTerminal(text: string) {
		setTerminalText((prevText) => prevText + text + "\n");
	}

	function handleActionSelected(action: Action) {
		if (resNet && gameMode === GameMode.PvC) playTurnPvC(state, action);
		else playTurnPvP(state, action);
	}

	function quitPlaying() {
		setTerminalText("");
		if (resNet) resNet.dispose();
		handleReturn();
	}

	const actionButtons = actions.map((action, index) => (
		<ActionButton
			action={action}
			handleActionSelected={handleActionSelected}
			key={`action-${index}`}
		/>
	));

	return (
		<TerminalPage
			title={`Playing`}
			subtitle={formatGameName(game.getName())}
			terminalText={terminalText}
			footer={
				<footer className={`col-start-2 col-span-1 flex flex-col`}>
					<Button onClick={quitPlaying} key={`return-button`}>
						<p>Return</p>
					</Button>
				</footer>
			}
		>
			{gameMode !== GameMode.CvC && (
				<section className={`mt-2 sm:mt-0 sm:ml-2 flex sm:flex-col gap-1`}>
					{actionButtons}
				</section>
			)}
		</TerminalPage>
	);
}

interface ActionButtonProps {
	action: Action;
	handleActionSelected: (action: Action) => void;
}
function ActionButton({ action, handleActionSelected }: ActionButtonProps) {
	return (
		<Button
			color={`light`}
			onClick={() => handleActionSelected(action)}
			className={`flex-grow px-2`}
		>
			{action}
		</Button>
	);
}

function getValidActions(state: State): Action[] {
	const validActionsEncoded = state.getValidActions();
	const validActions = [];
	for (let i = 0; i < validActionsEncoded.length; i++) {
		if (validActionsEncoded[i]) validActions.push(i);
	}
	return validActions;
}

function performAction(
	game: Game,
	state: State,
	player: Player,
	action: Action,
	writeToTerminal: (text: string) => void
): State {
	const nextState = state.clone();
	writeToTerminal(`Player ${game.getPlayerName(player)}: ${action}`);
	nextState.performAction(action, player);
	writeToTerminal(nextState.toString());
	return nextState;
}

function getNextTurnData(
	game: Game,
	state: State,
	player: Player,
	action: Action,
	writeToTerminal: (text: string) => void
): {
	nextPlayer: Player;
	nextTurnActions: Action[];
} {
	const { isTerminal } = Game.getActionOutcome(state, action);
	let nextTurnActions = getValidActions(state);
	let nextPlayer = game.getOpponent(player);
	if (isTerminal) {
		const hasWon = state.checkWin(action);
		if (hasWon) {
			nextPlayer = player;
			writeToTerminal(`Player ${game.getPlayerName(player)} has won!`);
		} else {
			if (nextTurnActions.length === 0) writeToTerminal(`Draw!`);
			else writeToTerminal(`Player ${game.getPlayerName(nextPlayer)} has won!`);
		}
		nextTurnActions = [];
	}
	return {
		nextPlayer,
		nextTurnActions,
	};
}
