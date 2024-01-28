import { LayersModel } from "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import { ModelInfo } from "../types";
import { formatGameName } from "../util";
import { DBOperations_Models } from "../database";
import Game from "../engine/Game";
import Button from "./Button";
import ModelContainer from "./ModelContainer";
import Modal from "./Modal";
import Icon from "./Icon";
import ButtonGroup from "./ButtonGroup";

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

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		console.log(event);
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
									<Icon name={`arrow-left-short`} />
									Return
								</p>
							),
							color: `light`,
							handleClick: handleReturn,
						},
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
					]}
					className={``}
				/>
			</footer>
			{isUploadingModel && (
				<Modal
					id={`uploading-file`}
					close={() => setIsUploadingModel(false)}
				></Modal>
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
