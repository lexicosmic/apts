import { useState } from "react";
import { saveLayersModel } from "./util";
import { ModelInfo } from "../types";
import { capitalizeFirstLetter } from "../util";
import { DBOperations_Models } from "../database";
import Button from "./Button";
import { ConfirmExclusionModal } from "./Modal";
import Icon from "./Icon";

interface ModelContainerProps {
	model: ModelInfo;
	setSelectedModel: (model: ModelInfo | null) => void;
	selected?: boolean;
	updateModels: () => void;
}

export default function ModelContainer({
	model,
	setSelectedModel,
	selected = false,
	updateModels,
}: ModelContainerProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [updatedName, setUpdatedName] = useState(model.name);
	const [isDeleting, setIsDeleting] = useState(false);

	function editModel() {
		model.name = updatedName;
		DBOperations_Models.update(model);
		setIsEditing(false);
	}

	function deleteModel() {
		setSelectedModel(null);
		DBOperations_Models.remove(model.path);
		updateModels();
	}

	async function downloadModel() {
		saveLayersModel(model.path);
	}

	return (
		<section
			className={`text-black border rounded p-2 grid gap-x-2
				${selected ? `bg-orange-100 border-2 border-orange-400` : `bg-neutral-50`}
			`}
		>
			<div className={`flex flex-col items-baseline gap-1`}>
				{isEditing ? (
					<input
						value={updatedName}
						onChange={(e) => setUpdatedName(e.target.value)}
						className={`w-full text-xl font-bold bg-transparent border-b border-black focus:outline-none`}
					/>
				) : (
					<p className={`text-xl font-bold`}>{model.name}</p>
				)}
				<p className={`font-mono`}>{`${capitalizeFirstLetter(model.type)}`}</p>
			</div>
			<p
				className={`col-start-1 row-start-3 text-sm font-mono text-neutral-800 xs:col-span-2`}
			>
				{model.path}
			</p>
			<div
				className={`w-fit h-fit ml-auto col-start-2 row-start-1 row-span-3 2xs:row-span-2 gap-1 grid 2xs:grid-rows-2 2xs:grid-cols-2`}
			>
				{isEditing ? (
					<>
						<Button
							color={`green`}
							onClick={() => editModel()}
							aria-label={`Save edit`}
						>
							<Icon name={`check-lg`} />
						</Button>
						<Button
							color={`red`}
							onClick={() => {
								setIsEditing(false);
							}}
							aria-label={`Cancel edit`}
						>
							<Icon name={`x-lg`} fontSize={`text-xl`} />
						</Button>
					</>
				) : (
					<>
						<Button
							color={`light`}
							onClick={() => {
								setSelectedModel(model);
							}}
							aria-label={`Select model`}
						>
							<Icon name={`box-arrow-in-up-right`} />
						</Button>
						<Button
							color={`indigo`}
							onClick={() => downloadModel()}
							aria-label={`Download model`}
						>
							<Icon name={`file-earmark-arrow-down`} />
						</Button>
						<Button
							color={`amber`}
							onClick={() => setIsEditing(true)}
							aria-label={`Edit model`}
						>
							<Icon name={`pencil-fill`} fontSize="text-xl" />
						</Button>
						<Button
							color={`red`}
							onClick={() => setIsDeleting(true)}
							aria-label={`Delete model`}
						>
							<Icon name={`trash3-fill`} />
						</Button>
					</>
				)}
			</div>
			{isDeleting && (
				<ConfirmExclusionModal
					id={`deleting_${model.path}`}
					entityName={`this model`}
					confirm={() => deleteModel()}
					cancel={() => setIsDeleting(false)}
				/>
			)}
		</section>
	);
}
