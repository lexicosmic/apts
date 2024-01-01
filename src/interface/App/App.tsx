import styles from "./App.module.css";
import { GameName, formatGameName } from "../../types";
import { useState } from "react";
import Header from "../Header/Header";
import SelectorButtons from "../SelectorButtons/SelectorButtons";
import Button from "../Button/Button";
import Training from "../Training/Training";
import Testing from "../Testing/Testing";
import Playing from "../Playing/Playing";
import ManageModels from "../ManageModels/ManageModels";

interface Action {
	name: string;
	pageContent: JSX.Element;
	handleClick: () => void;
}

export default function App() {
	const [showMainHeader, setShowMainHeader] = useState<boolean>(true);
	// const [showManageModelsButton, setShowManageModelsButton] =
	// 	useState<boolean>(false);
	const [showManageModelsScreen, setShowManageModelsScreen] =
		useState<boolean>(true);

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
					setShowManageModelsScreen={setShowManageModelsScreen}
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
			<Header className={styles.header} orientation="horizontal">
				{gameName !== null && (
					<button
						className={styles.manageModelsButton}
						onClick={() => setShowManageModelsScreen(true)}
						key={`manage-models-button`}
					/>
				)}
				{showMainHeader && (
					<h1 className={`display-text-1 ${styles.headerTitle}`}>
						<span className={styles.headerTitleLong}>Auto Playtest System</span>
						<span className={styles.headerTitleShort}>APTS</span>
					</h1>
				)}
			</Header>
			{showManageModelsScreen && (
				<ManageModels setShowManageModelsScreen={setShowManageModelsScreen} />
			)}
			<main className={styles.main}>{pageContent}</main>
		</>
	);
}
