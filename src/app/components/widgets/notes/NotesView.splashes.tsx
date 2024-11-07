import { NotesHook } from "../../../hooks/notes.api";
import FilledButton from "../buttons/filled/FilledButton";
import Splash from "../splash/Splash";

export default function NotesViewSplashes({
  type,
  notesHook,
}: {
  type: "no-notes" | "error";
  notesHook: NotesHook;
}) {
  return (
    <Splash classes={type}>
      {type === "no-notes" ? (
        <>
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
        </>
      ) : (
        <>
          <Splash.Title title="Error" />
          <Splash.Content>
            <span className="error_details">
              <code>{notesHook.error?.message}</code>
            </span>
            <p>
              Possibly, you haven't Internet connection or the server is down.
              <br />
              For more details, check <strong>the browser console</strong>.
            </p>
          </Splash.Content>
          <FilledButton
            onClick={() =>
              notesHook.error?.message !== "Network Error"
                ? window.location.reload()
                : notesHook.refetch()
            }
            title={
              notesHook.error?.message === "Network Error"
                ? "Reconnect"
                : "Reload"
            }
          />
        </>
      )}
    </Splash>
  );
}
