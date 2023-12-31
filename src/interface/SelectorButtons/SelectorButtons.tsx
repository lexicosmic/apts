import styles from "./SelectorButtons.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";

interface Option {
	name: string;
	handleClick: () => void;
}

interface SelectorButtonsProps {
	title: string;
	subtitle?: string;
	options: Option[];
}
export default function SelectorButtons(props: SelectorButtonsProps) {
	const buttons = props.options.map((option, index) => (
		<Button
			text={option.name}
			handleClick={option.handleClick}
			key={`${index}_${option.name}`}
		/>
	));
	return (
		<Card headerTitle={props.title} headerSubtitle={props.subtitle}>
			<section className={styles.buttonGroupVertical}>{buttons}</section>
		</Card>
	);
}
