import { GameName } from "../../types";
import { formatGameName } from "../../util";
import PickOption from "../components/PickOption";
import ChooseGameMode from "./ChooseGameMode";
import ChooseTrainingJob from "./ChooseTrainingJob";

interface ChooseActionProps {
	gameName: GameName;
	action: ActionOnGame | null;
	setAction: (action: ActionOnGame | null) => void;
	handleReturn: () => void;
}

export default function ChooseAction({
	gameName,
	action,
	setAction,
	handleReturn,
}: ChooseActionProps) {
	if (action === null) {
		return (
			<PickOption
				title={`Select an action`}
				subtitle={formatGameName(gameName)}
				actions={[
					{
						name: ActionOnGame.Play,
						handleClick: () => setAction(ActionOnGame.Play),
					},
					{
						name: ActionOnGame.Train,
						handleClick: () => setAction(ActionOnGame.Train),
					},
					{
						name: ActionOnGame.Test,
						handleClick: () => setAction(ActionOnGame.Test),
					},
				]}
				handleReturn={handleReturn}
				key={`select-action`}
			/>
		);
	} else if (action === ActionOnGame.Play) {
		return (
			<ChooseGameMode
				gameName={gameName}
				handleReturn={() => {
					setAction(null);
				}}
			/>
		);
	} else if (action === ActionOnGame.Train) {
		return (
			<ChooseTrainingJob
				gameName={gameName}
				handleReturn={() => {
					setAction(null);
				}}
			/>
		);
	}
}

export enum ActionOnGame {
	Play = "Play",
	Train = "Train",
	Test = "Test",
}
