import styles from "./SelectGameMode.module.css";
import { GameMode } from "../../types";
import Card from "../Card/Card";
import Button from "../Button/Button";

interface SelectGameModeProps {
	setGameMode: (gameMode: GameMode) => void;
}
export default function SelectGameMode(props: SelectGameModeProps) {
	return (
		<Card headerText={`Select a game mode`}>
			<section className={styles.buttonGroupVertical}>
				<Button
					text="Player vs Player"
					handleClick={() => props.setGameMode(GameMode.PvP)}
				/>
				<Button
					text="Player vs Computer"
					handleClick={() => props.setGameMode(GameMode.PvC)}
				/>
				<Button
					text="Computer vs Computer"
					handleClick={() => props.setGameMode(GameMode.CvC)}
				/>
			</section>
		</Card>
	);
}
