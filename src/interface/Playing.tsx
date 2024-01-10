import { useState } from "react";
import { GameMode, ModelInfo } from "../types";
import { formatGameName } from "../util";
import { loadResNetModel, useOnMountUnsafe } from "./util";
import Game, { Action, ActionOutcome, Player, State } from "../engine/Game";
import ResNet from "../engine/ResNet";
import TerminalPage from "./TerminalPage";
import Button from "./Button";

interface PlayingProps {
	game: Game;
	modelInfo: ModelInfo | null;
	gameMode: GameMode;
	handleReturn: () => void;
}

export default function Playing({
	game,
	modelInfo,
	gameMode,
	handleReturn,
}: PlayingProps) {
	const [terminalText, setTerminalText] = useState<string>(``);
	const [actions, setActions] = useState<Action[]>([]);
	const [state, setState] = useState<State>(game.getInitialState());
	const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.X);
	let resNet: ResNet | null = null;

	useOnMountUnsafe(() => {
		if (modelInfo !== null)
			loadResNetModel(game, modelInfo.path, (loadedModel) => {
				resNet = loadedModel;
				console.log(resNet);
			});
		startGame();
	});

	function startGame() {
		writeTerminalText(`Game mode: ${gameMode}\n`);
		setActions(getValidActions(state));
	}

	function handleActionSelect(action: Action) {
		writeTerminalText(`Player ${currentPlayer}: ${action}`);
		const nextState = State.clone(state);
		nextState.performAction(action, currentPlayer);
		writeTerminalText(state.toString());

		const { isTerminal } = Game.getActionOutcome(nextState, action);
		const opponent = game.getOpponent(currentPlayer);
		let validActions = getValidActions(nextState);

		if (isTerminal) {
			const hasWon = nextState.checkWin(action);
			validActions = [];
			if (hasWon) {
				writeTerminalText(`Player ${currentPlayer} has won!`);
			} else {
				if (validActions.length === 0) writeTerminalText(`Draw!`);
				else writeTerminalText(`Player ${opponent} has won!`);
			}
		}

		setState(nextState);
		setActions(validActions);
		setCurrentPlayer(opponent);
	}

	function writeTerminalText(text: string) {
		setTerminalText((prevText) => prevText + text + "\n");
	}

	function quitPlaying() {
		setTerminalText("");
		handleReturn();
	}

	const actionButtons = actions.map((action, index) => (
		<ActionButton
			action={action}
			handleActionSelected={handleActionSelect}
			key={`action-${index}`}
		/>
	));

	return (
		<TerminalPage
			title={`Playing`}
			subtitle={formatGameName(game.getName())}
			terminalText={terminalText}
			handleReturn={quitPlaying}
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
