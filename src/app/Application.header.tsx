import { NotesHook } from "../app/hooks/api/notes.api";
import Header from "../components/general/header/Header";
import IconButton from "../components/widgets/button/icon-button/IconButton";
import useNotesScroll from "./hooks/header-scroll.app";
import { ThemeHook } from "./hooks/theme.app";

export default function AppHeader({
  hooks: { themeHook, notesHook },
}: {
  hooks: { themeHook: ThemeHook; notesHook: NotesHook };
}) {
  const isScrolled = useNotesScroll();
  return (
    <Header inScroll={isScrolled}>
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
          icon={themeHook.currentTheme === "dark" ? "light_mode" : "dark_mode"}
          onClick={themeHook.toggle}
          tooltipPosition="left"
          classes="theme-switch"
        />
      </Header.SectionRight>
    </Header>
  );
}
