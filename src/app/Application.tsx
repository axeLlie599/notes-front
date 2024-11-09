import "./Application.css";

import useTheme from "./hooks/theme.app";
import IconButton from "./components/widgets/buttons/icon-button/IconButton";
//import useNotes from "./hooks/notes.api";
import Header from "./components/general/header/Header";
import Main from "./components/general/main/Main";
import useNotes from "./hooks/notes.api";
import { useEffect, useRef } from "react";

export default function Application() {
  const themeHook = useTheme({ enabled: true });
  const notesHook = useNotes("https://notes-api-qvr8.onrender.com");

  const notesScrollRef = useRef(false);

  useEffect(() => {
    const notesUl = document.querySelector(".Notes ul");
    const header = document.querySelector(".Header");

    const handleScroll = () => {
      const isScrolled = notesUl!.scrollTop > 0;
      if (isScrolled !== notesScrollRef.current) {
        notesScrollRef.current = isScrolled;
        if (isScrolled) {
          header?.classList.add("scroll");
        } else {
          header?.classList.remove("scroll");
        }
      }
    };

    notesUl?.addEventListener("scroll", handleScroll);

    return () => notesUl?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="Application">
      <Header>
        <Header.SectionLeft>
          <span className="headline">{document.title}</span>
        </Header.SectionLeft>
        <Header.SectionRight>
          <IconButton
            icon="clear_all"
            tooltipLabel="Clear notes"
            disabled={
              notesHook.notes.length === 0 ||
              notesHook.isLoading ||
              notesHook.error
                ? true
                : false
            }
            onClick={notesHook.clearNotes}
          />
          <IconButton
            icon={
              themeHook.currentTheme === "dark" ? "light_mode" : "dark_mode"
            }
            onClick={themeHook.toggle}
            tooltipPosition="left"
            classes="theme-switch"
          />
        </Header.SectionRight>
      </Header>
      <Main notesHook={notesHook} />
    </div>
  );
}
