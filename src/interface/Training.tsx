import { useEffect, useState } from "react";
import { GameName, ModelInfo, WorkName } from "../types";
import { formatGameName, standardFileProtocol } from "../util";
import handleWork from "../modelHandling/handleWork?worker&url";
import TerminalPage from "./TerminalPage";
import { HandleWorkParams } from "../modelHandling/handleWork";

interface TrainingProps {
	gameName: GameName;
	workName: WorkName;
	modelInfo: ModelInfo | null;
	otherParams: any;
	handleReturn: () => void;
}

export default function Training({
	gameName,
	workName,
	modelInfo,
	otherParams,
	handleReturn,
}: TrainingProps) {
	const [terminalText, setTerminalText] = useState<string>(``);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [worker, setWorker] = useState<Worker | null>(null);

	useEffect(() => {
		const worker = new Worker(handleWork, { type: "module" });
		setWorker(worker);

		return () => {
			worker.terminate();
		};
	}, []);

	useEffect(() => {
		if (worker === null) return;
		worker.onmessage = (e) => {
			writeToTerminal(e.data);
		};
		worker.onerror = (e) => {
			writeToTerminal(e.toString());
			setButtonDisabled(false);
		};
		if (modelInfo === null) performTraining(worker);
		else performTraining(worker, modelInfo);
	}, [worker]);

	async function performTraining(worker: Worker, modelInfo?: ModelInfo) {
		const params: HandleWorkParams = {
			workName,
			gameName,
			fileSystemProtocol: standardFileProtocol,
			modelInfo,
			...otherParams,
		};
		worker.postMessage(params);
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
			subtitle={formatGameName(gameName)}
			terminalText={terminalText}
			handleReturn={quitTraining}
			returnButtonDisabled={buttonDisabled}
		/>
	);
}
