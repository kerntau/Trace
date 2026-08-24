import React from "react";
import ReactDOM from "react-dom/client";
import "@trace/theme/styles.css";
import { App } from "./App";
import staticData from "./data/static-data.json";
import { GlobalContentData } from "@trace/config";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App initialData={staticData as unknown as GlobalContentData} />
    </React.StrictMode>
  );
}
