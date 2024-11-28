import { Dialog, DialogPanel } from "@headlessui/react";
import FilledButton from "../button/filled/FilledButton";
import IconButton from "../button/icon-button/IconButton";
import { NotesEditHook } from "./edit.notes";
import { NotesHook, Note } from "../../../app/hooks/api/notes.api";

export default function EditNoteDialog({
  hooks,
}: {
  hooks: { notesHook: NotesHook; editHook: NotesEditHook };
}) {
  const editNote = hooks.editHook;
  const notesHook = hooks.notesHook;
  return (
    <Dialog
      open={!!editNote.noteID}
      onClose={() => editNote.setNoteID(null)}
      className="EditNoteDialog"
    >
      <div className="overlay">
        <DialogPanel className="dialog">
          <section className="header">
            <span className="title">Edit note</span>
            <span className="items">
              <IconButton
                icon="close"
                onClick={() => editNote.setNoteID(null)}
              />
            </span>
          </section>
          {editNote.note && (
            <section className="content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editNote.saveNote();
                  notesHook.refetch();
                }}
              >
                <input
                  type="text"
                  id="title"
                  value={
                    editNote.note.title !== "none" ? editNote.note.title : ""
                  }
                  placeholder={editNote.note.title === "none" ? "Title" : ""}
                  onChange={(e) =>
                    editNote.setNote({
                      ...editNote.note,
                      title: e.target.value,
                    } as Note)
                  }
                />
                <textarea
                  id="content"
                  value={
                    editNote.note.content !== "none"
                      ? editNote.note.content
                      : ""
                  }
                  placeholder={
                    editNote.note.content === "none" ? "Enter your note" : ""
                  }
                  onChange={(e) =>
                    editNote.setNote({
                      ...editNote.note,
                      content: e.target.value,
                    } as Note)
                  }
                />
                <FilledButton type="submit" title="Save" />
              </form>
            </section>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
