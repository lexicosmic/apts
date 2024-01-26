import { TrainingMemory } from "./engine/AlphaZero";
import { GameName, ModelInfo, ModelType } from "./types";

const idxdb = window.indexedDB;

let transaction: IDBTransaction | null = null;

if (!idxdb) {
	console.log("IndexedDB could not be found in this browser.");
}

enum Store {
	Models = "models",
	Memory = "memory",
}

// openRequest.onsuccess = function (event) {
// const db = openRequest.result;
// const transaction = db.transaction("models", "readwrite");
// const store = transaction.objectStore("models");
// const gameIndex = store.index("game");
// store.put({ game: "TicTacToe", training_type: "blind" });
// // const idQuery = store.get(4);
// const gameQuery = gameIndex.getAll(["TicTacToe"]);
// // idQuery.onsuccess = function () {
// // 	console.log("ID Query: ", idQuery.result);
// // };
// gameQuery.onsuccess = function () {
// 	console.log("Game Query", gameQuery.result);
// };
// transaction.oncomplete = function () {
// 	db.close();
// };
// };

function connect(functionToRun: (db: IDBDatabase) => void) {
	const openRequest = idxdb.open("aptsdb", 1);

	openRequest.onerror = function (event) {
		console.log("An error occurred when connecting to IndexedDB");
		console.error(event);
	};

	openRequest.onupgradeneeded = function () {
		const db = openRequest.result;
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
	};

	openRequest.onsuccess = function () {
		const db = openRequest.result;
		functionToRun(db);
	};
}

function addModel(model: ModelInfo) {
	connect(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		store.add(model);
	});
}

// function getModel(game: string, type: string, callback: (model: Model) => void) {
//     connect(function (db) {
//         const transaction = db.transaction(Store.Models, "readonly");
//         const store = transaction.objectStore(Store.Models);
//         const index = store.index("game_type");
//         const request = index.get([game, type]);
//         request.onsuccess = function () {
//             callback(request.result);
//         };
//     });
// }

function updateModel(model: ModelInfo) {
	connect(function (db) {
		const transaction = db.transaction(Store.Models, "readwrite");
		const store = transaction.objectStore(Store.Models);
		store.put(model);
	});
}

function getAllModelsFromGame(
	gameName: GameName,
	callback: (models: ModelInfo[]) => void
) {
	connect(function (db) {
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
	getAllFromGame: getAllModelsFromGame,
};
