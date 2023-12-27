import styles from "./Screen.module.css";
import Game from "../../engine/Game";

interface ScreenProps {
	game: Game;
}
export default function Screen(props: ScreenProps) {
	return (
		<textarea
			readOnly
			className={styles.screen}
			value={props.game.getInitialState().toString()}
		/>
	);
}
