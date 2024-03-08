import { GameName, ModelInfo, StoredMemory } from "./types";
import { getFullModelPath } from "./util";

const idxdb = self.indexedDB;

if (!idxdb) {
	console.log("IndexedDB could not be found in this browser.");
}

enum Database {
	AptsDB = "aptsdb",
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

function connectToAptsDB(functionToRun: (db: IDBDatabase) => void) {
	function onupgradeneeded(db: IDBDatabase) {
		const modelsStore = db.createObjectStore(Store.Models, {
			keyPath: ["game", "innerPath"],
		});
		modelsStore.createIndex("game", "game", { unique: false });
		modelsStore.createIndex("name", ["game", "name"], {
			unique: false,
		});
		const memoryStore = db.createObjectStore(Store.Memory, {
			keyPath: ["game", "id"],
		});
		memoryStore.createIndex("game", "game", { unique: false });
		memoryStore.createIndex("name", ["game", "name"], {
			unique: false,
		});
	}
	connect(Database.AptsDB, functionToRun, onupgradeneeded, 1);
}

async function addModel(
	model: ModelInfo,
	onComplete: () => void,
	onError: (event: Event) => void
) {
	connectToAptsDB(function (db) {
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

function putModel(
	model: ModelInfo,
	onComplete: (() => Promise<void>) | (() => void),
	onError: (event: Event) => void
) {
	connectToAptsDB(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		transaction.oncomplete = async function () {
			await onComplete();
		};
		transaction.onerror = function (event) {
			console.log("An error occurred when updating model in IndexedDB");
			console.error(event);
			onError(event);
		};
		store.put(model);
	});
}

function deleteModel(
	model: ModelInfo,
	onComplete: () => void,
	onError: (event: Event) => void
) {
	const path = getFullModelPath(model.game, model.type, model.innerPath);

	function deleteFromAptsModels() {
		connectToAptsDB(function (db) {
			const transaction = db.transaction(Store.Models, "readwrite");
			transaction.onerror = function (event) {
				console.log(
					`An error occurred when deleting model from IndexedDB on ${Database.AptsDB}:${Store.Models}`
				);
				console.error(event);
				onError(event);
			};
			transaction.oncomplete = function () {
				deleteFromTFModelsInfo();
			};
			const store = transaction.objectStore(Store.Models);
			store.delete([model.game, model.innerPath]);
		});
	}

	function deleteFromTFModelsInfo() {
		connect(Database.Tensorflowjs, function (db) {
			const transaction = db.transaction(TFStore.ModelsInfo, "readwrite");
			transaction.onerror = function (event) {
				console.log(
					`An error occurred when deleting model from IndexedDB on ${Database.Tensorflowjs}:${TFStore.ModelsInfo}`
				);
				console.error(event);
				onError(event);
			};
			transaction.oncomplete = function () {
				deleteFromTFModels();
			};
			const store = transaction.objectStore(TFStore.ModelsInfo);
			store.delete(path);
		});
	}

	function deleteFromTFModels() {
		connect(Database.Tensorflowjs, function (db) {
			const transaction = db.transaction(TFStore.Models, "readwrite");
			transaction.onerror = function (event) {
				console.log(
					`An error occurred when deleting model from IndexedDB on ${Database.Tensorflowjs}:${TFStore.Models}`
				);
				console.error(event);
				onError(event);
			};
			transaction.oncomplete = function () {
				onComplete();
			};
			const store = transaction.objectStore(TFStore.Models);
			store.delete(path);
		});
	}

	deleteFromAptsModels();
}

// function getModel(game: string, type: string, callback: (model: Model) => void) {
//     connectToAptsDB(function (db) {
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
	connectToAptsDB(function (db) {
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
	put: putModel,
	delete: deleteModel,
	getAllFromGame: getAllModelsFromGame,
};

function putMemory(
	memory: StoredMemory,
	onComplete: (() => Promise<void>) | (() => void),
	onError: (event: Event) => void
) {
	connectToAptsDB(function (db) {
		const transaction = db.transaction(Store.Memory, "readwrite");
		const store = transaction.objectStore(Store.Memory);
		transaction.oncomplete = async function () {
			await onComplete();
		};
		transaction.onerror = function (event) {
			console.log("An error occurred when updating memory in IndexedDB");
			console.error(event);
			onError(event);
		};
		store.put(memory);
	});
}

function deleteMemory(
	memory: StoredMemory,
	onComplete: () => void,
	onError: (event: Event) => void
) {
	connectToAptsDB(function (db) {
		const transaction = db.transaction(Store.Memory, "readwrite");
		const store = transaction.objectStore(Store.Memory);
		transaction.oncomplete = function () {
			onComplete();
		};
		transaction.onerror = function (event) {
			console.log("An error occurred when deleting memory from IndexedDB");
			console.error(event);
			onError(event);
		};
		store.delete([memory.game, memory.id]);
	});
}

function getAllMemoriesFromGame(
	gameName: GameName,
	callback: (memories: StoredMemory[]) => void
) {
	connectToAptsDB(function (db) {
		const transaction = db.transaction(Store.Memory, "readonly");
		const store = transaction.objectStore(Store.Memory);
		const index = store.index("game");
		const request = index.getAll(gameName);
		request.onsuccess = function () {
			callback(request.result);
		};
	});
}

export const DBOperations_Memories = {
	put: putMemory,
	delete: deleteMemory,
	getAllFromGame: getAllMemoriesFromGame,
};
