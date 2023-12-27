import styles from "./Button.module.css";

interface ButtonProps {
	text: string;
	handleClick: () => void;
}

export default function Button(props: ButtonProps) {
	return (
		<button className={styles.button} onClick={props.handleClick}>
			{props.text}
		</button>
	);
}
