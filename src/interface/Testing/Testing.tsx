import styles from "./Testing.module.css";
import { GameName, formatGameName } from "../../types";
import { useEffect, useState } from "react";
import FluidContainer from "../FluidContainer/FluidContainer";
import Button from "../Button/Button";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Screen from "../Screen/Screen";
import testMCTSCommon from "../../modelHandling/testing/testMCTSCommon";
import testResNetStructure from "../../modelHandling/testing/testResNetStructure";
import testBlindTesting from "../../modelHandling/testing/testBlindTraining";

enum TestingMode {
	MCTSCommon = "Monte-Carlo Search Test",
	ResNet = "ResNet Structure Test",
	Blind = "Blind Testing Test",
}

interface TestingProps {
	gameName: GameName;
	handleReturn: () => void;
	setShowMainHeader: (showMainHeader: boolean) => void;
}

export default function Testing(props: TestingProps) {
	const [testingMode, setTestingMode] = useState<TestingMode | null>(null);
	const [screenText, setScreenText] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	useEffect(() => {
		performTesting();
	}, [testingMode]);

	const testingModes = [
		{
			name: TestingMode.MCTSCommon,
			handleClick: () => handleTestingModeSelected(TestingMode.MCTSCommon),
		},
		{
			name: TestingMode.ResNet,
			handleClick: () => handleTestingModeSelected(TestingMode.ResNet),
		},
		{
			name: TestingMode.Blind,
			handleClick: () => handleTestingModeSelected(TestingMode.Blind),
		},
	];

	function handleTestingModeSelected(testingMode: TestingMode) {
		setButtonDisabled(true);
		setTestingMode(testingMode);
		props.setShowMainHeader(false);
	}

	async function performTesting() {
		let testingFunction: (
			printMessage: (message: string) => void
		) => Promise<void> = () => Promise.resolve();
		switch (testingMode) {
			case TestingMode.MCTSCommon:
				testingFunction = testMCTSCommon;
				break;
			case TestingMode.ResNet:
				testingFunction = testResNetStructure;
				break;
			case TestingMode.Blind:
				testingFunction = testBlindTesting;
				break;
			default:
				setTestingMode(null);
				setButtonDisabled(false);
				props.setShowMainHeader(true);
				return;
		}

		await testingFunction(writeScreenText);
		setButtonDisabled(false);
	}

	function writeScreenText(text: string) {
		setScreenText((prevText) => prevText + text + "\n");
	}

	function resetTesting() {
		setTestingMode(null);
		setScreenText("");
		props.setShowMainHeader(true);
	}

	let pageContent = null;
	if (testingMode === null) {
		pageContent = (
			<SelectorButtons title={`Select test`} options={testingModes} />
		);
	} else {
		pageContent = <Screen text={screenText} />;
	}

	let footerContent = null;
	if (testingMode === null) {
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
				handleClick={() => resetTesting()}
				disabled={buttonDisabled}
				key={`reset-button`}
			/>
		);
	}

	return (
		<FluidContainer
			headerContent={[
				<h1 className="header-text-1" key={`title`}>
					Test model
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
