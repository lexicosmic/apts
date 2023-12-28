import styles from "./App.module.css";
import { GameMode, GameName, formatGameName } from "../../types";
import { useState } from "react";
import PlayGame from "../PlayGame/PlayGame";
import Header from "../Header/Header";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Button from "../Button/Button";
import Train from "../Train/Train";

export default function App() {
	enum Action {
		Play = "Play",
		Train = "Train",
	}

	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<Action | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);

	const gameNames = [
		{
			name: formatGameName(GameName.TicTacToe),
			handleClick: () => setGameName(GameName.TicTacToe),
		},
		{
			name: formatGameName(GameName.ConnectFour),
			handleClick: () => setGameName(GameName.ConnectFour),
		},
	];

	const actions = [
		{
			name: Action.Play,
			handleClick: () => setAction(Action.Play),
		},
		{
			name: Action.Train,
			handleClick: () => setAction(Action.Train),
		},
	];

	const gameModes = [
		{
			name: GameMode.PvP,
			handleClick: () => setGameMode(GameMode.PvP),
		},
		{
			name: GameMode.PvC,
			handleClick: () => setGameMode(GameMode.PvC),
		},
		{
			name: GameMode.CvC,
			handleClick: () => setGameMode(GameMode.CvC),
		},
	];

	let pageContent = null;
	if (gameName == null) {
		pageContent = (
			<SelectorButtons title={`Select a game`} options={gameNames} />
		);
	} else {
		if (action == null) {
			pageContent = [
				<Header key={`select-action-header`}>
					<h1 className="display-text-3">{formatGameName(gameName)}</h1>
				</Header>,
				<SelectorButtons
					title={`Select an action`}
					options={actions}
					key={`select-action`}
				/>,
				<Button
					text={`Return`}
					handleClick={() => setGameName(null)}
					key={`return-to-games`}
				/>,
			];
		} else {
			if (gameMode == null) {
				if (action === Action.Play) {
					pageContent = [
						<Header key={`select-game-mode-header`}>
							<h1 className="header-text-1">{action}</h1>
							<p className="display-text-3">{formatGameName(gameName)}</p>
						</Header>,
						<SelectorButtons
							title={`Select a game mode`}
							options={gameModes}
							key={`select-game-mode`}
						/>,
						<Button
							text={`Return`}
							handleClick={() => setAction(null)}
							key={`return-to-actions`}
						/>,
					];
				} else {
					pageContent = (
						<Train gameName={gameName} handleReturn={() => setAction(null)} />
					);
				}
			} else {
				pageContent = (
					<PlayGame gameMode={gameMode} setGameMode={setGameMode}></PlayGame>
				);
			}
		}
	}

	return (
		<>
			{gameMode === null && (
				<Header>
					<h1 className="display-text-1">Auto Playtest System</h1>
				</Header>
			)}
			<main className={styles.main}>{pageContent}</main>
		</>
	);
}
