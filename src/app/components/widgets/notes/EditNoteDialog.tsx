import { Note, NotesHook } from "../../../hooks/api/notes.api";
import FilledButton from "../button/filled/FilledButton";
import IconButton from "../button/icon-button/IconButton";
import DialogComponent from "../dialog/DIalog";
import { NotesEditHook } from "./edit.notes";
import React, { useState, useEffect, useRef } from "react";

export default function EditNoteDialog({
  hooks,
}: {
  hooks: { notesHook: NotesHook; editHook: NotesEditHook };
}) {
  const editNote = hooks.editHook;
  const notesHook = hooks.notesHook;

  const open = !!editNote.noteID;

  const [charCount, setCharCount] = useState(0);
  const [title, setTitle] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [contentEdited, setContentEdited] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string | null>(null);

  useEffect(() => {
    if (editNote.note) {
      setCharCount(
        editNote.note.content === "none" ? 0 : editNote.note.content.length
      );
      setTitle(editNote.note.title !== "none" ? editNote.note.title : "");
      setContentEdited(false);
      setLastSavedContent(editNote.note.content);
    }
  }, [editNote.note]);

  useEffect(() => {
    if (contentEdited) {
      const note = notesHook.notes.find((n) => n.id === editNote.noteID);
      if (note && note.content !== lastSavedContent) {
        editNote.setNote({ ...note, ...editNote.note } as Note);
      }
    }
  }, [contentEdited, editNote, lastSavedContent, notesHook.notes]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editNote.saveNote();
    notesHook.refetch();
    editNote.setNoteID(null);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCharCount(newContent.length);
    editNote.setNote({
      ...editNote.note,
      content: newContent,
    } as Note);
    setContentEdited(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    editNote.setNote({
      ...editNote.note,
      title: e.target.value,
    } as Note);
  };

  function pasteMD(command: string): void {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    let mdText = "";
    let cursorOffset = 0;

    switch (command) {
      case "bold":
        mdText = "****";
        cursorOffset = 2;
        break;
      case "italic":
        mdText = "**";
        cursorOffset = 1;
        break;
      case "underline":
        mdText = "____";
        cursorOffset = 2;
        break;
      default:
        return;
    }

    const start = textArea.selectionStart || 0;
    const end = textArea.selectionEnd || 0;
    const currentText = textArea.value;

    const newText =
      currentText.slice(0, start) + mdText + currentText.slice(end);

    textArea.value = newText;
    textArea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    textArea.focus();
    handleContentChange({
      target: { value: newText },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  }

  return (
    <DialogComponent
      title="Edit Note"
      open={open}
      onClose={() => editNote.setNoteID(null)}
    >
      {editNote.note && (
        <form onSubmit={submit}>
          <section className="title-area">
            <input
              type="text"
              id="title"
              value={title}
              placeholder="Please provide title"
              onChange={handleTitleChange}
            />
          </section>
          <section className="content-area">
            <span className="md-toolbar">
              <IconButton
                icon="format_bold"
                tooltipLabel="Bold"
                onClick={() => pasteMD("bold")}
              />
              <IconButton
                icon="format_italic"
                tooltipLabel="Italic"
                onClick={() => pasteMD("italic")}
              />
              <IconButton
                icon="format_underline"
                tooltipLabel="Underline"
                onClick={() => pasteMD("underline")}
              />
            </span>
            <textarea
              id="content"
              ref={textAreaRef}
              value={
                editNote.note.content !== "none" ? editNote.note.content : ""
              }
              placeholder={"Enter your note"}
              onChange={handleContentChange}
            />
            <span className="char-count">{charCount}</span>
          </section>
          <FilledButton type="submit" title="Save" disabled={!title.trim()} />
        </form>
      )}
    </DialogComponent>
  );
}
