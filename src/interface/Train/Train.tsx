import styles from "./Train.module.css";
import { GameName, formatGameName } from "../../types";
import { useState } from "react";
import FluidContainer from "../FluidContainer/FluidContainer";
import Button from "../Button/Button";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Screen from "../Screen/Screen";
import { testMCTSCommon } from "../../playground/mctsCommon";
import { testResNetStructure } from "../../playground/structure";

enum TrainMode {
	MCTSCommon = "MCTS Test",
	Structure = "Structure Test",
	Blind = "Blind Training",
}

interface TrainProps {
	gameName: GameName;
	handleReturn: () => void;
}

export default function Train(props: TrainProps) {
	// let isTraining = false;
	const [trainMode, setTrainMode] = useState<TrainMode | null>(null);
	const [infoMessage, setInfoMessage] = useState<string>("");
	const [screenText, setScreenText] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	const trainModes = [
		{
			name: TrainMode.MCTSCommon,
			handleClick: () => handleTrainModeSelected(TrainMode.MCTSCommon),
		},
		{
			name: TrainMode.Structure,
			handleClick: () => handleTrainModeSelected(TrainMode.Structure),
		},
		{
			name: TrainMode.Blind,
			handleClick: () => handleTrainModeSelected(TrainMode.Blind),
		},
	];

	function handleTrainModeSelected(trainMode: TrainMode) {
		setButtonDisabled(true);
		let trainFunction: (
			printMessage: (message: string) => void
		) => Promise<void> = () => Promise.resolve();
		switch (trainMode) {
			case TrainMode.MCTSCommon:
				trainFunction = testMCTSCommon;
				break;
			case TrainMode.Structure:
				trainFunction = testResNetStructure;
				break;
			case TrainMode.Blind:
				break;
			default:
				setTrainMode(null);
				setButtonDisabled(false);
				return;
		}
		setTrainMode(trainMode);
		performTraining(trainFunction);
		// setTimeout(() => {
		// 	if (isTraining) {
		// 		isTraining = false;
		// 		setInfoMessage(`Time is up! Cancelled training ${trainMode} model.`);
		// 		setTimeout(() => {
		// 			setInfoMessage("");
		// 		}, 3000);
		// 	} else {
		// 		setInfoMessage(`Finished training ${trainMode} model.`);
		// 		setTimeout(() => {
		// 			setInfoMessage("");
		// 		}, 3000);
		// 	}
		// }, 600000);
	}

	async function performTraining(
		trainFunction: (printMessage: (message: string) => void) => Promise<void>
	) {
		writeScreenText("Training model...");
		await trainFunction(writeScreenText);
		setButtonDisabled(false);
	}

	function writeScreenText(text: string) {
		setScreenText((prevText) => prevText + text + "\n");
	}

	function resetTraining() {
		setTrainMode(null);
		setScreenText("");
	}

	let pageContent = null;
	if (trainMode === null) {
		pageContent = (
			<SelectorButtons title={`Select train mode`} options={trainModes} />
		);
	} else {
		pageContent = <Screen text={screenText} />;
	}

	let footerContent = null;
	if (trainMode === null) {
		footerContent = (
			<Button
				text={`Return`}
				handleClick={props.handleReturn}
				disabled={buttonDisabled}
				key={`return-button`}
			/>
		);
	} else {
		footerContent = (
			<Button
				text={`Reset`}
				handleClick={() => resetTraining()}
				disabled={buttonDisabled}
				key={`reset-button`}
			/>
		);
	}

	return (
		<FluidContainer
			headerContent={[
				<h1 className="header-text-1" key={`title`}>
					Train model
				</h1>,
				<p className="display-text-3" key={`subtitle`}>
					{formatGameName(props.gameName)}
				</p>,
			]}
			footerContent={footerContent}
		>
			{pageContent}
		</FluidContainer>
	);
}
