import React from "react";
import ReactDOM from "react-dom/client";
import App from "./interface/pages/App.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import "./database.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
