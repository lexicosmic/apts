import { useState } from "react";
import { ModelInfo } from "../types";
import { retrieveResNetModel, useOnMountUnsafe } from "./util";
import {
	formatGameName,
	getFullModelPath,
	standardFileProtocol,
} from "../util";
import Game from "../engine/Game";
import TerminalPage from "./TerminalPage";
import ResNet from "../engine/ResNet";

interface TrainingProps {
	game: Game;
	trainingFunction: Function;
	modelInfo: ModelInfo | null;
	otherParams: any;
	handleReturn: () => void;
}

export default function Training({
	game,
	trainingFunction,
	modelInfo,
	otherParams,
	handleReturn,
}: TrainingProps) {
	const [terminalText, setTerminalText] = useState<string>(``);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

	useOnMountUnsafe(() => {
		setButtonDisabled(true);
		if (modelInfo !== null) {
			const modelPath = getFullModelPath(
				modelInfo.game,
				modelInfo.type,
				modelInfo.innerPath
			);
			retrieveResNetModel(game, modelPath, (loadedModel) => {
				performTraining(loadedModel);
			});
		} else performTraining();
	});

	async function performTraining(resNet?: ResNet) {
		await trainingFunction({
			logMessage: writeToTerminal,
			game,
			fileSystemProtocol: standardFileProtocol,
			resNet,
			...otherParams,
		});
		setButtonDisabled(false);
	}

	function writeToTerminal(text: string) {
		setTerminalText((prevText) => prevText + text + "\n");
	}

	function quitTraining() {
		setTerminalText("");
		handleReturn();
	}

	return (
		<TerminalPage
			title={`Training`}
			subtitle={formatGameName(game.getName())}
			terminalText={terminalText}
			handleReturn={quitTraining}
			returnButtonDisabled={buttonDisabled}
		/>
	);
}
