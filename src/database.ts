import { TrainingMemory } from "./engine/AlphaZero";
import { GameName, ModelInfo, ModelType } from "./types";

const idxdb = window.indexedDB;

if (!idxdb) {
	console.log("IndexedDB could not be found in this browser.");
}

enum Database {
	Aptsdb = "aptsdb",
	Tensorflowjs = "tensorflowjs",
}

enum TFStore {
	Models = "models_store",
	ModelsInfo = "model_info_store",
}

enum Store {
	Models = "models",
	Memory = "memory",
}

function connect(
	databaseName: string,
	functionToRun: (db: IDBDatabase) => void,
	onupgradeneeded?: (db: IDBDatabase) => void,
	version: number = 1
) {
	const openRequest = idxdb.open(databaseName, version);

	openRequest.onerror = function (event) {
		console.log("An error occurred when connecting to IndexedDB");
		console.error(event);
	};

	if (onupgradeneeded)
		openRequest.onupgradeneeded = function () {
			const db = openRequest.result;
			onupgradeneeded(db);
		};

	openRequest.onsuccess = function () {
		const db = openRequest.result;
		functionToRun(db);
	};
}

function connectToAptsdb(functionToRun: (db: IDBDatabase) => void) {
	function onupgradeneeded(db: IDBDatabase) {
		const modelsStore = db.createObjectStore(Store.Models, {
			keyPath: "path",
		});
		modelsStore.createIndex("game", "game", { unique: false });
		// store.createIndex("game_type", ["game", "type"], {
		// 	unique: false,
		// });
		// store.createIndex("game_type_path", ["game", "type", "path"], {
		// 	unique: true,
		// });
		const memoryStore = db.createObjectStore(Store.Memory, {
			keyPath: "id",
			autoIncrement: true,
		});
		memoryStore.createIndex("game", "game", { unique: false });
	}
	connect(Database.Aptsdb, functionToRun, onupgradeneeded, 1);
}

function addModel(
	model: ModelInfo,
	onComplete: () => void,
	onError: (event: Event) => void
) {
	connectToAptsdb(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		transaction.oncomplete = function () {
			onComplete();
		};
		transaction.onerror = function (event) {
			console.log("An error occurred when adding model to IndexedDB");
			console.error(event);
			onError(event);
		};
		store.add(model);
	});
}

function updateModel(model: ModelInfo) {
	connectToAptsdb(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		store.put(model);
	});
}

function removeModel(path: string) {
	connectToAptsdb(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		store.delete(path);
	});
	connect(Database.Tensorflowjs, function (db) {
		const transaction = db.transaction(TFStore.ModelsInfo, "readwrite");
		const store = transaction.objectStore(TFStore.ModelsInfo);
		store.delete(path);
	});
	connect(Database.Tensorflowjs, function (db) {
		const transaction = db.transaction(TFStore.Models, "readwrite");
		const store = transaction.objectStore(TFStore.Models);
		store.delete(path);
	});
}

// function getModel(game: string, type: string, callback: (model: Model) => void) {
//     connectToAptsdb(function (db) {
//         const transaction = db.transaction(Store.Models, "readonly");
//         const store = transaction.objectStore(Store.Models);
//         const index = store.index("game_type");
//         const request = index.get([game, type]);
//         request.onsuccess = function () {
//             callback(request.result);
//         };
//     });
// }

function getAllModelsFromGame(
	gameName: GameName,
	callback: (models: ModelInfo[]) => void
) {
	connectToAptsdb(function (db) {
		const transaction = db.transaction(Store.Models, "readonly");
		const store = transaction.objectStore(Store.Models);
		const index = store.index("game");
		const request = index.getAll(gameName);
		request.onsuccess = function () {
			callback(request.result);
		};
	});
}

export const DBOperations_Models = {
	add: addModel,
	update: updateModel,
	remove: removeModel,
	getAllFromGame: getAllModelsFromGame,
};
