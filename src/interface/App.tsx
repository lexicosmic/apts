import { useEffect, useState } from "react";
import { GameMode, GameName, ModelInfo, TestingFunction } from "../types";
import { getFullModelPath, formatGameName } from "../util";
import { loadGame } from "./util";
import Game from "../engine/Game";
import testMCTSCommon from "../modelHandling/testing/testMCTSCommon";
import testResNetStructure from "../modelHandling/testing/testResNetStructure";
import testBlindTraining from "../modelHandling/testing/testBlindTraining";
import PickOption from "./PickOption";
import Testing from "./Testing";
import Playing from "./Playing";
import Anchor from "./Anchor";
import ManageModels from "./ManageModels";
import Disclaimer from "./Disclaimer";

export default function App() {
	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<ActionOnGame | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [test, setTest] = useState<Test | null>(null);
	const [selectedModelInfo, setSelectedModelInfo] = useState<ModelInfo | null>(
		null
	);

	let game: Game | null;
	if (gameName !== null) game = loadGame(gameName);
	else game = null;

	const [showManageModelsScreen, setShowManageModelsScreen] =
		useState<boolean>(false);
	let showHeader =
		gameMode === null && test === null && !showManageModelsScreen;
	let showFooter =
		game !== null && !showManageModelsScreen && gameMode !== GameMode.PvP;
	let isManageModelsButtonDisabled =
		(action === ActionOnGame.Play &&
			gameMode !== null &&
			selectedModelInfo !== null) ||
		(action === ActionOnGame.Test && test !== null);

	useEffect(() => {
		if (game === null) setSelectedModelInfo(null);
	}, [game]);

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
		if (showManageModelsScreen)
			return (
				<ManageModels
					game={game}
					selectedModel={selectedModelInfo}
					setSelectedModel={setSelectedModelInfo}
					handleReturn={() => {
						setShowManageModelsScreen(false);
					}}
				/>
			);
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
				if (gameMode === null)
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
				if (gameMode !== GameMode.PvP && selectedModelInfo === null)
					return (
						<Disclaimer
							title={`Playing`}
							subtitle={formatGameName(gameName)}
							text={`You must load a model before playing this game!`}
							handleReturn={() => setGameMode(null)}
						/>
					);
				return (
					<Playing
						game={game}
						modelInfo={selectedModelInfo}
						gameMode={gameMode}
						handleReturn={() => {
							setGameMode(null);
						}}
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
				return (
					<section>
						<p>Something went wrong</p>
					</section>
				);
		}
	}

	return (
		<>
			<article className={`h-full text-white bg-neutral-900 flex flex-col`}>
				{showHeader && (
					<header className={`mt-1 flex justify-center`}>
						<h1 className={`text-4xl`}>
							<span className={`hidden sm:block `}>Auto Playtest System</span>
							<span className={`sm:hidden`}>APTS</span>
						</h1>
					</header>
				)}
				<main className={`flex-grow flex flex-col justify-center items-center`}>
					{getMainContent()}
				</main>
				{showFooter && (
					<footer className={`flex justify-center`}>
						<Anchor
							onClick={() => {
								setShowManageModelsScreen(true);
							}}
							disabled={isManageModelsButtonDisabled}
							color={`light`}
						>
							<p className={`text-lg text-center font-mono`}>
								{selectedModelInfo ? selectedModelInfo.name : `No loaded model`}
							</p>
						</Anchor>
					</footer>
				)}
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
