import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";

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
		<article className={`w-full xs:w-max px-2 flex flex-col gap-2`}>
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
			<ButtonGroup
				options={actions.map(({ name, handleClick }) => ({
					content: <p>{name}</p>,
					handleClick,
				}))}
			/>
			{handleReturn && (
				<footer className={`w-full flex flex-col`}>
					<Button onClick={handleReturn} key={`return-button`} color={`light`}>
						<p>Return</p>
					</Button>
				</footer>
			)}
		</article>
	);
}

export type Option = {
	name: string;
	handleClick: () => void;
};
