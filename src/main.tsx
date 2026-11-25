import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { StoreProvider } from "./store";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider fallback={<div className="center-screen" aria-busy="true" />}>
      <App />
    </StoreProvider>
  </StrictMode>,
);
