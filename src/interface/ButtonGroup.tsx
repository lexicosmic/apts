import Button from "./Button";

interface Option {
	name: string;
	handleClick: () => void;
}

interface ButtonGroupProps {
	options: Option[];
}
export default function ButtonGroup({ options }: ButtonGroupProps) {
	const buttons = options.map((option, index) => (
		<Button
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
