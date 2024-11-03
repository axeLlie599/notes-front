import "./Application.css";

import useTheme from "./hooks/theme.app";
import IconButton from "./components/widgets/buttons/icon-button/IconButton";
//import useNotes from "./hooks/notes.api";
import Header from "./components/general/header/Header";
import Main from "./components/general/main/Main";

export default function Application() {
  const themeHook = useTheme({ enabled: true });
  //const notesHook = useNotes("https://notes-api-qvr8.onrender.com");

  return (
    <div className="Application">
      <Header>
        <Header.SectionLeft>
          <span className="headline">Notes</span>
        </Header.SectionLeft>
        <Header.SectionRight>
          <IconButton icon="clear_all" />
          <IconButton
            icon={
              themeHook.currentTheme === "dark" ? "light_mode" : "dark_mode"
            }
            onClick={themeHook.toggle}
          />
        </Header.SectionRight>
      </Header>
      <Main />
    </div>
  );
}
