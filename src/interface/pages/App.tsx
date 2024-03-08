import { useEffect, useState } from "react";
import { GameMode, GameName, ModelInfo, StoredMemory } from "../../types";
import { HandleWorkParams, JobName } from "../../modelHandling/types";
import { formatGameName, standardFileProtocol } from "../../util";
import Disclaimer from "../components/Disclaimer";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Menu from "./Menu";
import PickOption from "./PickOption";
import Playing from "./Playing";
import Training from "./Training";

export default function App() {
	const [gameName, setGameName] = useState<GameName | null>(null);
	const [action, setAction] = useState<ActionOnGame | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [handleWorkParams, setHandleWorkParams] =
		useState<HandleWorkParams | null>(null);
	const [selectedModelInfo, setSelectedModelInfo] = useState<ModelInfo | null>(
		null
	);
	const [selectedMemory, setSelectedMemory] = useState<StoredMemory | null>(
		null
	);
	const [showMenuScreen, setShowMenuScreen] = useState<boolean>(false);

	const isMenuButtonDisabled = (): boolean => {
		return (
			gameName === null ||
			(action === ActionOnGame.Play &&
				gameMode !== null &&
				selectedModelInfo !== null) ||
			(action === ActionOnGame.Test && handleWorkParams !== null) ||
			(action === ActionOnGame.Train &&
				handleWorkParams !== null &&
				(handleWorkParams.jobName === JobName.CreateModel
					? selectedMemory !== null
					: true))
		);
	};

	useEffect(() => {
		if (gameName === null) setSelectedModelInfo(null);
	}, [gameName]);

	console.log(selectedMemory);

	function getMainContent(): JSX.Element {
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
		if (showMenuScreen)
			return (
				<Menu
					gameName={gameName}
					setShowMenuScreen={setShowMenuScreen}
					selectedModel={selectedModelInfo}
					setSelectedModel={setSelectedModelInfo}
					selectedMemory={selectedMemory}
					setSelectedMemory={setSelectedMemory}
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
												jobName: JobName.BuildMemory,
												gameName: gameName,
												fileSystemProtocol: standardFileProtocol,
												modelInfo: selectedModelInfo,
												numSearches: 60,
												explorationConstant: 2,
												numSelfPlayIterations: 1,
											});
										},
									},
									{
										name: `Create Model`,
										handleClick: () => {
											setHandleWorkParams({
												jobName: JobName.CreateModel,
												gameName: gameName,
												fileSystemProtocol: standardFileProtocol,
												modelInfo: selectedModelInfo,
												numSearches: 60,
												explorationConstant: 2,
												maxNumIterations: 1,
												numEpochs: 10,
												batchSize: 64,
												learningRate: 0.01,
												trainingMemories: [selectedMemory?.trainingMemory],
											});
										},
									},
								]}
								handleReturn={() => setAction(null)}
							/>
						);
				else if (
					handleWorkParams.jobName === JobName.CreateModel &&
					selectedMemory === null
				)
					return (
						<Disclaimer
							title={`Training`}
							subtitle={formatGameName(gameName)}
							text={`You must load a memory before training!`}
							handleReturn={() => setHandleWorkParams(null)}
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
											jobName: JobName.MCTSCommon,
											gameName: gameName,
										});
									},
								},
								{
									name: `ResNet Structure Test`,
									handleClick: () => {
										setHandleWorkParams({
											jobName: JobName.Structure,
											gameName: gameName,
											fileSystemProtocol: standardFileProtocol,
										});
									},
								},
								{
									name: `Blind Testing Test`,
									handleClick: () => {
										setHandleWorkParams({
											jobName: JobName.Blind,
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
				{!showMenuScreen && (
					<header
						className={`text-center pt-2 px-2 grid grid-cols-[1fr_auto_1fr]`}
					>
						<h1 className={`text-4xl col-start-2 flex justify-center`}>
							<span className={`hidden sm:block`}>Auto Playtest System</span>
							<span className={`sm:hidden`}>APTS</span>
						</h1>
						<Button
							onClick={() => {
								setShowMenuScreen(true);
							}}
							disabled={isMenuButtonDisabled()}
							color={`light`}
							className={`col-start-3 h-min w-min ml-auto aspect-square`}
							ariaLabel={`Open menu to manage models and data`}
						>
							<Icon name={`list`} />
						</Button>
					</header>
				)}
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
