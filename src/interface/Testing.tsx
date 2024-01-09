import { useState } from "react";
import { formatGameName } from "../util";
import Game from "../engine/Game";
import Button from "./Button";
import Screen from "./Screen";
import { TestingFunction } from "../types";
import { useOnMountUnsafe } from "./util";

interface TestingProps {
	game: Game;
	testingFunction: TestingFunction;
	handleReturn: () => void;
}

export default function Testing({
	game,
	testingFunction,
	handleReturn,
}: TestingProps) {
	const [screenText, setScreenText] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

	useOnMountUnsafe(() => {
		setButtonDisabled(true);
		performTesting();
	});

	async function performTesting() {
		await testingFunction({
			printMessage: writeScreenText,
			game,
		});
		setButtonDisabled(false);
	}

	function writeScreenText(text: string) {
		setScreenText((prevText) => prevText + text + "\n");
	}

	function quitTesting() {
		setScreenText("");
		handleReturn();
	}

	return (
		<article
			className={`w-full my-2 flex-grow
			gap-2 grid`}
			style={{
				gridTemplateColumns: "1fr auto 1fr",
				gridTemplateRows: "auto 1fr auto",
			}}
		>
			<header className={`col-start-2 col-span-1 text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					Testing
				</h1>
				<p className={`text-2xl font-light`} key={`subtitle`}>
					{formatGameName(game.getName())}
				</p>
			</header>
			<section className={`col-start-1 col-span-3 mx-2 flex flex-col`}>
				<Screen text={screenText} />
			</section>
			<footer className={`col-start-2 col-span-1 flex flex-col`}>
				<Button
					handleClick={() => quitTesting()}
					disabled={buttonDisabled}
					key={`quit-button`}
				>
					<p>Quit</p>
				</Button>
			</footer>
		</article>
	);
}
