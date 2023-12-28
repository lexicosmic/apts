import styles from "./Screen.module.css";

interface ScreenProps {
	text: string;
	square?: boolean;
}
export default function Screen({ square = false, ...props }: ScreenProps) {
	let className = styles.screen;
	if (square) {
		className += ` ${styles.square}`;
	}
	return <textarea readOnly className={className} value={props.text} />;
}
