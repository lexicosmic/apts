import Button from "./Button";

interface DisclaimerProps {
	title: string;
	subtitle?: string;
	text: string;
	handleReturn?: () => void;
}

export default function Disclaimer({
	title,
	subtitle,
	text,
	handleReturn,
}: DisclaimerProps) {
	return (
		<article
			className={`w-full py-2 gap-2 grid`}
			style={{
				gridTemplateColumns: "1fr auto 1fr",
				gridTemplateRows: "auto 1fr auto",
			}}
		>
			<header className={`col-start-2 col-span-1 text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					{title}
				</h1>
				{subtitle && (
					<p className={`text-2xl font-light`} key={`subtitle`}>
						{subtitle}
					</p>
				)}
			</header>
			<section
				className={`col-start-1 col-span-3 mx-2 pb-1 flex flex-col items-center`}
			>
				<p className={`text-xl text-center`}>{text}</p>
			</section>
			{handleReturn && (
				<footer className={`col-start-2 col-span-1 flex flex-col`}>
					<Button onClick={handleReturn} key={`return-button`} color={`light`}>
						<p>Return</p>
					</Button>
				</footer>
			)}
		</article>
	);
}
