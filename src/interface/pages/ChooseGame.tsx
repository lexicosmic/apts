import { useState } from "react";
import { GameName, ModelInfo } from "../../types";
import { formatGameName } from "../../util";
import PickOption from "../components/PickOption";
import ChooseAction, { ActionOnGame } from "./ChooseAction";
import ManageModels from "./ManageModels";
import { useSelectedModelInfo } from "./App";

interface ChooseGameProps {
	showMenuScreen: boolean;
	setShowMenuScreen: (showMenuScreen: boolean) => void;
	setSelectedModelInfo: (modelInfo: ModelInfo | null) => void;
	gameName: GameName | null;
	setGameName: (gameName: GameName | null) => void;
}

export default function ChooseGame({
	showMenuScreen,
	setShowMenuScreen,
	setSelectedModelInfo,
	gameName,
	setGameName,
}: ChooseGameProps) {
	const selectedModelInfo = useSelectedModelInfo();

	const [action, setAction] = useState<ActionOnGame | null>(null);

	if (gameName === null) {
		return (
			<PickOption
				title={`Select a game`}
				actions={[
					{
						name: formatGameName(GameName.TicTacToe),
						handleClick: () => setGameName(GameName.TicTacToe),
					},
					{
						name: formatGameName(GameName.ConnectFour),
						handleClick: () => setGameName(GameName.ConnectFour),
					},
				]}
			/>
		);
	} else if (showMenuScreen) {
		return (
			<ManageModels
				gameName={gameName}
				selectedModel={selectedModelInfo}
				setSelectedModel={setSelectedModelInfo}
				handleReturn={() => {
					setShowMenuScreen(false);
				}}
			/>
		);
	} else {
		return (
			<ChooseAction
				gameName={gameName}
				action={action}
				setAction={setAction}
				handleReturn={() => {
					setGameName(null);
				}}
			/>
		);
	}
}
