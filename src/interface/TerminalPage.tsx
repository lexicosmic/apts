import { PropsWithChildren } from "react";
import Button from "./Button";
import Terminal from "./Terminal";

interface TerminalPageProps {
	title: string;
	subtitle: string;
	terminalText: string;
	handleReturn: () => void;
	returnButtonDisabled?: boolean;
}

export default function TerminalPage({
	title,
	subtitle,
	terminalText,
	handleReturn,
	returnButtonDisabled = false,
	children,
}: PropsWithChildren<TerminalPageProps>) {
	return (
		<article
			className={`w-full py-2 flex-grow gap-2 grid`}
			style={{
				gridTemplateColumns: "1fr auto 1fr",
				gridTemplateRows: "auto 1fr auto",
			}}
		>
			<header className={`col-start-2 col-span-1 text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					{title}
				</h1>
				<p className={`text-2xl font-light`} key={`subtitle`}>
					{subtitle}
				</p>
			</header>
			<section
				className={`col-start-1 col-span-3 mx-2 flex flex-col sm:flex-row`}
			>
				<Terminal text={terminalText} className={`flex-grow`} />
				<div className={`basis-0`}>{children}</div>
			</section>
			<footer className={`col-start-2 col-span-1 flex flex-col`}>
				<Button
					onClick={handleReturn}
					disabled={returnButtonDisabled}
					key={`return-button`}
				>
					<p>Return</p>
				</Button>
			</footer>
		</article>
	);
}
