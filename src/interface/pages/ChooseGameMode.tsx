import { useState } from "react";
import { GameMode, GameName } from "../../types";
import { formatGameName } from "../../util";
import { useSelectedModelInfo } from "./App";
import Playing from "./Playing";
import PickOption from "../components/PickOption";
import Disclaimer from "../components/Disclaimer";

interface ChooseGameModeProps {
	gameName: GameName;
	handleReturn: () => void;
}

export default function ChooseGameMode({
	gameName,
	handleReturn,
}: ChooseGameModeProps) {
	const selectedModelInfo = useSelectedModelInfo();

	const [gameMode, setGameMode] = useState<GameMode | null>(null);

	if (gameMode === null) {
		return (
			<PickOption
				title={`Playing`}
				subtitle={formatGameName(gameName)}
				actions={[
					{
						name: GameMode.PvP,
						handleClick: () => setGameMode(GameMode.PvP),
					},
					{
						name: GameMode.PvC,
						handleClick: () => setGameMode(GameMode.PvC),
					},
					{
						name: GameMode.CvC,
						handleClick: () => setGameMode(GameMode.CvC),
					},
				]}
				handleReturn={handleReturn}
			/>
		);
	} else {
		if (gameMode !== GameMode.PvP && selectedModelInfo === null) {
			return (
				<Disclaimer
					title={`Playing`}
					subtitle={formatGameName(gameName)}
					text={`You must load a model before playing this game!`}
					handleReturn={() => setGameMode(null)}
				/>
			);
		} else {
			return (
				<Playing
					gameName={gameName}
					modelInfo={selectedModelInfo}
					gameMode={gameMode}
					handleReturn={() => {
						setGameMode(null);
					}}
				/>
			);
		}
	}
}
