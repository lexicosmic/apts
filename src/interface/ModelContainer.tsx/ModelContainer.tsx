import styles from "./ModelContainer.module.css";
import { ModelInfo } from "../../types";
import { capitalizeFirstLetter } from "../../util";
import Button from "../Button";

interface ModelContainerProps {
	modelInfo: ModelInfo;
}

export default function ModelContainer(props: ModelContainerProps) {
	return (
		<section className={styles.container}>
			<div className={styles.data}>
				<p className={`header-text-3`}>Name</p>
				<p className={styles.type}>
					{capitalizeFirstLetter(props.modelInfo.type)}
				</p>
				<p className={styles.path}>{props.modelInfo.path}</p>
			</div>
			<div className={styles.actions}>
				<Button
					className={styles.button}
					handleClick={() => downloadModel(props.modelInfo)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className={`bi bi-file-earmark-arrow-down ${styles.icon}`}
						viewBox="0 0 16 16"
					>
						<path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
						<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
					</svg>
				</Button>
			</div>
		</section>
	);
}

function downloadModel(modelInfo: ModelInfo) {
	console.log(modelInfo);
}
