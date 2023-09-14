import * as tf from '@tensorflow/tfjs-node';

const path = 'file://models/main_model/model.json';
const model = await tf.loadLayersModel(path);

model.summary();
