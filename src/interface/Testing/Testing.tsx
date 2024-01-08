import { useEffect, useState } from "react";
import { formatGameName } from "../../util";
import Game from "../../engine/Game";
import Button from "../Button";
import Screen from "../Screen/Screen";
import { TestingFunction } from "../../types";

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
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	useEffect(() => {
		performTesting();
	}, []);

	// function handleTestSelected(test: Test) {
	// 	setButtonDisabled(true);
	// 	setTest(test);
	// }

	async function performTesting() {
		console.log("Print message", writeScreenText);
		console.log("Game", game);
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

	// let pageContent = null;
	// if (test === null) {
	// 	pageContent = <SelectorButtons title={`Select test`} options={tests} />;
	// } else {
	// 	pageContent = <Screen text={screenText} />;
	// }

	// let footerContent = null;
	// if (test === null) {
	// 	footerContent = (
	// 		<Button
	// 			handleClick={handleReturn}
	// 			disabled={buttonDisabled}
	// 			key={`return-button`}
	// 		>
	// 			<p>Return</p>
	// 		</Button>
	// 	);
	// } else {
	// 	footerContent = (
	// 		<Button
	// 			handleClick={() => quitTesting()}
	// 			disabled={buttonDisabled}
	// 			key={`reset-button`}
	// 		>
	// 			<p>Reset</p>
	// 		</Button>
	// 	);
	// }

	return (
		<article className={`flex flex-col gap-2`}>
			<header className={`text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					Testing
				</h1>
				<p className={`text-2xl font-light`} key={`subtitle`}>
					{formatGameName(game.getName())}
				</p>
			</header>
			<Screen text={screenText} />
			<footer className={`w-full flex flex-col`}>
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
