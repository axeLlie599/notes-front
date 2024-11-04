import clsx from "clsx";
import { Note, NotesHook } from "../../../hooks/notes.api";
import FilledButton from "../buttons/filled/FilledButton";
import Splash from "../splash/Splash";
import IconButton from "../buttons/icon-button/IconButton";
import Markdown from "react-markdown";
import "./NotesView.css";

interface NotesViewProps {
  notesHook?: NotesHook;
}

export default function Notes({ notesHook }: NotesViewProps) {
  if (!notesHook) {
    return (
      <Splash classes="error">
        <Splash.Title title="Please provide Notes Hook" />
      </Splash>
    );
  }
  if (notesHook.isLoading) {
    return (
      <Splash classes="notes-loading">
        <Splash.Title title="Loading..." />
      </Splash>
    );
  }
  if (notesHook.error) {
    return (
      <Splash classes="error">
        <Splash.Icon icon="public_off" />
        <Splash.Title title="Error" />
        <Splash.Content>
          <span className="error_details">
            <code>{notesHook.error.message}</code>
          </span>
          <p>Possibly, you haven't Internet connection or server won't work</p>
          <p>
            To see more, open <strong>the browser console</strong>
          </p>
        </Splash.Content>
        <FilledButton
          onClick={() => window.location.reload()}
          tooltip="Reload the page, if it doesn't work ;)"
          title="Reload"
        />
      </Splash>
    );
  }
  if (notesHook.notes.length === 0) {
    return (
      <Splash classes="no-notes">
        <Splash.Icon icon="info" iconSet="material-icons-outlined" />
        <Splash.Title title="No notes" />
        <Splash.Content>
          <p>
            Try to add a new note below. Or click "Add note" floating button
          </p>
        </Splash.Content>
        <FilledButton
          onClick={() => notesHook.createNote()}
          tooltip="Create a new note"
          title="New note"
        />
      </Splash>
    );
  }

  return (
    <div className="Notes wide-screen">
      <ul className="list-view">
        {notesHook.notes.map((note: Note) => (
          <li key={note.id} className={clsx("list-item", `note-${note.id}`)}>
            <div className="note">
              <span className="header">
                <section className="title">{note.title}</section>
                <section className="items">
                  <IconButton
                    icon="delete"
                    onClick={() => notesHook.deleteNote(note.id!)}
                  />
                </section>
              </span>
              <span className="content">
                <Markdown>{note.content}</Markdown>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
