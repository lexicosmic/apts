import Button from "./Button";

interface Option {
	name: string;
	handleClick: () => void;
}

interface ButtonGroupProps {
	// title: string;
	// subtitle?: string;
	options: Option[];
	// handleReturn?: () => void;
}
export default function ButtonGroup({
	// title,
	// subtitle,
	options,
}: // handleReturn,
ButtonGroupProps) {
	const buttons = options.map((option, index) => (
		<Button
			handleClick={option.handleClick}
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
		// <section className={`w-max flex flex-col gap-2`}>
		// 	<header className={`w-max flex flex-col items-center`}>
		// 		<h1 className={`text-3xl`}>{title}</h1>
		// 		{subtitle && <p className={`text-2xl font-light`}>{subtitle}</p>}
		// 	</header>
		// 	{handleReturn && (
		// 		<footer className={`w-full flex flex-col`}>
		// 			<Button
		// 				handleClick={handleReturn}
		// 				color={`light`}
		// 				className={`text-lg`}
		// 			>
		// 				<p>Return</p>
		// 			</Button>
		// 		</footer>
		// 	)}
		// </section>
	);
}
