import { useEffect, useState } from "react";
import { ModelInfo } from "../types";
import { formatGameName } from "../util";
import { CRUDModels } from "../database";
import Game from "../engine/Game";
import Button from "./Button";
import ModelContainer from "./ModelContainer";

interface ManageModelsProps {
	game: Game;
	selectedModel: ModelInfo | null;
	handleReturn: () => void;
}

export default function ManageModels({
	game,
	selectedModel,
	handleReturn,
}: ManageModelsProps) {
	const [models, setModels] = useState<ModelInfo[]>([]);

	useEffect(() => {
		const callback = (models: ModelInfo[]) => {
			setModels(models);
		};
		CRUDModels.getAllFromGame(game.getName(), callback);
	}, []);

	const modelContainers = models.map((model) => (
		<ModelContainer modelInfo={model} />
	));
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
				<p className={`text-xl font-bold`} key={`selected-model`}>
					{selectedModel
						? `Selected model: ${selectedModel.path}`
						: `No model selected`}
				</p>
			</header>
			<section className={`col-start-1 col-span-3 mx-2 flex flex-col`}>
				{modelContainers}
			</section>
			<footer className={`col-start-2 col-span-1 flex flex-col`}>
				<Button color={`light`} onClick={handleReturn} key={`quit-button`}>
					<p>Return</p>
				</Button>
			</footer>
		</article>
	);
}
