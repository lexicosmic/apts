import { ModelInfo } from "../types";
import { capitalizeFirstLetter } from "../util";
import Button from "./Button";

interface ModelContainerProps {
	model: ModelInfo;
	setSelectedModel: (model: ModelInfo) => void;
	selected?: boolean;
}

export default function ModelContainer({
	model,
	setSelectedModel,
	selected = false,
}: ModelContainerProps) {
	return (
		<section
			className={`text-black border rounded p-2 grid gap-x-2
				${selected ? `bg-orange-100 border-2 border-orange-400` : `bg-neutral-50`}
			`}
		>
			<div className={`flex flex-col sm:flex-row items-baseline gap-1`}>
				<p className={`text-xl font-bold`}>Large name for a complex model</p>
				<span className={`hidden sm:block font-mono`}>{` - `}</span>
				<p className={`font-mono`}>{`${capitalizeFirstLetter(model.type)}`}</p>
			</div>
			<p
				className={`col-start-1 row-start-3 mt-1 text-sm font-mono text-neutral-800`}
			>
				{model.path}
			</p>
			<div
				className={`col-start-2 row-start-1 row-span-3 flex flex-col sm:flex-row justify-center sm:justify-end items-end sm:items-center gap-1`}
			>
				<Button
					color={`light`}
					onClick={() => {
						setSelectedModel(model);
					}}
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
				<Button color={`indigo`} onClick={() => downloadModel(model)}>
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
				<Button color={`red`} onClick={() => deleteModel(model)}>
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

function downloadModel(model: ModelInfo) {
	console.log("Downloading", model);
}

function deleteModel(model: ModelInfo) {
	console.log("Deleting", model);
}
