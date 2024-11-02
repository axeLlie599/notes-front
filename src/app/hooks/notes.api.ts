/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { useSnackbar } from "notistack";

export interface Note {
  id?: number | null;
  name?: string | null;
  title: string;
  content: string;
}

export type NotesHook = {
  notes: Note[];
  loading: boolean;
  error: unknown;
  createNote: (title?: string, content?: string) => Promise<Note>;
  updateNote: (updatedNote: Note) => Promise<Note>;
  deleteNote: (noteId: number) => Promise<void>;
  clearNotes: () => Promise<void>;
  count: () => Promise<number>;
};

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

function useNotes(apiUrl: string): NotesHook {
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const heartbeatRef = useRef<number | null>(null);

  const fetchNotes = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(`${apiUrl}/notes`, { signal });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `${response.status} ${response.statusText}: ${JSON.stringify(errorData)}`
          );
        }
        const data = await response.json();
        setNotes(data);
        setLoading(false);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
          enqueueSnackbar(`Error fetching notes: ${err.message}`, {
            variant: "error",
          });
          setLoading(false);
        }
      }
    },
    [apiUrl, enqueueSnackbar]
  );

  const handleSuccessfulOperation = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
      void fetchNotes();
    },
    [enqueueSnackbar, fetchNotes]
  );

  const createNote = useCallback(
    async (title = "none", content = "none") => {
      try {
        const response = await fetch(`${apiUrl}/notes/new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const newNote = await response.json();
        handleSuccessfulOperation("Note created successfully");
        return newNote;
      } catch (err: any) {
        setError(err);
        enqueueSnackbar(`Error creating note: ${err.message}`, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, enqueueSnackbar, handleSuccessfulOperation]
  );

  const updateNote = useCallback(
    async (updatedNote: Note) => {
      try {
        const response = await fetch(
          `${apiUrl}/notes/${updatedNote.id}/update`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNote),
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const updated = await response.json();
        handleSuccessfulOperation("Note updated successfully");
        return updated;
      } catch (err: any) {
        setError(err);
        enqueueSnackbar(`Error updating note: ${err.message}`, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, enqueueSnackbar, handleSuccessfulOperation]
  );

  const deleteNote = useCallback(
    async (noteId: number) => {
      try {
        const response = await fetch(`${apiUrl}/notes/${noteId}/delete`, {
          method: "DELETE",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        handleSuccessfulOperation("Note deleted successfully");
      } catch (err: any) {
        setError(err);
        enqueueSnackbar(`Error deleting note: ${err.message}`, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, enqueueSnackbar, handleSuccessfulOperation]
  );

  const clearNotes = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/notes/clear`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      handleSuccessfulOperation("Notes cleared successfully");
    } catch (err: any) {
      setError(err);
      enqueueSnackbar(`Error clearing notes: ${err.message}`, {
        variant: "error",
      });
      throw err;
    }
  }, [apiUrl, enqueueSnackbar, handleSuccessfulOperation]);

  const count = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/notes/count`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err: any) {
      setError(err);
      enqueueSnackbar(`Error fetching count: ${err.message}`, {
        variant: "error",
      });
      throw err;
    }
  }, [apiUrl, enqueueSnackbar]);

  useEffect(() => {
    const abortController = new AbortController();
    void fetchNotes(abortController.signal); // Initial fetch

    heartbeatRef.current = window.setInterval(() => {
      void fetchNotes(abortController.signal);
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatRef.current!);
      abortController.abort();
    };
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    clearNotes,
    count,
  };
}

export default useNotes;
