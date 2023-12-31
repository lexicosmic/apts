import styles from "./Playing.module.css";
import { useState } from "react";
import { GameMode, GameName, formatGameName } from "../../types";
import Button from "../Button/Button";
import FluidContainer from "../FluidContainer/FluidContainer";
import SelectorButtons from "../SelectorButtons/SelectorButtons";

interface PlayingProps {
	gameName: GameName;
	handleReturn: () => void;
	setShowMainHeader: (showMainHeader: boolean) => void;
}

export default function Playing(props: PlayingProps) {
	const [gameMode, setGameMode] = useState<GameMode | null>(null);

	const gameModes = [
		{
			name: GameMode.PvP,
			handleClick: () => handleGameModeSelected(GameMode.PvP),
		},
		{
			name: GameMode.PvC,
			handleClick: () => handleGameModeSelected(GameMode.PvC),
		},
		{
			name: GameMode.CvC,
			handleClick: () => handleGameModeSelected(GameMode.CvC),
		},
	];

	function handleGameModeSelected(gameMode: GameMode) {
		props.setShowMainHeader(false);
		setGameMode(gameMode);
	}

	function handleReturn() {
		props.setShowMainHeader(true);
		if (gameMode === null) {
			props.handleReturn();
		} else {
			setGameMode(null);
		}
	}

	let pageContent = null;
	if (gameMode === null) {
		pageContent = (
			<SelectorButtons
				title={`Select game mode`}
				options={gameModes}
				key={`select-game-mode`}
			/>
		);
	} else {
		pageContent = (
			<div className={styles.playing}>
				<p className="display-text-3">Game mode: {gameMode}</p>
			</div>
		);
	}

	return (
		<FluidContainer
			headerContent={[
				<h1 className="header-text-1" key={`title`}>
					Playing
				</h1>,
				<p className="display-text-3" key={`subtitle`}>
					{formatGameName(props.gameName)}
				</p>,
			]}
			footerContent={
				<Button
					text={`Return`}
					handleClick={handleReturn}
					key={`return-button`}
				/>
			}
		>
			{pageContent}
		</FluidContainer>
	);
}
