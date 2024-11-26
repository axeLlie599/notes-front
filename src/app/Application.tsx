import Main from "../assets/components/general/main/Main";
import useNotes from "../app/hooks/api/notes.api";
import AppHeader from "./Application.header";
import useTheme from "./hooks/theme.app";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "../assets/styles/main.css";

export default function Application() {
  const notesHook = useNotes("https://notes-api-qvr8.onrender.com");
  const themeHook = useTheme();

  return (
    <div className="flex column wide centered" id="Application">
      <AppHeader hooks={{ notesHook, themeHook: themeHook }} />
      <Main notesHook={notesHook} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Application />
  </StrictMode>
);
