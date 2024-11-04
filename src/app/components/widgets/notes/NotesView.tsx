import clsx from "clsx";
import { Note, NotesHook } from "../../../hooks/notes.api";
import FilledButton from "../buttons/filled/FilledButton";
import Splash from "../splash/Splash";
import IconButton from "../buttons/icon-button/IconButton";
import Markdown from "react-markdown";
import "./NotesView.css";
import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

interface NotesViewProps {
  notesHook?: NotesHook;
}

export default function Notes({ notesHook }: NotesViewProps) {
  const [connected, setConnected] = useState(navigator.onLine);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const updateConnectionStatus = () => {
      const online = navigator.onLine;
      if (online === false) {
        setEditMode(false); // Prevent errors depending of index of note, in case that the note not found
      }
      setConnected(online);
      if (online && notesHook) {
        notesHook.refetch();
      }
    };

    const intervalId = setInterval(() => {
      if (!navigator.onLine && notesHook) {
        notesHook.refetch();
      }
    }, 3000);

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
      clearInterval(intervalId);
    };
  }, [notesHook]);

  if (!notesHook) {
    return (
      <Splash classes="error">
        <Splash.Title title="Please provide Notes Hook" />
      </Splash>
    );
  } else if (notesHook.isLoading && !notesHook.error) {
    return (
      <Splash classes="notes-loading">
        <Splash.Title title="Loading" />
      </Splash>
    );
  } else if (notesHook.error && !connected) {
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
  } else if (notesHook.notes.length === 0) {
    return (
      <Splash classes="no-notes">
        <Splash.Icon icon="info" iconSet="material-icons-outlined" />
        <Splash.Title title="No notes" />
        <Splash.Content>
          <p>
            You don't have any note here <br />
            So, add new one below
          </p>
        </Splash.Content>
        <FilledButton
          onClick={() => notesHook.createNote()}
          tooltip="Create a new note"
          title="New note"
        />
      </Splash>
    );
  } else {
    return (
      <div className="Notes">
        <Dialog
          open={editMode}
          onClose={() => setEditMode(false)}
          className="EditDialog"
        >
          <div className="overlay">
            <DialogPanel className="dialog">
              <section className="header">
                <span className="title">Edit note</span>
                <span className="items">
                  <IconButton icon="close" onClick={() => setEditMode(false)} />
                </span>
              </section>
              <section className="content">
                <Markdown>{"Not implemented yet"}</Markdown>
              </section>
            </DialogPanel>
          </div>
        </Dialog>
        <ul className="list-view">
          {notesHook.notes.map((note: Note) => (
            <li key={note.id} className={clsx("note", `note-${note.id}`)}>
              <section className="header">
                <span className="title" onClick={() => setEditMode(true)}>
                  {note.title}
                </span>
                <span className="items" onMouseDown={(e) => e.preventDefault()}>
                  <IconButton
                    icon="delete"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      notesHook.deleteNote(note.id!);
                    }}
                  />
                </span>
              </section>
              <section className="content" onClick={() => setEditMode(true)}>
                <Markdown>{note.content}</Markdown>
              </section>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
