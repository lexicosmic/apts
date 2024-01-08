import styles from "./ManageModels.module.css";
import { useEffect, useState } from "react";
import { ModelInfo } from "../../types";
import { CRUDModels } from "../../database";
import Game from "../../engine/Game";
import FluidContainer from "../FluidContainer/FluidContainer";
import Header from "../Header";
import ModelContainer from "../ModelContainer.tsx/ModelContainer";

interface ManageModelsProps {
	game: Game;
	selectedModel: ModelInfo | null;
	setShowManageModelsScreen: (showManageModelsScreen: boolean) => void;
}

export default function ManageModels(props: ManageModelsProps) {
	const [models, setModels] = useState<ModelInfo[]>([]);

	useEffect(() => {
		const callback = (models: ModelInfo[]) => {
			setModels(models);
		};
		CRUDModels.getAllFromGame(props.game.getName(), callback);
	}, []);

	const modelInfos = models.map((model) => (
		<ModelContainer modelInfo={model} />
	));
	return (
		<article className={styles.manageModels}>
			<Header className={styles.header} orientation="horizontal">
				<h1 className={`header-text-1`} key={`manage-models-header-title`}>
					Manage Models
				</h1>
				<button
					className={styles.closeButton}
					onClick={() => props.setShowManageModelsScreen(false)}
					key={`manage-models-close-button`}
				>
					&times;
				</button>
			</Header>
			<section className={styles.container}>
				<Header orientation="horizontal" className={styles.selectedModelHeader}>
					<h1 className={`header-text-2`}>Selected model:</h1>
					<p className={`display-text-2`}>None</p>
				</Header>
				<section>{modelInfos}</section>
			</section>
		</article>
	);
}
