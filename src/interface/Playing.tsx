// import { useState } from "react";
// import { GameMode, GameName } from "../types";
// import { formatGameName } from "../util";
// import Button from "./Button";
// import SelectorButtons from "./ButtonGroup";

// interface PlayingProps {
// 	gameName: GameName;
// 	handleReturn: () => void;
// }

// export default function Playing(props: PlayingProps) {
// 	const [gameMode, setGameMode] = useState<GameMode | null>(null);

// 	const gameModes = [
// 		{
// 			name: GameMode.PvP,
// 			handleClick: () => handleGameModeSelected(GameMode.PvP),
// 		},
// 		{
// 			name: GameMode.PvC,
// 			handleClick: () => handleGameModeSelected(GameMode.PvC),
// 		},
// 		{
// 			name: GameMode.CvC,
// 			handleClick: () => handleGameModeSelected(GameMode.CvC),
// 		},
// 	];

// 	function handleGameModeSelected(gameMode: GameMode) {
// 		setGameMode(gameMode);
// 	}

// 	function handleReturn() {
// 		if (gameMode === null) {
// 			props.handleReturn();
// 		} else {
// 			setGameMode(null);
// 		}
// 	}

// 	let pageContent = null;
// 	if (gameMode === null) {
// 		pageContent = (
// 			<SelectorButtons
// 				title={`Select game mode`}
// 				options={gameModes}
// 				key={`select-game-mode`}
// 			/>
// 		);
// 	} else {
// 		pageContent = (
// 			<div>
// 				<p>Game mode: {gameMode}</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<article className={`flex flex-col gap-2`}>
// 			<header className={`text-center`}>
// 				<h1 className={`text-4xl`} key={`title`}>
// 					Playing
// 				</h1>
// 				<p className={`text-2xl font-light`} key={`subtitle`}>
// 					{formatGameName(props.gameName)}
// 				</p>
// 			</header>
// 			<section>{pageContent}</section>
// 			<footer className={`w-full flex flex-col`}>
// 				<Button handleClick={handleReturn} key={`return-button`} color="light">
// 					<p>Return</p>
// 				</Button>
// 			</footer>
// 		</article>
// 	);
// }
