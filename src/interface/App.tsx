import { useState } from "react";
import { GameMode, GameName, TestingFunction } from "../types";
import { formatGameName } from "../util";
import Game from "../engine/Game";
import testMCTSCommon from "../modelHandling/testing/testMCTSCommon";
import testResNetStructure from "../modelHandling/testing/testResNetStructure";
import testBlindTraining from "../modelHandling/testing/testBlindTraining";
import PickOption from "./PickOption";
import Testing from "./Testing";
import { loadGame } from "./util";

export default function App() {
	const [showManageModelsScreen, setShowManageModelsScreen] =
		useState<boolean>(false);

	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<ActionOnGame | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	// const [testingFunction, setTestingFunction] =
	// 	useState<TestingFunction | null>(null);
	const [test, setTest] = useState<Test | null>(null);
	// const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);

	let game: Game | null;
	if (gameName !== null) {
		game = loadGame(gameName);
	} else {
		game = null;
	}

	function getMainContent() {
		if (gameName === null)
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
		if (game === null) return <p>Loading game</p>;
		if (action === null)
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
					handleReturn={() => setGameName(null)}
					key={`select-action`}
				/>
			);
		switch (action) {
			case ActionOnGame.Play:
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
						handleReturn={() => setAction(null)}
					/>
				);
			case ActionOnGame.Train:
				return <></>;
			case ActionOnGame.Test:
				if (test === null)
					return (
						<PickOption
							title={`Testing`}
							subtitle={formatGameName(gameName)}
							actions={[
								{
									name: `Monte-Carlo Search Test`,
									handleClick: () => {
										setTest({
											name: `Monte-Carlo Search Test`,
											testingFunction: testMCTSCommon,
										});
									},
								},
								{
									name: `ResNet Structure Test`,
									handleClick: () => {
										setTest({
											name: `ResNet Structure Test`,
											testingFunction: testResNetStructure,
										});
									},
								},
								{
									name: `Blind Testing Test`,
									handleClick: () => {
										setTest({
											name: `Blind Testing Test`,
											testingFunction: testBlindTraining,
										});
									},
								},
							]}
							handleReturn={() => setAction(null)}
						/>
					);
				return (
					<Testing
						game={game}
						testingFunction={test.testingFunction}
						handleReturn={() => setTest(null)}
					/>
				);
			default:
				return <></>;
		}
	}

	return (
		<>
			<article className={`h-full text-white bg-neutral-900 flex flex-col`}>
				<header className={`mt-1 flex justify-center`}>
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
				<main className={`flex-grow flex flex-col justify-center items-center`}>
					{getMainContent()}
				</main>
			</article>
		</>
	);
}

enum ActionOnGame {
	Play = "Play",
	Train = "Train",
	Test = "Test",
}

type Test = {
	name: string;
	testingFunction: TestingFunction;
};
