import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../assets/styles/main.css";
import AppHeader from "./Application.header";
import Main from "./components/general/main/Main";
import useNotes from "./hooks/api/notes.api";
import useTheme from "./hooks/theme.app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Application />
  </StrictMode>
);

export default function Application() {
  const notesHook = useNotes("https://notes-api-qvr8.onrender.com");
  const themeHook = useTheme();

  return (
    <div className="flex column wide" id="Application">
      <AppHeader hooks={{ notesHook, themeHook: themeHook }} />
      <Main notesHook={notesHook} />
    </div>
  );
}
