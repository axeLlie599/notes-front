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
  notesHook: NotesHook;
}

export default function Notes({ notesHook }: NotesViewProps) {
  const [connected, setConnected] = useState(navigator.onLine);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState<Note | null>(null);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setConnected(navigator.onLine);
      if (navigator.onLine) {
        notesHook.refetch();
      }
    };

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, [notesHook]);

  useEffect(() => {
    if (editingNoteId) {
      const note = notesHook.notes.find((n) => n.id === editingNoteId);
      setEditedNote(note ? { ...note } : null);
    } else {
      setEditedNote(null);
    }
  }, [editingNoteId, notesHook.notes]);

  const handleSaveNote = () => {
    if (editedNote) {
      notesHook.updateNote(editedNote);
      setEditingNoteId(null);
    }
  };

  // Splashes and list-view
  const renderContent = () => {
    if (!connected && notesHook.error) {
      return (
        <Splash classes="error">
          <Splash.Icon icon="public_off" />
          <Splash.Title title="Error" />
          <Splash.Content>
            <span className="error_details">
              <code>{notesHook.error.message}</code>
            </span>
            <p>
              Possibly, you haven't Internet connection or the server is down.
            </p>
            <p>
              For more details, check <strong>the browser console</strong>.
            </p>
          </Splash.Content>
          <FilledButton
            onClick={() => window.location.reload()}
            tooltip="Reload the page"
            title="Reload"
          />
        </Splash>
      );

      // -------------------------------------------------------------------------------------------------------
    } else if (notesHook.notes.length === 0) {
      return (
        <Splash classes="no-notes">
          <Splash.Icon icon="info" iconSet="material-icons-outlined" />
          <Splash.Title title="No notes" />
          <Splash.Content>
            <p>
              You don't have any notes yet. <br />
              Create a new one below.
            </p>
          </Splash.Content>
          <FilledButton
            onClick={() => notesHook.createNote()}
            tooltip="Create a new note"
            title="New note"
          />
        </Splash>
      );
      // -------------------------------------------------------------------------------------------------------
    } else {
      return (
        <ul className="list-view">
          {notesHook.notes.map((note) => (
            <li
              key={note.id}
              className={clsx("note", `note-${note.id}`)}
              onClick={() =>
                note.id !== null && note.id !== undefined
                  ? setEditingNoteId(note.id)
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
                        notesHook.deleteNote(note.id!);
                      }}
                    />
                  </span>
                </div>
              ) : (
                <>
                  <section className="header">
                    <span className="title">{note.title}</span>
                    <span
                      className="items"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <IconButton
                        icon="delete"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          notesHook.deleteNote(note.id!);
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
          ))}
        </ul>
      );
    }
  };

  // edit dialog and notes grid --------------------------------------------------------------------------------------
  return (
    <div className="Notes">
      {notesHook.isLoading && <span className="notes-loading">Loading</span>}
      <Dialog
        open={!!editingNoteId}
        onClose={() => setEditingNoteId(null)}
        className="EditDialog"
      >
        <div className="overlay">
          <DialogPanel className="dialog">
            <section className="header">
              <span className="title">Edit note</span>
              <span className="items">
                <IconButton
                  icon="close"
                  onClick={() => setEditingNoteId(null)}
                />
              </span>
            </section>
            {editedNote && (
              <section className="content">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveNote();
                  }}
                >
                  <input
                    type="text"
                    id="title"
                    value={
                      editedNote.title !== "none" ? editedNote.title : undefined
                    }
                    placeholder={
                      editedNote.title === "none" ? "Title" : undefined
                    }
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, title: e.target.value })
                    }
                  />
                  <textarea
                    id="content"
                    value={
                      editedNote.content !== "none"
                        ? editedNote.content
                        : undefined
                    }
                    placeholder={
                      editedNote.content === "none"
                        ? "Enter your note"
                        : undefined
                    }
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, content: e.target.value })
                    }
                  />
                  <FilledButton type="submit" title="Save" />
                </form>
              </section>
            )}
          </DialogPanel>
        </div>
      </Dialog>
      {renderContent()}
    </div>
  );
}
