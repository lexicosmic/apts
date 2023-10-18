import React from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {GameMode} from './types.js';
import Game from './game/Game.tsx';
import {ActionOutcome, Outcome} from './engine/TicTacToe.ts';

export default function App() {
	const [gameMode, setGameMode] = React.useState<GameMode | null>(null);
	const [playAgain, setPlayAgain] = React.useState<boolean>(true);
	const [gameOutcome, setGameOutcome] = React.useState<ActionOutcome>({
		isTerminal: false,
		value: Outcome.Loss,
	});

	function handleGameModeSelect(gameMode: GameMode) {
		if (gameMode === GameMode.PvP) {
			setGameMode(GameMode.PvP);
		} else if (gameMode === GameMode.PvC) {
			setGameMode(GameMode.PvC);
		} else if (gameMode === GameMode.CvC) {
			setGameMode(GameMode.CvC);
		}
	}

	function handlePlayAgainSelect(wishToPlayAgain: boolean) {
		if (wishToPlayAgain === true) {
			setPlayAgain(true);
			setGameMode(null);
		} else if (wishToPlayAgain === false) {
			setPlayAgain(false);
		}
	}

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold inverse color={'magentaBright'}>
					TicTacToe
				</Text>
			</Box>
			{gameMode === null ? (
				<Box flexDirection="column">
					<Text>Pick a game mode</Text>
					<SelectInput
						items={[
							{
								label: 'PvP',
								value: GameMode.PvP,
							},
							{
								label: 'PvC',
								value: GameMode.PvC,
							},
							{
								label: 'CvC',
								value: GameMode.CvC,
							},
						]}
						onSelect={(item: {value: GameMode}) =>
							handleGameModeSelect(item.value)
						}
					/>
				</Box>
			) : (
				<Box flexDirection="column">
					<Game
						gameMode={gameMode}
						gameOutcome={gameOutcome}
						setGameOutcome={setGameOutcome}
					/>

					{gameOutcome.isTerminal === true &&
						(playAgain === true ? (
							<Box flexDirection="column">
								<Text>Do you wish to play again?</Text>
								<SelectInput
									items={[
										{
											label: 'Yes',
											value: true,
										},
										{
											label: 'No',
											value: false,
										},
									]}
									onSelect={(item: {value: boolean}) =>
										handlePlayAgainSelect(item.value)
									}
								/>
							</Box>
						) : (
							<Text>Thanks for playing!</Text>
						))}
				</Box>
			)}
		</Box>
	);
}
