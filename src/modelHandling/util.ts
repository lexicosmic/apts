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
export function getMaskedPrediction(
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
export function getProbabilities(policy: tf.Tensor1D): tf.Tensor1D {
	return tf.tidy(() => {
		const sum = policy.sum();
		return policy.div(sum);
	});
}

export function getActionFromProbabilities(probabilities: tf.Tensor1D) {
	tf.tidy(() => {
		// const actionTensor = tf.multinomial(probabilities, 1);
		// const actionIndex = actionTensor.dataSync()[0];
		// return actionIndex;
		const [rowsT] = tf.unstack(probabilities.shape);
		const rows = rowsT.arraySync() as number;
		console.log(rows);
		const distribution = tf.randomUniform([rows], 0, 1, "float32");
		distribution.print();
		const result = tf.gather(probabilities, distribution);
		result.print();
	});
}
