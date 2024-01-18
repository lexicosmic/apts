import * as tf from "@tensorflow/tfjs";
import { State, Action } from "../engine/Game";
import ResNet from "../engine/ResNet";

export function getRandomValidAction(state: State): Action {
	const validActionsEncoded = state.getValidActions();
	const validActions = [];
	for (let i = 0; i < validActionsEncoded.length; i++) {
		if (validActionsEncoded[i]) validActions.push(i);
	}
	return validActions[Math.floor(Math.random() * validActions.length)];
}

// Returns the masked policy and value as Tensors
function getMaskedPrediction(
	state: State,
	resNet: ResNet
): {
	policy: tf.Tensor1D;
	value: tf.Scalar;
} {
	return tf.tidy(() => {
		// Calculate the policy and value from the neural network
		const encodedState = state.getEncodedState();
		const tensorState = tf.tensor(encodedState).expandDims(0) as tf.Tensor4D;
		const [policy, value] = resNet.predict(tensorState);
		const squeezedValue = value.squeeze().squeeze() as tf.Scalar;
		const softMaxPolicy = tf.softmax(policy, 1).squeeze([0]);
		// Mask the policy to only allow valid actions
		const validActions = state.getValidActions();
		const maskedPolicy = softMaxPolicy
			.mul(tf.tensor(validActions).expandDims(0))
			.squeeze() as tf.Tensor1D;
		return {
			policy: maskedPolicy,
			value: squeezedValue,
		};
	});
}

// Returns the action probabilities as a Tensor
function getProbabilities(policy: tf.Tensor1D): tf.Tensor1D {
	return tf.tidy(() => {
		const sum = policy.sum();
		return policy.div(sum);
	});
}

// Returns the action as a common integer
function getActionFromProbabilities(probabilities: tf.Tensor1D): Action {
	return tf.tidy(() => {
		return tf
			.multinomial(probabilities, 1, undefined, true)
			.squeeze()
			.arraySync() as number;
	});
}

type DesiredData = {
	policy: boolean;
	value: boolean;
	probabilities: boolean;
	action: boolean;
};
type ReturnedData = {
	policy?: tf.Tensor1D;
	value?: tf.Scalar;
	probabilities?: tf.Tensor1D;
	action?: Action;
};
export function getPredictionDataFromState(
	state: State,
	resNet: ResNet,
	desiredData: DesiredData
): ReturnedData {
	return tf.tidy(() => {
		const { policy, value } = getMaskedPrediction(state, resNet);
		const probabilities = getProbabilities(policy);
		const action = getActionFromProbabilities(probabilities);
		const data: ReturnedData = {};
		if (desiredData.policy) data.policy = policy;
		if (desiredData.value) data.value = value;
		if (desiredData.probabilities) data.probabilities = probabilities;
		if (desiredData.action) data.action = action;
		return data;
	});
}

export function getActionFromState(state: State, resNet: ResNet): Action {
	const data = getPredictionDataFromState(state, resNet, {
		policy: false,
		value: false,
		probabilities: false,
		action: true,
	});
	return data.action!;
}
