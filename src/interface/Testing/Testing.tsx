import styles from "./Testing.module.css";
import { GameName, formatGameName } from "../../types";
import { useEffect, useState } from "react";
import FluidContainer from "../FluidContainer/FluidContainer";
import Button from "../Button/Button";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Screen from "../Screen/Screen";
import testMCTSCommon from "../../modelHandling/testing/testMCTSCommon";
import testResNetStructure from "../../modelHandling/testing/testResNetStructure";
import testLoadModel from "../../modelHandling/testing/testLoadModel";
import testBlindTesting from "../../modelHandling/testing/testBlindTraining";

interface Test {
	name: string;
	handleClick: () => void;
	testingFunction: (
		printMessage: (message: string) => void,
		modelPath: string
	) => Promise<void>;
	mustLoadModel: boolean;
}

interface TestingProps {
	gameName: GameName;
	handleReturn: () => void;
	setShowMainHeader: (showMainHeader: boolean) => void;
	setShowManageModelsScreen: (showManageModelsScreen: boolean) => void;
}

export default function Testing(props: TestingProps) {
	const [test, setTest] = useState<Test | null>(null);
	const [screenText, setScreenText] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	useEffect(() => {
		if (test === null) {
			setTest(null);
			setButtonDisabled(false);
			// props.setShowMainHeader(true);
		} else {
			performTesting(test);
		}
	}, [test]);

	const tests: Test[] = [
		{
			name: "Monte-Carlo Search Test",
			handleClick: () => handleTestSelected(tests[0]),
			testingFunction: testMCTSCommon,
			mustLoadModel: false,
		},
		{
			name: "ResNet Structure Test",
			handleClick: () => handleTestSelected(tests[1]),
			testingFunction: testResNetStructure,
			mustLoadModel: false,
		},
		{
			name: "Load Model Test",
			handleClick: () => handleTestSelected(tests[2]),
			testingFunction: testLoadModel,
			mustLoadModel: true,
		},
		{
			name: "Blind Testing Test",
			handleClick: () => handleTestSelected(tests[3]),
			testingFunction: testBlindTesting,
			mustLoadModel: false,
		},
	];

	function handleTestSelected(test: Test) {
		setButtonDisabled(true);
		setTest(test);
		// props.setShowMainHeader(false);
	}

	async function performTesting(test: Test) {
		await test.testingFunction(writeScreenText, "");
		setButtonDisabled(false);
	}

	function writeScreenText(text: string) {
		setScreenText((prevText) => prevText + text + "\n");
	}

	function resetTesting() {
		setTest(null);
		setScreenText("");
		// props.setShowMainHeader(true);
	}

	let pageContent = null;
	if (test === null) {
		pageContent = <SelectorButtons title={`Select test`} options={tests} />;
	} else {
		pageContent = <Screen text={screenText} />;
	}

	let footerContent = null;
	if (test === null) {
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
