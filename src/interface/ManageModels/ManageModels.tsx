import Button from "../Button/Button";
import FluidContainer from "../FluidContainer/FluidContainer";
import Header from "../Header/Header";
import styles from "./ManageModels.module.css";

interface ManageModelsProps {
	setShowManageModelsScreen: (showManageModelsScreen: boolean) => void;
}

export default function ManageModels(props: ManageModelsProps) {
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
					<div className={styles.modelContainer}>
						<div className={styles.modelName}>Model 1</div>
						<div className={styles.modelDescription}>Description 1</div>
					</div>
					<div className={styles.modelContainer}>
						<div className={styles.modelName}>Model 2</div>
						<div className={styles.modelDescription}>Description 2</div>
					</div>
					<div className={styles.modelContainer}>
						<div className={styles.modelName}>Model 3</div>
						<div className={styles.modelDescription}>Description 3</div>
					</div>
				</article>
			</FluidContainer>
		</aside>
	);
}
