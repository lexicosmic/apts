import { PropsWithChildren } from "react";
import Terminal from "./Terminal";

interface TerminalPageProps {
	title: string;
	subtitle: string;
	terminalText: string;
	footer: JSX.Element;
}

export default function TerminalPage({
	title,
	subtitle,
	terminalText,
	footer,
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
			{footer}
		</article>
	);
}
