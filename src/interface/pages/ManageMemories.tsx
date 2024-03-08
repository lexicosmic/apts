import { useEffect, useState } from "react";
import { GameName, StoredMemory } from "../../types";
import { DBOperations_Memories } from "../../database";
import Icon from "../components/Icon";
import Button from "../components/Button";
import MemoryContainer from "../components/MemoryContainer";

interface ManageMemoriesProps {
	gameName: GameName;
	selectedMemory: StoredMemory | null;
	setSelectedMemory: (memory: StoredMemory | null) => void;
}

export default function ManageMemories({
	gameName,
	selectedMemory,
	setSelectedMemory,
}: ManageMemoriesProps) {
	const [memories, setMemories] = useState<StoredMemory[]>([]);

	function getMemories() {
		const callback = (memories: StoredMemory[]) => {
			setMemories(memories);
		};
		DBOperations_Memories.getAllFromGame(gameName, callback);
	}

	useEffect(() => {
		getMemories();
	}, []);

	const selectedMemoryContainer = selectedMemory ? (
		<MemoryContainer
			storedMemory={selectedMemory}
			setSelectedMemory={setSelectedMemory}
			updateMemories={getMemories}
			selected={true}
			key={`selected-memory-container`}
		/>
	) : null;
	const memoryContainers: JSX.Element[] = [];
	if (memories.length > 0) {
		memories.sort((a, b) => {
			if (a.name < b.name) return -1;
			else if (a.name > b.name) return 1;
			else return 0;
		});
		for (let i = 0; i < memories.length; i++) {
			const memory = memories[i];
			const isSelected: boolean =
				selectedMemory !== null && selectedMemory.id === memory.id;
			if (isSelected) continue;
			const memoryContainer = (
				<MemoryContainer
					storedMemory={memory}
					setSelectedMemory={setSelectedMemory}
					updateMemories={getMemories}
					selected={false}
					key={`memory-container-${i}`}
				/>
			);
			memoryContainers.push(memoryContainer);
		}
	}

	return (
		<article className={`text-white bg-neutral-900 h-full`}>
			<header className={`text-center px-2 py-1 flex justify-between`}>
				<h1 className={`text-2xl`} key={`title`}>
					Manage models
				</h1>
			</header>
			<section className={`mx-2 mb-2`}>
				<div className={`flex flex-col gap-2`}>
					{selectedMemoryContainer}
					{memoryContainers}
				</div>
			</section>
		</article>
	);
}
