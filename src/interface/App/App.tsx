import styles from "./App.module.css";
import { GameName, formatGameName } from "../../types";
import { useState } from "react";
import Header from "../Header/Header";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Button from "../Button/Button";
import Training from "../Training/Training";
import Testing from "../Testing/Testing";
import Playing from "../Playing/Playing";

interface Action {
	name: string;
	pageContent: JSX.Element;
	handleClick: () => void;
}

export default function App() {
	const [showMainHeader, setShowMainHeader] = useState<boolean>(true);
	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<Action | null>(null);

	const gameOptions = [
		{
			name: formatGameName(GameName.TicTacToe),
			handleClick: () => setGameName(GameName.TicTacToe),
		},
		{
			name: formatGameName(GameName.ConnectFour),
			handleClick: () => setGameName(GameName.ConnectFour),
		},
	];

	const actions: Action[] = [
		{
			name: "Play",
			pageContent: (
				<Playing
					gameName={gameName!}
					handleReturn={() => setAction(null)}
					setShowMainHeader={setShowMainHeader}
				/>
			),
			handleClick: () => setAction(actions[0]),
		},
		{
			name: "Train",
			pageContent: (
				<Training gameName={gameName!} handleReturn={() => setAction(null)} />
			),
			handleClick: () => setAction(actions[1]),
		},
		{
			name: "Test",
			pageContent: (
				<Testing
					gameName={gameName!}
					handleReturn={() => setAction(null)}
					setShowMainHeader={setShowMainHeader}
				/>
			),
			handleClick: () => setAction(actions[2]),
		},
	];

	let pageContent = null;
	if (gameName === null) {
		pageContent = (
			<SelectorButtons title={`Select a game`} options={gameOptions} />
		);
	} else {
		if (action === null) {
			pageContent = [
				<SelectorButtons
					title={`Select an action`}
					subtitle={formatGameName(gameName)}
					options={actions}
					key={`select-action`}
				/>,
				<Button
					text={`Return`}
					handleClick={() => setGameName(null)}
					key={`return-to-games`}
				/>,
			];
		} else {
			// Has picked an action
			pageContent = action.pageContent;
		}
	}

	return (
		<>
			{showMainHeader && (
				<Header>
					<h1 className="display-text-1">Auto Playtest System</h1>
				</Header>
			)}
			<main className={styles.main}>{pageContent}</main>
		</>
	);
}
