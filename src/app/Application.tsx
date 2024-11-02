import "./styles/main.css";
import "./Application.css";
import "./styles/material-icons/material-icons.css";

import useTheme from "./hooks/theme.app";
import IconButton from "./components/widgets/buttons/icon-button/IconButton";
import useNotes from "./hooks/notes.api";
import Header from "./components/general/header/Header";

export default function Application() {
  const themeHook = useTheme({ enabled: true });
  const notesHook = useNotes("https://notes-api-qvr8.onrender.com");

  return (
    <div className="Application">
      <Header>
        <Header.SectionLeft>
          <span className="headline">Notes</span>
        </Header.SectionLeft>
        <Header.SectionRight>
          <span className="material-icons-outlined">clear_all</span>
          <span className="material-icons-outlined" onClick={themeHook.toggle}>
            {themeHook.currentTheme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </Header.SectionRight>
      </Header>
      {/*<Main hook={notesHook} /> 
      <FAB
        icon="add"
        pos={FAB.Position.RightBottom}
        label="Add note"
        onClick={() => notesHook.createNote()}
        disabled={notesHook.error ? true : false}
      />*/}
      Hello World
    </div>
  );
}
