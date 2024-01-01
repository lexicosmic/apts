import styles from "./ManageModels.module.css";
import { useEffect, useState } from "react";
import { ModelInfo } from "../../types";
import { CRUDModels } from "../../database";
import Game from "../../engine/Game";
import FluidContainer from "../FluidContainer/FluidContainer";
import Header from "../Header/Header";

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

	const modelInfos = models.map((model) => ModelContainer(model));

	return (
		<aside className={styles.manageModels}>
			<FluidContainer
				className={styles.aside}
				headerContent={[
					<h1 className={`header-text-1`} key={`manage-models-header-title`}>
						Manage Models
					</h1>,
					<button
						className={styles.closeButton}
						onClick={() => props.setShowManageModelsScreen(false)}
						key={`manage-models-close-button`}
					>
						&times;
					</button>,
				]}
				headerClassName={styles.header}
			>
				<article className={styles.container}>
					<Header
						orientation="horizontal"
						className={styles.selectedModelHeader}
					>
						<h1 className={`header-text-2`}>Selected model:</h1>
						<p className={`display-text-2`}>None</p>
					</Header>
					<section>{modelInfos}</section>
				</article>
			</FluidContainer>
		</aside>
	);
}

function ModelContainer(model: ModelInfo) {
	return (
		<section className={styles.modelContainer} key={model.path}>
			<p className={styles.modelName}>{model.path}</p>
			<p className={styles.modelDescription}>{model.type}</p>
		</section>
	);
}
