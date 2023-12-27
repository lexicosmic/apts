import * as tf from "@tensorflow/tfjs-node";
import { useEffect, useState } from "react";
import { GameMode } from "../../types";
import { gameDefinitions } from "../definitions";
import Game, { ActionOutcome, Outcome, Player, State } from "../../engine/Game";
import MonteCarloTreeSearch from "../../engine/MonteCarloTree";
import Button from "../Button/Button";
import FluidContainer from "../FluidContainer/FluidContainer";
import Header from "../Header/Header";
import Screen from "../Screen/Screen";
import ResNet from "../../engine/ResNet";

// Load the model and create the Monte Carlo Tree Search object
async function loadModel(
	game: Game,
	setMonteCarloTreeSearch: (monteCarloTreeSearch: MonteCarloTreeSearch) => void
) {
	// const model = await tf.loadLayersModel(
	// 	`localStorage://models/${gameDefinitions.modelDirectory}/model.json`
	// );
	// const resNet = new ResNet(game, { model });
	// const monteCarloTreeSearch = new MonteCarloTreeSearch(game, resNet, {
	// 	numSearches: 1000,
	// 	explorationConstant: 2,
	// });
	// setMonteCarloTreeSearch(monteCarloTreeSearch);
}

interface PlayGameProps {
	gameMode: GameMode;
	setGameMode: (gameMode: GameMode | null) => void;
}

export default function PlayGame(props: PlayGameProps) {
	const [game, setGame] = useState<Game>(gameDefinitions.game);
	const [monteCarloTreeSearch, setMonteCarloTreeSearch] =
		useState<MonteCarloTreeSearch | null>(null);
	const [state, setState] = useState<State>(game.getInitialState());
	const [player, setPlayer] = useState<Player>(Player.X);
	const [history, setHistory] = useState<JSX.Element[]>([]);
	const [gameOutcome, setOutcome] = useState<ActionOutcome>({
		isTerminal: false,
		value: Outcome.Loss,
	});

	useEffect(() => {
		if (props.gameMode === GameMode.PvC || props.gameMode === GameMode.CvC) {
			loadModel(game, setMonteCarloTreeSearch);
		}
	}, []);

	let gameScreen = null;
	let formattedCellText: (player: Player) => string;
	let formattedPlayerName: (player: Player) => string;

	return (
		<FluidContainer
			headerContent={
				<Header>
					<h1>TicTacToe</h1>
					<p className="display-text-3">{props.gameMode}</p>
				</Header>
			}
			footerContent={
				<Button text="Return" handleClick={() => props.setGameMode(null)} />
			}
		>
			<Screen game={game} />
		</FluidContainer>
	);
}
