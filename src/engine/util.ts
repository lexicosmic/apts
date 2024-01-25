import * as tf from "@tensorflow/tfjs";
import { State, Action } from "./Game";
import ResNet from "./ResNet";

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

// Returns the action probabilities from a policy Tensor as another Tensor
function getProbabilitiesFromPolicy(policy: tf.Tensor1D): tf.Tensor1D {
	return tf.tidy(() => {
		const sum = policy.sum();
		return policy.div(sum);
	});
}

// Returns the action as a common integer
export function getActionFromProbabilities(probabilities: tf.Tensor1D): Action {
	return tf.tidy(() => {
		return tf
			.multinomial(probabilities, 1, undefined, true)
			.squeeze()
			.arraySync() as number;
	});
}

type DesiredData =
	| {
			policy: true;
			value?: boolean;
			probabilities?: boolean;
			action?: boolean;
	  }
	| {
			policy?: boolean;
			value: true;
			probabilities?: boolean;
			action?: boolean;
	  }
	| {
			policy?: boolean;
			value?: boolean;
			probabilities: true;
			action?: boolean;
	  }
	| {
			policy?: boolean;
			value?: boolean;
			probabilities?: boolean;
			action: true;
	  };

type ReturnedData = {
	policy?: tf.Tensor1D;
	value?: tf.Scalar;
	probabilities?: tf.Tensor1D;
	action?: Action;
};

function getPredictionDataFromState(
	state: State,
	resNet: ResNet,
	desiredData: DesiredData
) {
	return tf.tidy(() => {
		const data: ReturnedData = {};
		const { policy, value } = getMaskedPrediction(state, resNet);
		if (desiredData.policy) data.policy = policy;
		if (desiredData.value) data.value = value;
		if (desiredData.probabilities || desiredData.action) {
			const probabilities = getProbabilitiesFromPolicy(policy);
			if (desiredData.probabilities) data.probabilities = probabilities;
			if (desiredData.action)
				data.action = getActionFromProbabilities(probabilities);
		}
		return data;
	});
}

export function getPredictionDataFromState_Action(
	state: State,
	resNet: ResNet
): { action: Action } {
	const data = getPredictionDataFromState(state, resNet, {
		policy: false,
		value: false,
		probabilities: false,
		action: true,
	});
	return { action: data.action! };
}

export function getPredictionDataFromState_Value_Probabilities(
	state: State,
	resNet: ResNet
): { value: tf.Scalar; probabilities: tf.Tensor1D } {
	const data = getPredictionDataFromState(state, resNet, {
		policy: false,
		value: true,
		probabilities: true,
		action: false,
	});
	return { value: data.value!, probabilities: data.probabilities! };
}

export function getPredictionDataFromState_Policy_Value_Probabilities_Action(
	state: State,
	resNet: ResNet
): {
	policy: tf.Tensor1D;
	value: tf.Scalar;
	probabilities: tf.Tensor1D;
	action: Action;
} {
	const data = getPredictionDataFromState(state, resNet, {
		policy: true,
		value: true,
		probabilities: true,
		action: true,
	});
	return {
		policy: data.policy!,
		value: data.value!,
		probabilities: data.probabilities!,
		action: data.action!,
	};
}
