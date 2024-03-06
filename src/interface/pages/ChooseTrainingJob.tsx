import { useState } from "react";
import { HandleWorkParams, WorkName } from "../../modelHandling/types";
import { GameName } from "../../types";
import { formatGameName, standardFileProtocol } from "../../util";
import { useSelectedModelInfo } from "./App";
import PickOption from "../components/PickOption";
import Disclaimer from "../components/Disclaimer";
import Training from "./Training";

interface ChooseTrainingJobProps {
	gameName: GameName;
	handleReturn: () => void;
}

export default function ChooseTrainingJob({
	gameName,
	handleReturn,
}: ChooseTrainingJobProps) {
	const [handleWorkParams, setHandleWorkParams] =
		useState<HandleWorkParams | null>(null);

	const selectedModelInfo = useSelectedModelInfo();

	if (selectedModelInfo === null) {
		return (
			<Disclaimer
				title={`Training`}
				subtitle={formatGameName(gameName)}
				text={`You must load a model before training!`}
				handleReturn={handleReturn}
			/>
		);
	} else if (handleWorkParams === null) {
		return (
			<PickOption
				title={`Training`}
				subtitle={formatGameName(gameName)}
				actions={[
					{
						name: `Build Training Memory`,
						handleClick: () => {
							setHandleWorkParams({
								workName: WorkName.BuildMemory,
								gameName: gameName,
								fileSystemProtocol: standardFileProtocol,
								modelInfo: selectedModelInfo,
								numSearches: 60,
								explorationConstant: 2,
								numSelfPlayIterations: 10,
							});
						},
					},
					{
						name: `Create Model`,
						handleClick: () => {
							setHandleWorkParams({
								workName: WorkName.CreateModel,
								gameName: gameName,
								fileSystemProtocol: standardFileProtocol,
								modelInfo: selectedModelInfo,
								numSearches: 60,
								explorationConstant: 2,
								numSelfPlayIterations: 10,
							});
						},
					},
				]}
				handleReturn={handleReturn}
			/>
		);
	} else {
		<Training
			handleWorkParams={handleWorkParams}
			handleReturn={() => setHandleWorkParams(null)}
		/>;
	}
}
