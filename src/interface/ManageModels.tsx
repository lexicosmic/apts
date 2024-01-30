import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { ModelInfo, ModelType } from "../types";
import { formatGameName } from "../util";
import { DBOperations_Models } from "../database";
import Game from "../engine/Game";
import ModelContainer from "./ModelContainer";
import { ModalWithHeader } from "./Modal";
import Icon from "./Icon";
import ButtonGroup from "./ButtonGroup";
import FileInput from "./FileInput";
import { v4 as uuidv4 } from "uuid";

interface ManageModelsProps {
	game: Game;
	selectedModel: ModelInfo | null;
	setSelectedModel: (model: ModelInfo | null) => void;
	handleReturn: () => void;
}

export default function ManageModels({
	game,
	selectedModel,
	setSelectedModel,
	handleReturn,
}: ManageModelsProps) {
	const [models, setModels] = useState<ModelInfo[]>([]);
	const [isUploadingModel, setIsUploadingModel] = useState(false);

	function getModels() {
		const callback = (models: ModelInfo[]) => {
			setModels(models);
		};
		DBOperations_Models.getAllFromGame(game.getName(), callback);
	}

	useEffect(() => {
		getModels();
	}, []);

	const topologyInput = useRef<HTMLInputElement>(null);
	const weightsInput = useRef<HTMLInputElement>(null);

	async function uploadModel(topology: File, weights: File) {
		if (!topology || topology.type !== `application/json`) {
			alert(`Invalid topology file!`);
			return;
		}
		if (!weights || weights.type !== `application/octet-stream`) {
			alert(`Invalid weights file!`);
			return;
		}
		const onError = () => {
			alert(`Invalid files!`);
		};
		try {
			const path = `${game.getName()}/uploaded/${uuidv4()}`;
			const layersModel = await tf.loadLayersModel(
				tf.io.browserFiles([topology, weights])
			);
			layersModel.summary();
			layersModel.save(`indexeddb://${path}`);
			const modelInfo: ModelInfo = {
				path: path,
				game: game.getName(),
				name: topology.name,
				type: ModelType.Uploaded,
			};
			DBOperations_Models.add(
				modelInfo,
				() => {
					getModels();
					setIsUploadingModel(false);
				},
				onError
			);
		} catch {
			onError();
			return;
		}
	}

	//TODO: Sort models
	let modelContainers: JSX.Element[] = [];
	if (models.length > 0) {
		for (let i = 0; i < models.length; i++) {
			const model = models[i];
			const isSelected: boolean =
				selectedModel !== null && model.path === selectedModel.path;
			const modelContainer = (
				<ModelContainer
					model={model}
					setSelectedModel={setSelectedModel}
					selected={isSelected}
					key={`model-container-${model.path}`}
					updateModels={getModels}
				/>
			);
			if (isSelected) modelContainers.unshift(modelContainer);
			else modelContainers.push(modelContainer);
		}
	}

	return (
		<article
			className={`w-full py-2 flex-grow
						bg-indigo-950
						gap-2 grid`}
			style={{
				gridTemplateColumns: "1fr auto 1fr",
				gridTemplateRows: "auto 1fr auto",
			}}
		>
			<header className={`col-start-2 col-span-1 text-center`}>
				<h1 className={`text-4xl`} key={`title`}>
					Manage models
				</h1>
				<p className={`text-2xl font-light`} key={`subtitle`}>
					{formatGameName(game.getName())}
				</p>
			</header>
			<section className={`col-start-1 col-span-3 mx-2 flex flex-col`}>
				<div
					className={`basis-px min-h-full overflow-scroll flex flex-col gap-2`}
				>
					{modelContainers}
				</div>
			</section>
			<footer className={`col-start-2 col-span-1`}>
				<ButtonGroup
					orientation={`horizontal`}
					options={[
						{
							content: (
								<p className={`flex justify-center gap-0.5`}>
									<Icon name={`file-earmark-arrow-up`} />
									Upload
								</p>
							),
							color: `indigo`,
							handleClick: () => setIsUploadingModel(true),
						},
						{
							content: (
								<p className={`flex justify-center gap-0.5`}>
									{/* <Icon name={`arrow-left-short`} /> */}
									Return
								</p>
							),
							color: `light`,
							handleClick: handleReturn,
						},
					]}
				/>
			</footer>
			{isUploadingModel && (
				<ModalWithHeader
					id={`upload-model`}
					title={`Upload model`}
					close={() => setIsUploadingModel(false)}
					footer={
						<footer>
							<ButtonGroup
								orientation={`horizontal`}
								options={[
									{
										content: <p>Upload</p>,
										color: `indigo`,
										handleClick: () => {
											if (
												topologyInput.current?.files &&
												topologyInput.current.files.length > 0 &&
												topologyInput.current.files[0] !== null &&
												topologyInput.current.files[0] !== undefined &&
												weightsInput.current?.files &&
												weightsInput.current.files.length > 0 &&
												weightsInput.current.files[0] !== null &&
												weightsInput.current.files[0] !== undefined
											) {
												uploadModel(
													topologyInput.current.files[0],
													weightsInput.current.files[0]
												);
											}
										},
									},
									{
										content: <p>Cancel</p>,
										color: `light`,
										handleClick: () => setIsUploadingModel(false),
									},
								]}
							/>
						</footer>
					}
				>
					<section className={`mb-4`}>
						<form className={`flex flex-col gap-1`}>
							<div className={`flex flex-col`}>
								<label htmlFor={`input-file-topology`}>
									<p className={`text-lg`}>Topology</p>
								</label>
								<FileInput
									ref={topologyInput}
									id={`input-file-topology`}
									name={`topology`}
									accept={`application/json`}
								/>
							</div>
							<div className={`flex flex-col`}>
								<label htmlFor={`input-file-weights`}>
									<p className={`text-lg`}>Weights</p>
								</label>
								<FileInput
									ref={weightsInput}
									id={`input-file-weights`}
									name={`weights`}
									accept={`application/octet-stream`}
								/>
							</div>
						</form>
					</section>
				</ModalWithHeader>
			)}
		</article>
	);
}

// function sortModel(
// 	models: ModelInfo[],
// 	selectedModelPath: ModelInfo["path"] | null
// ) {
// 	let sortedModels = [...models];
// 	sortedModels.sort((a, b) => {
// 		if (a.path < b.path) {
// 			return -1;
// 		} else if (a.path > b.path) {
// 			return 1;
// 		} else {
// 			return 0;
// 		}
// 	});
// 	// Place the selected model at the top
// 	if (selectedModelPath) {
// 		const selectedModelIndex = sortedModels.findIndex(
// 			(model) => model.path === selectedModelPath
// 		);
// 		if (selectedModelIndex !== -1) {
// 			const selectedModel = sortedModels.splice(selectedModelIndex, 1);
// 			sortedModels.unshift(selectedModel[0]);
// 		}
// 	}
// 	return sortedModels;
// }
