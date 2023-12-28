import styles from "./Button.module.css";

interface ButtonProps {
	text: string;
	handleClick: () => void;
	disabled?: boolean;
}

export default function Button({ disabled = false, ...props }: ButtonProps) {
	let className = styles.button;
	let onClick = props.handleClick;
	if (disabled) {
		className += ` ${styles.disabled}`;
		onClick = () => {};
	}

	return (
		<button disabled={disabled} className={className} onClick={onClick}>
			{props.text}
		</button>
	);
}
