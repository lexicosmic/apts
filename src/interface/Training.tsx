import { useEffect, useState } from "react";
import {
	HandleWorkParams,
	WorkerMessage,
	WorkerStatus,
} from "../modelHandling/types";
import { formatGameName } from "../util";
import handleWork from "../modelHandling/handleWork?worker&url";
import TerminalPage from "./TerminalPage";
import Button from "./Button";

interface TrainingProps {
	handleWorkParams: HandleWorkParams;
	handleReturn: () => void;
}

export default function Training({
	handleWorkParams,
	handleReturn,
}: TrainingProps) {
	const [terminalText, setTerminalText] = useState<string>(``);
	const [isTraining, setIsTraining] = useState<boolean>(true);
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
		setIsTraining(true);
		worker.onmessage = (e) => {
			const { status, text }: WorkerMessage = e.data;
			if (status === WorkerStatus.Finished || status === WorkerStatus.Error)
				setIsTraining(false);
			writeToTerminal(text);
		};
		worker.onerror = (e) => {
			writeToTerminal(e.toString());
			setIsTraining(false);
		};
		worker.postMessage(handleWorkParams);
	}, [worker]);

	function writeToTerminal(text: string) {
		setTerminalText((prevText) => prevText + text + "\n");
	}

	function cancelTraining() {
		if (worker === null) return;
		writeToTerminal(`CANCELED WORK!`);
		worker.terminate();
		setIsTraining(false);
	}

	return (
		<TerminalPage
			title={`Training`}
			subtitle={formatGameName(handleWorkParams.gameName)}
			terminalText={terminalText}
			footer={
				<footer className={`col-start-2 col-span-1 flex flex-col`}>
					{isTraining ? (
						<Button onClick={cancelTraining} key={`cancel-button`} color="red">
							<p>Cancel</p>
						</Button>
					) : (
						<Button onClick={handleReturn} key={`return-button`}>
							<p>Return</p>
						</Button>
					)}
				</footer>
			}
		/>
	);
}
