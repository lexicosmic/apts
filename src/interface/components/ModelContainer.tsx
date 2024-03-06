import { useRef, useState } from "react";
import { ModelInfo, SerializedModel } from "../../types";
import { capitalizeFirstLetter, getFullModelPath } from "../../util";
import { DBOperations_Models } from "../../database";
import Button from "./Button";
import { ConfirmExclusionModal } from "./Modal";
import Icon from "./Icon";
import { exportResNetModel } from "../util";

interface ModelContainerProps {
	modelInfo: ModelInfo;
	setSelectedModel: (modelInfo: ModelInfo | null) => void;
	selected?: boolean;
	updateModels: () => void;
}

export default function ModelContainer({
	modelInfo,
	setSelectedModel,
	selected = false,
	updateModels,
}: ModelContainerProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [updatedName, setUpdatedName] = useState(modelInfo.name);
	const [isDeleting, setIsDeleting] = useState(false);

	const modelPath = getFullModelPath(
		modelInfo.game,
		modelInfo.type,
		modelInfo.innerPath
	);

	const editNameInput = useRef<HTMLInputElement>(null);

	function editModel() {
		if (!updatedName || updatedName === modelInfo.name) {
			setIsEditing(false);
			return;
		}
		modelInfo.name = updatedName;
		DBOperations_Models.put(
			modelInfo,
			() => {
				setIsEditing(false);
			},
			() => {}
		);
	}

	function deleteModel() {
		setSelectedModel(null);
		DBOperations_Models.delete(
			modelInfo,
			() => {
				updateModels();
			},
			() => {}
		);
	}

	return (
		<section
			className={`text-black border rounded p-2 grid gap-x-2
				${selected ? `bg-orange-100 border-2 border-orange-400` : `bg-neutral-50`}
			`}
			aria-label={`Model ${modelInfo.name}`}
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
					<p className={`text-xl font-bold`}>{modelInfo.name}</p>
				)}
				<p className={`font-mono`}>{`${capitalizeFirstLetter(
					modelInfo.type
				)}`}</p>
			</div>
			<p
				className={`col-start-1 row-start-3 text-sm font-mono text-neutral-800 xs:col-span-2`}
			>
				{modelInfo.innerPath}
			</p>
			<div
				className={`w-fit h-fit ml-auto col-start-2 row-start-1 row-span-3 2xs:row-span-2 gap-1 grid 2xs:grid-rows-2 2xs:grid-cols-2`}
			>
				{isEditing ? (
					<>
						<Button
							color={`green`}
							onClick={() => editModel()}
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
								setSelectedModel(modelInfo);
							}}
							className={`min-w-max`}
							ariaLabel={`Select model`}
						>
							<Icon name={`box-arrow-in-up-right`} ariaLabel="Select model" />
						</Button>
						<Button
							color={`indigo`}
							onClick={() => exportResNetModel(modelInfo)}
							className={`min-w-max`}
							ariaLabel={`Download model`}
						>
							<Icon name={`file-earmark-arrow-down`} />
						</Button>
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
							<Icon name={`pencil-fill`} fontSize="text-xl" />
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
					id={`deleting_${modelPath}`}
					entityName={`this model`}
					confirm={() => deleteModel()}
					close={() => setIsDeleting(false)}
				/>
			)}
		</section>
	);
}
