import { ModelInfo } from "../types";
import { capitalizeFirstLetter } from "../util";
import Button from "./Button";

interface ModelContainerProps {
	modelInfo: ModelInfo;
}

export default function ModelContainer({ modelInfo }: ModelContainerProps) {
	return (
		// <section className={styles.container}>
		// 	<div className={styles.data}>
		// 		<p className={`header-text-3`}>Name</p>
		// 		<p className={styles.type}>
		// 			{capitalizeFirstLetter(props.modelInfo.type)}
		// 		</p>
		// 		<p className={styles.path}>{props.modelInfo.path}</p>
		// 	</div>
		// 	<div className={styles.actions}>
		// 		<Button
		// 			className={styles.button}
		// 			handleClick={() => downloadModel(props.modelInfo)}
		// 		>
		// 			<svg
		// 				xmlns="http://www.w3.org/2000/svg"
		// 				width="16"
		// 				height="16"
		// 				fill="currentColor"
		// 				className={`bi bi-file-earmark-arrow-down ${styles.icon}`}
		// 				viewBox="0 0 16 16"
		// 			>
		// 				<path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
		// 				<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
		// 			</svg>
		// 		</Button>
		// 	</div>
		// </section>
		<section className={`grid`}>
			<p className={`col-start-1 row-start-1 text-xl`}>Name</p>
			<p className={`col-start-1 row-start-2`}>
				{capitalizeFirstLetter(modelInfo.type)}
			</p>
			<p className={`col-start-1 row-start-3`}>{modelInfo.path}</p>
			<div
				className={`col-start-2 row-start-1 row-span-3 flex justify-end items-center gap-1`}
			>
				<Button color={`indigo`} onClick={() => downloadModel(modelInfo)}>
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
				<Button color={`red`} onClick={() => deleteModel(modelInfo)}>
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
			</div>
		</section>
	);
}

function downloadModel(modelInfo: ModelInfo) {
	console.log("Downloading", modelInfo);
}

function deleteModel(modelInfo: ModelInfo) {
	console.log("Deleting", modelInfo);
}
