import { NotesHook } from "../../../../app/hooks/api/notes.api";
import FAB from "../../widgets/button/fab/FAB";
import Notes from "../../widgets/notes/NotesView";
import "./Main.css";

export default function Main({ notesHook }: { notesHook: NotesHook }) {
  return (
    <div className="Main">
      <Notes notesHook={notesHook} />
      <FAB
        icon="add"
        tooltip="Add note"
        tooltipPosition="top"
        disabled={notesHook.isLoading || notesHook.error ? true : false}
        onClick={() => notesHook?.createNote()}
      />
    </div>
  );
}
