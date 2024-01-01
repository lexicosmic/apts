// const idxdb =
// 	window.indexedDB ||
// 	window.mozIndexedDB ||
// 	window.webkitIndexedDB ||
// 	window.msIndexedDB ||
// 	window.shimIndexedDB;

// if (!idxdb) {
// 	console.log("IndexedDB could not be found in this browser.");
// }

// const openRequest = idxdb.open("APTSDB", 1);

// openRequest.onerror = function (event) {
// 	console.log("An error occurred when opening IndexedDB");
// 	console.error(event);
// };

// openRequest.onupgradeneeded = function () {
// 	const db = openRequest.result;
// 	const store = db.createObjectStore("models", {
// 		keyPath: "id",
// 		autoIncrement: true,
// 	});
// 	store.createIndex("game", ["game"], { unique: false });
// 	store.createIndex("game_type", ["game", "type"], {
// 		unique: false,
// 	});
// 	store.createIndex("game_type_name", ["game", "type", "name"], {
// 		unique: true,
// 	});
// };

// openRequest.onsuccess = function (event) {
// 	const db = openRequest.result;
// 	const transaction = db.transaction("models", "readwrite");

// 	const store = transaction.objectStore("models");
// 	const gameIndex = store.index("game");

// 	store.put({ game: "TicTacToe", training_type: "blind" });

// 	// const idQuery = store.get(4);
// 	const gameQuery = gameIndex.getAll(["TicTacToe"]);

// 	// idQuery.onsuccess = function () {
// 	// 	console.log("ID Query: ", idQuery.result);
// 	// };

// 	gameQuery.onsuccess = function () {
// 		console.log("Game Query", gameQuery.result);
// 	};

// 	transaction.oncomplete = function () {
// 		db.close();
// 	};
// };
