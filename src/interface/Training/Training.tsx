import styles from "./Training.module.css";
import { GameName, formatGameName } from "../../types";
import { useEffect, useState } from "react";
import FluidContainer from "../FluidContainer/FluidContainer";
import Button from "../Button/Button";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Screen from "../Screen/Screen";

enum TrainingMode {
	SelfPlay = "Self-play",
}

interface TrainingProps {
	gameName: GameName;
	handleReturn: () => void;
}

export default function Training(props: TrainingProps) {
	// let isTraining = false;
	const [trainingMode, setTrainingMode] = useState<TrainingMode | null>(null);
	// const [infoMessage, setInfoMessage] = useState<string>("");
	const [screenText, setScreenText] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	useEffect(() => {
		performTraining();
	}, [trainingMode]);

	const trainingModes = [
		{
			name: TrainingMode.SelfPlay,
			handleClick: () => handleTrainingModeSelected(TrainingMode.SelfPlay),
		},
	];

	function handleTrainingModeSelected(trainingMode: TrainingMode) {
		setButtonDisabled(true);
		setTrainingMode(trainingMode);

		// setTimeout(() => {
		// 	if (isTraining) {
		// 		isTraining = false;
		// 		setInfoMessage(`Time is up! Cancelled training ${trainingMode} model.`);
		// 		setTimeout(() => {
		// 			setInfoMessage("");
		// 		}, 3000);
		// 	} else {
		// 		setInfoMessage(`Finished training ${trainingMode} model.`);
		// 		setTimeout(() => {
		// 			setInfoMessage("");
		// 		}, 3000);
		// 	}
		// }, 600000);
	}

	async function performTraining() {
		let trainingFunction: (
			printMessage: (message: string) => void
		) => Promise<void> = () => Promise.resolve();
		switch (trainingMode) {
			// case TrainingMode.MCTSCommon:
			// 	trainingFunction = testMCTSCommon;
			// 	break;
			// case TrainingMode.Structure:
			// 	trainingFunction = testResNetStructure;
			// 	break;
			// case TrainingMode.Blind:
			// 	trainingFunction = testBlindTraining;
			// 	break;
			default:
				setTrainingMode(null);
				setButtonDisabled(false);
				return;
		}

		await trainingFunction(writeScreenText);
		setButtonDisabled(false);
	}

	function writeScreenText(text: string) {
		setScreenText((prevText) => prevText + text + "\n");
	}

	function resetTraining() {
		setTrainingMode(null);
		setScreenText("");
	}

	let pageContent = null;
	if (trainingMode === null) {
		pageContent = (
			<SelectorButtons title={`Select training mode`} options={trainingModes} />
		);
	} else {
		pageContent = <Screen text={screenText} />;
	}

	let footerContent = null;
	if (trainingMode === null) {
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
