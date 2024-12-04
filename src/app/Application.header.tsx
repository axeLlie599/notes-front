import { useState } from "react";
import Header from "./components/general/header/Header";
import FilledButton from "./components/widgets/button/filled/FilledButton";
import IconButton from "./components/widgets/button/icon-button/IconButton";
import DialogComponent from "./components/widgets/dialog/DIalog";
import { NotesHook } from "./hooks/api/notes.api";
import useNotesScroll from "./hooks/header-scroll.app";
import { ThemeHook } from "./hooks/theme.app";

export default function AppHeader({
  hooks: { themeHook, notesHook },
}: {
  hooks: { themeHook: ThemeHook; notesHook: NotesHook };
}) {
  const isScrolled = useNotesScroll();
  const [open, setOpen] = useState(false);

  return (
    <>
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
            onClick={() => setOpen(!open)}
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
      <DialogComponent
        title="Delete all notes?"
        open={open}
        onClose={() => setOpen(!open)}
      >
        <p className="monospace">
          Are you sure you want to delete
          <br /> all notes?
        </p>
        <form
          className="buttons"
          onSubmit={(e) => {
            e.preventDefault();
            notesHook.clearNotes();
          }}
        >
          <FilledButton title="Cancel" onClick={() => setOpen(!open)} />
          <FilledButton
            classes="danger"
            title="Delete All"
            onClick={() => {
              setOpen(!open);
              notesHook.clearNotes();
            }}
            autoFocus={true}
          />
        </form>
      </DialogComponent>
    </>
  );
}
