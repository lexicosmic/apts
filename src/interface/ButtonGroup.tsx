import Button, { ButtonProps } from "./Button";

export interface ButtonGroupOption {
	name: string;
	color?: ButtonProps["color"];
	handleClick: () => void;
}

interface ButtonGroupProps {
	options: ButtonGroupOption[];
}
export default function ButtonGroup({ options }: ButtonGroupProps) {
	const buttons = options.map((option, index) => (
		<Button
			color={option.color}
			onClick={option.handleClick}
			key={`${index}_${option.name}`}
			className={`text-lg px-2`}
		>
			<p>{option.name}</p>
		</Button>
	));
	return (
		<section className={`w-full flex flex-col gap-1 self-center`}>
			{buttons}
		</section>
	);
}
