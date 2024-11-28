import clsx from "clsx";

import IconButton from "../button/icon-button/IconButton";
import Markdown from "react-markdown";
import { NotesEditHook } from "./edit.notes";
import { Note, NotesHook } from "../../../app/hooks/api/notes.api";

export default function NoteItem({
  hooks,
  note,
}: {
  note: Note;
  hooks: {
    notesHook: NotesHook;
    editHook: NotesEditHook;
  };
}) {
  return (
    <li
      key={note.id}
      className={clsx("note", `note-${note.id}`)}
      onClick={() =>
        note.id !== null && note.id !== undefined
          ? hooks.editHook.setNoteID(note.id)
          : null
      }
    >
      {note.title === "none" && note.content === "none" ? (
        <div className="overlay">
          <span>
            <p>No content, click to edit</p>
            <IconButton
              icon="delete"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                hooks.notesHook.deleteNote(note.id!);
              }}
            />
          </span>
        </div>
      ) : (
        <>
          <section className="header">
            <span className="title">{note.title}</span>
            <span className="items" onMouseDown={(e) => e.preventDefault()}>
              <IconButton
                icon="delete"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  hooks.notesHook.deleteNote(note.id!);
                }}
              />
            </span>
          </section>
          <section className="content">
            <Markdown>{note.content}</Markdown>
          </section>
        </>
      )}
    </li>
  );
}
