import fs from 'fs';
import {
	ParamsToExport_BuildModel,
	ParamsToExport_TrainingData,
	ResNetBuildModelParams,
	SelfPlayMemoryParams,
	TrainModelParams,
} from '../types.ts';
import {TrainingMemory} from '../engine/AlphaZero.ts';
import {selfPlayMemoryParams as defaultMemoryParams} from './parameters.ts';

function getParamsToExport_TrainingData(
	trainingDataId: string,
	modelParams: ParamsToExport_BuildModel | null,
	selfPlayMemoryParams: SelfPlayMemoryParams,
) {
	const paramsToExport: ParamsToExport_TrainingData = {
		id: trainingDataId,
		model: modelParams,
		...selfPlayMemoryParams,
	};
	return paramsToExport;
}

function getParamsToExport_BuildModel(
	trainingDataIds: string[],
	resNetBuildModelParams: ResNetBuildModelParams,
	trainModelParams: TrainModelParams,
) {
	const listOfTrainingDataParemeters: (ParamsToExport_TrainingData | {})[] = [];
	let i = 0;
	while (i < trainingDataIds.length && i < trainModelParams.numIterations) {
		const trainingDataId = trainingDataIds[i];
		const trainingDataParameters = loadTrainingDataParameters(trainingDataId);
		listOfTrainingDataParemeters.push(trainingDataParameters ?? {});
		i++;
	}
	while (i < trainModelParams.numIterations) {
		const trainingDataParameters = getParamsToExport_TrainingData(
			'',
			null,
			defaultMemoryParams,
		);
		listOfTrainingDataParemeters.push(trainingDataParameters);
		i++;
	}

	const paramsToExport: ParamsToExport_BuildModel = {
		resNet: resNetBuildModelParams,
		memory: listOfTrainingDataParemeters,
		training: trainModelParams,
	};
	return paramsToExport;
}

export function loadTrainingDataParameters(trainingDataId: string) {
	let trainingDataParameters: ParamsToExport_TrainingData;
	try {
		trainingDataParameters = JSON.parse(
			fs
				.readFileSync(
					`./trainingData/trainingData_${trainingDataId}/parameters.json`,
				)
				.toString(),
		);
		return trainingDataParameters;
	} catch (e) {
		console.error(e);
	}
}

export function loadTrainingData(trainingDataIds: string[]) {
	const trainingMemoryBatch: TrainingMemory[] = [];
	try {
		for (const trainingDataId of trainingDataIds) {
			const trainingData = fs
				.readFileSync(
					`./trainingData/trainingData_${trainingDataId}/trainingData.json`,
				)
				.toString();
			trainingMemoryBatch.push(JSON.parse(trainingData));
		}
		return trainingMemoryBatch;
	} catch (e) {
		console.error(e);
	}
}

export function loadModelParameters(modelDirectory: string) {
	let modelParameters: ParamsToExport_BuildModel;
	try {
		modelParameters = JSON.parse(
			fs.readFileSync(`./models/${modelDirectory}/parameters.json`).toString(),
		);
		return modelParameters;
	} catch (e) {
		console.error(e);
	}
}

export function writeTrainingData(
	trainingMemory: TrainingMemory,
	modelDirectory: string,
	selfPlayMemoryParams: SelfPlayMemoryParams,
) {
	const currentTime = new Date().valueOf();
	const modelParams = loadModelParameters(modelDirectory);

	const paramsToExport: ParamsToExport_TrainingData =
		getParamsToExport_TrainingData(
			currentTime.toString(),
			modelParams ?? null,
			selfPlayMemoryParams,
		);

	try {
		fs.mkdirSync(`./trainingData/trainingData_${currentTime}`);
		fs.writeFileSync(
			`./trainingData/trainingData_${currentTime}/trainingData.json`,
			JSON.stringify(trainingMemory),
		);
		fs.writeFileSync(
			`./trainingData/trainingData_${currentTime}/parameters.json`,
			JSON.stringify(paramsToExport),
		);
	} catch (e) {
		console.error(e);
	}
}

export function writeModelParameters(
	modelDirectory: string,
	trainingDataIds: string[],
	resNetBuildModelParams: ResNetBuildModelParams,
	trainModelParams: TrainModelParams,
) {
	const paramsToExport: ParamsToExport_BuildModel =
		getParamsToExport_BuildModel(
			trainingDataIds,
			resNetBuildModelParams,
			trainModelParams,
		);

	try {
		fs.mkdirSync(`./models/${modelDirectory}`);
		fs.writeFileSync(
			`./models/${modelDirectory}/parameters.json`,
			JSON.stringify(paramsToExport),
		);
	} catch (e) {
		console.error(e);
	}
}
