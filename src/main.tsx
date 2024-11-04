import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Application from "./app/Application";
import "./app/styles/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Application />
  </StrictMode>
);
