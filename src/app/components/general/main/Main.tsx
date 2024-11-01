import { NotesHook } from "../../../hooks/notes.api";
import Notes from "../../widgets/notes/NotesView";
import "./Main.css";

export default function Main({ hook }: { hook: NotesHook }) {
  return (
    <div className="Main flex-column wide-screen">
      <Notes notesHook={hook} />
    </div>
  );
}
