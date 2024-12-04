import "./styles/NotesView.css";
import NoteItem from "./Note";
import EditNoteDialog from "./EditNoteDialog";
import NotesViewSplashes from "./NotesView.splashes";
import useEditNotes from "./edit.notes";
import { NotesHook, Note } from "../../../hooks/api/notes.api";
import useConnection from "../../../hooks/connection.app";

export default function Notes(props: { notesHook: NotesHook }) {
  useConnection();
  const editNote = useEditNotes(props.notesHook);
  const hooks = { notesHook: props.notesHook, editHook: editNote };

  const render = () => {
    const isError = props.notesHook.error;
    const isIdleAndEmpty =
      props.notesHook.notes.length === 0 && !props.notesHook.isLoading;

    if (isError)
      return <NotesViewSplashes type="error" notesHook={props.notesHook} />;
    else if (isIdleAndEmpty)
      return <NotesViewSplashes type="no-notes" notesHook={props.notesHook} />;
    else
      return (
        <ul>
          {props.notesHook.notes.map((note: Note) => (
            <NoteItem key={note.id} note={note} hooks={hooks} />
          ))}
        </ul>
      );
  };

  return (
    <div className="Notes">
      {props.notesHook.isLoading ? (
        <span className="notes-loading">Loading</span>
      ) : null}
      <EditNoteDialog hooks={hooks} />
      {render()}
    </div>
  );
}
