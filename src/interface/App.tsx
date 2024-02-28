import { useEffect, useState } from "react";
import { GameMode, GameName, ModelInfo } from "../types";
import { formatGameName, standardFileProtocol } from "../util";
import { HandleWorkParams, WorkName } from "../modelHandling/types";
import PickOption from "./PickOption";
import Training from "./Training";
import Playing from "./Playing";
import Anchor from "./Anchor";
import ManageModels from "./ManageModels";
import Disclaimer from "./Disclaimer";

export default function App() {
	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<ActionOnGame | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [handleWorkParams, setHandleWorkParams] =
		useState<HandleWorkParams | null>(null);
	const [selectedModelInfo, setSelectedModelInfo] = useState<ModelInfo | null>(
		null
	);
	const [showManageModelsScreen, setShowManageModelsScreen] =
		useState<boolean>(false);

	let showHeader =
		gameMode === null && handleWorkParams === null && !showManageModelsScreen;
	let showFooter =
		gameName !== null && !showManageModelsScreen && gameMode !== GameMode.PvP;
	let isManageModelsButtonDisabled =
		(action === ActionOnGame.Play &&
			gameMode !== null &&
			selectedModelInfo !== null) ||
		((action === ActionOnGame.Train || action === ActionOnGame.Test) &&
			handleWorkParams !== null);

	useEffect(() => {
		if (gameName === null) setSelectedModelInfo(null);
	}, [gameName]);

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
		if (showManageModelsScreen)
			return (
				<ManageModels
					gameName={gameName}
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
						gameName={gameName}
						modelInfo={selectedModelInfo}
						gameMode={gameMode}
						handleReturn={() => {
							setGameMode(null);
						}}
					/>
				);
			case ActionOnGame.Train:
				if (handleWorkParams === null)
					if (selectedModelInfo === null)
						return (
							<Disclaimer
								title={`Training`}
								subtitle={formatGameName(gameName)}
								text={`You must load a model before training!`}
								handleReturn={() => setAction(null)}
							/>
						);
					else
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
								handleReturn={() => setAction(null)}
							/>
						);
				else
					return (
						<Training
							handleWorkParams={handleWorkParams}
							handleReturn={() => setHandleWorkParams(null)}
						/>
					);
			case ActionOnGame.Test:
				if (handleWorkParams === null)
					return (
						<PickOption
							title={`Testing`}
							subtitle={formatGameName(gameName)}
							actions={[
								{
									name: `Monte-Carlo Search Test`,
									handleClick: () => {
										setHandleWorkParams({
											workName: WorkName.MCTSCommon,
											gameName: gameName,
										});
									},
								},
								{
									name: `ResNet Structure Test`,
									handleClick: () => {
										setHandleWorkParams({
											workName: WorkName.Structure,
											gameName: gameName,
											fileSystemProtocol: standardFileProtocol,
										});
									},
								},
								{
									name: `Blind Testing Test`,
									handleClick: () => {
										setHandleWorkParams({
											workName: WorkName.Blind,
											gameName: gameName,
											fileSystemProtocol: standardFileProtocol,
										});
									},
								},
							]}
							handleReturn={() => setAction(null)}
						/>
					);
				return (
					<Training
						handleWorkParams={handleWorkParams}
						handleReturn={() => setHandleWorkParams(null)}
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
