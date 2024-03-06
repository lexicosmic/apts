import { useEffect, useRef, useState } from "react";
import { GameName, ModelInfo } from "../types";
import { importResNetModel } from "./util";
import {
	getFullModelPath,
	formatGameName,
	standardFileProtocol,
} from "../util";
import { DBOperations_Models } from "../database";
import ResNet from "../engine/ResNet";
import ModelContainer from "./ModelContainer";
import { ModalWithHeader } from "./Modal";
import Icon from "./Icon";
import ButtonGroup from "./ButtonGroup";
import FileInput from "./FileInput";

interface ManageModelsProps {
	gameName: GameName;
	selectedModel: ModelInfo | null;
	setSelectedModel: (model: ModelInfo | null) => void;
	handleReturn: () => void;
}

export default function ManageModels({
	gameName,
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
		DBOperations_Models.getAllFromGame(gameName, callback);
	}

	useEffect(() => {
		getModels();
	}, []);

	const selectedModelPath = selectedModel
		? getFullModelPath(gameName, selectedModel.type, selectedModel.innerPath)
		: null;

	const modelInput = useRef<HTMLInputElement>(null);

	function uploadModel(modelFile: File) {
		if (!modelFile || modelFile.type !== `application/json`) {
			alert(`Invalid model file!`);
			return;
		}
		const reader = new FileReader();
		reader.onload = (event) => {
			const onError = () => {
				alert(`Invalid file!`);
			};
			const onSuccess = (modelInfo: ModelInfo, resNet: ResNet) => {
				resNet.save({
					protocol: standardFileProtocol,
					type: modelInfo.type,
					innerPath: modelInfo.innerPath,
					name: modelInfo.name,
					onSuccess: () => {
						getModels();
						setIsUploadingModel(false);
					},
					onError: () => {
						alert(`Error saving model!`);
						setIsUploadingModel(false);
					},
				});
			};
			importResNetModel(
				event.target?.result as string,
				gameName,
				onSuccess,
				onError
			);
		};
		reader.readAsText(modelFile);
	}

	//TODO: Sort models
	let modelContainers: JSX.Element[] = [];
	if (models.length > 0) {
		for (let i = 0; i < models.length; i++) {
			const model = models[i];
			const modelPath = getFullModelPath(gameName, model.type, model.innerPath);
			const isSelected: boolean =
				selectedModel !== null && modelPath === selectedModelPath;
			const modelContainer = (
				<ModelContainer
					modelInfo={model}
					setSelectedModel={setSelectedModel}
					selected={isSelected}
					key={`model-container-${modelPath}`}
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
												modelInput.current?.files &&
												modelInput.current.files.length > 0 &&
												modelInput.current.files[0] !== null &&
												modelInput.current.files[0] !== undefined
											) {
												uploadModel(modelInput.current.files[0]);
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
								<label htmlFor={`input-file-model`}>
									<p className={`text-lg`}>Model</p>
								</label>
								<FileInput
									ref={modelInput}
									id={`input-file-model`}
									name={`model`}
									accept={`application/json`}
								/>
							</div>
							{/* <div className={`flex flex-col`}>
								<label htmlFor={`input-file-weights`}>
									<p className={`text-lg`}>Weights</p>
								</label>
								<FileInput
									ref={weightsInput}
									id={`input-file-weights`}
									name={`weights`}
									accept={`.bin`}
								/>
							</div> */}
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
