import styles from "./App.module.css";
import { GameMode } from "../../types";
import { useState } from "react";
import SelectGameMode from "../SelectGameMode/SelectGameMode";
import PlayGame from "../PlayGame/PlayGame";
import Header from "../Header/Header";

export default function App() {
	const [gameMode, setGameMode] = useState<GameMode | null>(null);

	return (
		<>
			<Header>
				<h1 className="display-text-1">Auto Playtest System</h1>
			</Header>
			<main className={styles.main}>
				{gameMode ? (
					<PlayGame gameMode={gameMode} setGameMode={setGameMode}></PlayGame>
				) : (
					<SelectGameMode setGameMode={setGameMode}></SelectGameMode>
				)}
			</main>
			<footer></footer>
		</>
	);
}
