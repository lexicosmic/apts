import { useState } from "react";
import { saveLayersModel } from "./util";
import { ModelInfo } from "../types";
import { capitalizeFirstLetter } from "../util";
import { DBOperations_Models } from "../database";
import Button from "./Button";
import { ConfirmExclusionModal } from "./Modal";

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
				className={`w-fit h-fit ml-auto col-start-2 row-start-1 row-span-3 xs:row-span-2 gap-1 grid xs:grid-rows-2 xs:grid-cols-2`}
			>
				{isEditing ? (
					<>
						<Button
							color={`green`}
							onClick={() => editModel()}
							aria-label={`Save edit`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-check-lg w-6 h-6`}
								viewBox="0 0 16 16"
							>
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
							</svg>
						</Button>
						<Button
							color={`red`}
							onClick={() => {
								setIsEditing(false);
							}}
							aria-label={`Cancel edit`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-x-lg w-5 h-5 m-auto`}
								viewBox="0 0 16 16"
							>
								<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
							</svg>
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
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-box-arrow-in-up-right w-6 h-6`}
								viewBox="0 0 16 16"
							>
								<path
									fillRule="evenodd"
									d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5"
								/>
								<path
									fillRule="evenodd"
									d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0z"
								/>
							</svg>
						</Button>
						<Button
							color={`indigo`}
							onClick={() => downloadModel()}
							aria-label={`Download model`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-file-earmark-arrow-down w-6 h-6`}
								viewBox="0 0 16 16"
							>
								<path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
								<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
							</svg>
						</Button>
						<Button
							color={`amber`}
							onClick={() => setIsEditing(true)}
							aria-label={`Edit model`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-pencil-fill w-5 h-5 m-auto`}
								viewBox="0 0 16 16"
							>
								<path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
							</svg>
						</Button>
						<Button
							color={`red`}
							onClick={() => setIsDeleting(true)}
							aria-label={`Delete model`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className={`bi bi-trash3-fil w-6 h-6`}
								viewBox="0 0 16 16"
							>
								<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
							</svg>
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
