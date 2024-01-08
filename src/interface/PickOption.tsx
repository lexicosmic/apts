import Button from "./Button";
import SelectorButtons from "./ButtonGroup";

interface PickOptionProps {
	title: string;
	subtitle?: string;
	actions: Option[];
	handleReturn?: () => void;
}

export default function PickOption({
	title,
	subtitle,
	actions,
	handleReturn,
}: PickOptionProps) {
	return (
		<article className={`flex flex-col gap-2`}>
			<header className={`text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					{title}
				</h1>
				{subtitle && (
					<p className={`text-2xl font-light`} key={`subtitle`}>
						{subtitle}
					</p>
				)}
			</header>
			<SelectorButtons options={actions} />
			{handleReturn && (
				<footer className={`w-full flex flex-col`}>
					<Button
						handleClick={handleReturn}
						key={`return-button`}
						color="light"
					>
						<p>Return</p>
					</Button>
				</footer>
			)}
		</article>
	);
}

type Option = {
	name: string;
	handleClick: () => void;
};