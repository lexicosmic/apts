import React from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {GameMode, SelectListItem} from './types.js';
import Game from './game/Game.js';

export default function App() {
	const [gameMode, setGameMode] = React.useState<GameMode | null>(null);

	function handleSelect(item: SelectListItem) {
		if (item.value === GameMode.PvP) {
			setGameMode(GameMode.PvP);
		} else if (item.value === GameMode.PvC) {
			setGameMode(GameMode.PvC);
		} else if (item.value === GameMode.CvC) {
			setGameMode(GameMode.CvC);
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
				<>
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
						onSelect={handleSelect}
					/>
				</>
			) : (
				<Game gameMode={gameMode} />
			)}
		</Box>
	);
}
