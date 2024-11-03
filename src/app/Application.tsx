import "./styles/main.css";
import "./styles/material-icons/material-icons.css";

import useTheme from "./hooks/theme.app";
import Header from "./components/general/header/Header";
import IconButton from "./components/widgets/buttons/icon-button/IconButton";
import FAB from "./components/widgets/buttons/fab/FAB";
import Main from "./components/general/main/Main";
import useNotes from "./hooks/notes.api";

export default function Application() {
  const ENABLE_THEME_CHANGE = true;
  const themeHook = useTheme({ enabled: ENABLE_THEME_CHANGE });
  const notesHook = useNotes("https://notes-api-qvr8.onrender.com");

  return (
    <div className="Application wide-screen">
      <Header blur fixed>
        <Header.SectionLeft>
          <span id="app_title">{document.title}</span>
        </Header.SectionLeft>
        <Header.SectionRight>
          <IconButton
            icon="clear_all"
            tooltipLabel="Clear all"
            onClick={notesHook.clearNotes}
            disabled={
              notesHook.error || notesHook.notes.length === 0 ? true : false
            }
          />
          <IconButton
            icon={themeHook.isDark ? "light_mode" : "dark_mode"}
            onClick={themeHook.toggle}
            tooltipLabel={`Toggle theme (${themeHook.currentTheme})`}
          />
        </Header.SectionRight>
      </Header>
      <Main hook={notesHook} />
      <FAB
        icon="add"
        pos={FAB.Position.RightBottom}
        label="Add note"
        onClick={() => notesHook.createNote()}
        disabled={notesHook.error ? true : false}
      />
    </div>
  );
}
