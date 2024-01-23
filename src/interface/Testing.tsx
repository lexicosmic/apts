import { useState } from "react";
import { TestingFunction } from "../types";
import { formatGameName } from "../util";
import { useOnMountUnsafe } from "./util";
import Game from "../engine/Game";
import TerminalPage from "./TerminalPage";

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
	const [terminalText, setTerminalText] = useState<string>(``);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

	useOnMountUnsafe(() => {
		setButtonDisabled(true);
		performTesting();
	});

	async function performTesting() {
		await testingFunction({
			logMessage: writeToTerminal,
			game,
		});
		setButtonDisabled(false);
	}

	function writeToTerminal(text: string) {
		setTerminalText((prevText) => prevText + text + "\n");
	}

	function quitTesting() {
		setTerminalText("");
		handleReturn();
	}

	return (
		<TerminalPage
			title={`Testing`}
			subtitle={formatGameName(game.getName())}
			terminalText={terminalText}
			handleReturn={quitTesting}
			returnButtonDisabled={buttonDisabled}
		/>
	);
}
