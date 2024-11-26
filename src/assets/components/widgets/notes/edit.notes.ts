import { useEffect, useState } from "react";
import { Note, NotesHook } from "../../../../app/hooks/api/notes.api";

export type NotesEditHook = {
  setNoteID: (_i: number | null) => void;
  noteID: number | null;
  note: Note | null;
  setNote: (_n: Note | null) => void;
  saveNote: () => void;
};

export default function useEditNotes(notesHook: NotesHook) {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState<Note | null>(null);

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

  const setNote = (_n: Note | null) => setEditedNote(_n);
  const setNoteID = (_i: number | null) => setEditingNoteId(_i);

  return {
    note: editedNote,
    setNote: setNote,
    noteID: editingNoteId,
    setNoteID: setNoteID,
    saveNote: handleSaveNote,
  };
}
