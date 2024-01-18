import React from "react";
import SelectInput from "ink-select-input";
import Game, { Action, State } from "../../engine/Game.js";

interface ActionSelectorProps {
	game: Game;
	state: State;
	handleSelect: (action: Action) => void;
}
export default function ActionSelector({
	game,
	state,
	handleSelect,
}: ActionSelectorProps) {
	const validActions = state.getValidActions();
	const items = [];
	for (let i = 0; i < validActions.length; i++) {
		const actionIsValid = validActions[i];
		if (actionIsValid) {
			items.push({
				label: i.toString(),
				value: i,
			});
		}
	}
	return (
		<SelectInput
			items={items}
			onSelect={(item: { value: any }) => handleSelect(item.value)}
		/>
	);
}
