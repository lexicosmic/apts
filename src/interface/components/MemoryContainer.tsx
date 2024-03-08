import { useRef, useState } from "react";
import { StoredMemory } from "../../types";
import { DBOperations_Memories } from "../../database";
import Button from "./Button";
import { ConfirmExclusionModal } from "./Modal";
import Icon from "./Icon";

interface MemoryContainerProps {
	storedMemory: StoredMemory;
	setSelectedMemory: (storedMemory: StoredMemory | null) => void;
	selected?: boolean;
	updateMemories: () => void;
}

export default function MemoryContainer({
	storedMemory,
	setSelectedMemory,
	selected = false,
	updateMemories,
}: MemoryContainerProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [updatedName, setUpdatedName] = useState(storedMemory.name);
	const [isDeleting, setIsDeleting] = useState(false);

	const editNameInput = useRef<HTMLInputElement>(null);

	function editMemory() {
		if (!updatedName || updatedName === storedMemory.name) {
			setIsEditing(false);
			return;
		}
		storedMemory.name = updatedName;
		DBOperations_Memories.put(
			storedMemory,
			() => {
				setIsEditing(false);
			},
			() => {}
		);
	}

	function deleteMemory() {
		setSelectedMemory(null);
		DBOperations_Memories.delete(
			storedMemory,
			() => {
				updateMemories();
			},
			() => {}
		);
	}

	return (
		<section
			className={`text-black border rounded p-2 grid gap-x-2
				${selected ? `bg-orange-100 border-2 border-orange-400` : `bg-neutral-50`}
			`}
			aria-label={`Memory ${storedMemory.name}`}
			aria-current={selected}
		>
			<div className={`flex flex-col items-baseline gap-1`}>
				{isEditing ? (
					<input
						ref={editNameInput}
						value={updatedName}
						onChange={(e) => setUpdatedName(e.target.value)}
						className={`w-full text-xl font-bold bg-transparent border-b border-black focus:outline-none`}
					/>
				) : (
					<p className={`text-xl font-bold`}>{storedMemory.name}</p>
				)}
			</div>
			<p
				className={`col-start-1 row-start-2 text-sm font-mono text-neutral-800`}
			>
				Length: <span className={`font-bold`}>{storedMemory.length}</span>
			</p>
			<div
				className={`w-max h-max ml-auto col-start-2 row-start-1 row-span-2 gap-1 grid 2xs:grid-rows-2 2xs:grid-cols-2`}
			>
				{isEditing ? (
					<>
						<Button
							color={`green`}
							onClick={() => editMemory()}
							ariaLabel={`Save edit`}
						>
							<Icon name={`check-lg`} />
						</Button>
						<Button
							color={`red`}
							onClick={() => {
								setIsEditing(false);
							}}
							ariaLabel={`Cancel edit`}
						>
							<Icon name={`x-lg`} fontSize={`text-xl`} />
						</Button>
					</>
				) : (
					<>
						<Button
							color={`light`}
							onClick={() => {
								setSelectedMemory(storedMemory);
							}}
							className={`min-w-max`}
							ariaLabel={`Select model`}
						>
							<Icon name={`box-arrow-in-up-right`} ariaLabel="Select model" />
						</Button>
						{/* <Button
							color={`indigo`}
							onClick={() => exportResNetModel(modelInfo)}
							className={`min-w-max`}
							ariaLabel={`Download model`}
						>
							<Icon name={`file-earmark-arrow-down`} />
						</Button> */}
						<Button
							color={`amber`}
							onClick={() => {
								setIsEditing(true);
								setTimeout(() => {
									editNameInput.current?.focus();
								}, 0);
							}}
							className={`min-w-max`}
							ariaLabel={`Edit model`}
						>
							<Icon name={`pencil-fill`} fontSize={`text-xl`} />
						</Button>
						<Button
							color={`red`}
							onClick={() => setIsDeleting(true)}
							className={`min-w-max`}
							ariaLabel={`Delete model`}
						>
							<Icon name={`trash3-fill`} />
						</Button>
					</>
				)}
			</div>
			{isDeleting && (
				<ConfirmExclusionModal
					id={`deleting_${storedMemory.id}`}
					entityName={`this model`}
					confirm={() => deleteMemory()}
					close={() => setIsDeleting(false)}
				/>
			)}
		</section>
	);
}
