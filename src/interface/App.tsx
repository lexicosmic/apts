import { useState } from "react";
import { loadGame } from "./definitions";
import {
	GameMode,
	GameName,
	ModelInfo,
	TestingFunction,
	TrainingFunctionParams,
} from "../types";
import { formatGameName } from "../util";
import Game from "../engine/Game";
import testMCTSCommon from "../modelHandling/testing/testMCTSCommon";
import testResNetStructure from "../modelHandling/testing/testResNetStructure";
import testBlindTraining from "../modelHandling/testing/testBlindTraining";
import PickOption from "./PickOption";
import Testing from "./Testing/Testing";

export default function App() {
	const [showManageModelsScreen, setShowManageModelsScreen] =
		useState<boolean>(false);

	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<Action | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [testingFunction, setTestingFunction] =
		useState<TestingFunction | null>(null);
	// const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);

	let game: Game | null;
	if (gameName !== null) {
		game = loadGame(gameName);
	} else {
		game = null;
	}

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
			mainContent: (
				<PickOption
					title={`Playing`}
					subtitle={formatGameName(gameName!)}
					actions={[
						{
							name: `Player vs. Player`,
							handleClick: () => setGameMode(GameMode.PvP),
						},
						{
							name: `Player vs. Computer`,
							handleClick: () => setGameMode(GameMode.PvC),
						},
						{
							name: `Computer vs. Computer`,
							handleClick: () => setGameMode(GameMode.CvC),
						},
					]}
					handleReturn={() => setAction(null)}
				/>
			),
			handleClick: () => setAction(actions[0]),
		},
		{
			name: "Train",
			mainContent: (
				// <Training gameName={gameName!} handleReturn={() => setAction(null)} />
				<></>
			),
			handleClick: () => setAction(actions[1]),
		},
		{
			name: "Test",
			mainContent: (
				<PickOption
					title={`Testing`}
					subtitle={formatGameName(gameName!)}
					actions={[
						{
							name: `Monte-Carlo Search Test`,
							handleClick: () => {
								setTestingFunction(testMCTSCommon);
							},
						},
						{
							name: `ResNet Structure Test`,
							handleClick: () => {
								setTestingFunction(testResNetStructure);
							},
						},
						{
							name: `Blind Testing Test`,
							handleClick: () => {
								setTestingFunction(testBlindTraining);
							},
						},
					]}
					handleReturn={() => setAction(null)}
				/>
			),
			handleClick: () => setAction(actions[2]),
		},
	];

	let mainContent = null;
	if (gameName === null) {
		mainContent = <PickOption title={`Select a game`} actions={gameOptions} />;
	} else {
		if (action === null) {
			mainContent = [
				<PickOption
					title={`Select an action`}
					subtitle={formatGameName(gameName)}
					actions={actions}
					handleReturn={() => setGameName(null)}
					key={`select-action`}
				/>,
			];
		} else {
			mainContent = action.mainContent;
			if (game === null) {
				// console.log("Game", game);
				// console.log("Testing function", testingFunction);
				// <Testing
				// 	game={game}
				// 	handleReturn={() => {
				// 		setTestingFunction(null);
				// 	}}
				// 	testingFunction={testingFunction}
				// />;
			} else {
				if (testingFunction === null) {
					
				} else {
					<Testing
						game={game}
						handleReturn={() => {
							setTestingFunction(null);
						}}
						testingFunction={testingFunction}
					/>;
				}
			}
		}
	}

	// let pageContent = null;
	// if (game !== null && showManageModelsScreen) {
	// 	pageContent = (
	// 		<ManageModels
	// 			game={game}
	// 			selectedModel={selectedModel}
	// 			setShowManageModelsScreen={setShowManageModelsScreen}
	// 		/>
	// 	);
	// }

	return (
		<>
			<article
				className={`h-full text-white bg-neutral-900 grid grid-flow-row`}
			>
				<header className={`mt-1 flex-auto flex justify-center`}>
					{gameName !== null && (
						<button
							onClick={() => setShowManageModelsScreen(true)}
							key={`manage-models-button`}
						/>
					)}
					<h1 className={`text-4xl`}>
						<span className={`hidden sm:block `}>Auto Playtest System</span>
						<span className={`sm:hidden`}>APTS</span>
					</h1>
				</header>
				<main className={`flex flex-col items-center`}>{mainContent}</main>
			</article>
		</>
	);
}

interface Action {
	name: string;
	mainContent: JSX.Element;
	handleClick: () => void;
}
