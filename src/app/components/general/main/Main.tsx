import { NotesHook } from "../../../hooks/notes.api";
import FAB from "../../widgets/buttons/fab/FAB";
import Notes from "../../widgets/notes/NotesView";
import "./Main.css";

export default function Main({ notesHook }: { notesHook?: NotesHook }) {
  return (
    <div className="Main">
      <Notes notesHook={notesHook} />
      <FAB
        icon="add"
        tooltip="Add note"
        tooltipPosition="top"
        disabled={notesHook?.isLoading || notesHook?.error ? true : false}
      />
    </div>
  );
}
