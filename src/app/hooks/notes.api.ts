/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useInterval } from "react-use";


export interface Note {
  id?: number | null;
  name?: string | null;
  title: string;
  content: string;
}

export type NotesHook = {
  notes: Note[];
  loading: boolean;
  error: any | null;
  createNote: (title?: string, content?: string) => Promise<Note>;
  updateNote: (updatedNote: Note) => Promise<Note>;
  deleteNote: (noteId: number) => Promise<void>;
  clearNotes: () => Promise<void>;
  count: () => Promise<number>;
};

function useNotes(apiUrl: string, poll = true): NotesHook {
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  const latestNotesRef = useRef<Note[]>([]);
  const sourceRef = useRef<any>();

  const fetchNotes = useCallback(
    async (cancelTokenSource?: any) => {
      if (sourceRef.current) sourceRef.current.cancel();
      if (cancelTokenSource) sourceRef.current = cancelTokenSource;

      try {
        const response = await axios.get<Note[]>(
          `${apiUrl}/notes`,
          cancelTokenSource ? { cancelToken: cancelTokenSource.token } : {}
        );
        const newNotes = response.data;

        if (
          JSON.stringify(newNotes) !== JSON.stringify(latestNotesRef.current)
        ) {
          setLoading(true);
          setNotes(newNotes);
          latestNotesRef.current = newNotes;
          setLoading(false);
        }
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          setError(err);
          enqueueSnackbar("Error fetching notes: " + err?.message, {
            variant: "error",
          });
        }
      } finally {
        if (loading) setLoading(false);
      }
    },
    [apiUrl, enqueueSnackbar, loading]
  );

  const handleSuccessfulOperation = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
      fetchNotes();
    },
    [enqueueSnackbar, fetchNotes]
  );

  const createNote = useCallback(
    async (title = "none", content = "none") => {
      try {
        const response = await axios.post(`${apiUrl}/notes/new`, {
          title,
          content,
        });
        handleSuccessfulOperation("Note created successfully");
        return response.data;
      } catch (err: any) {
        setError(err);
        enqueueSnackbar("Error creating note: " + err?.message, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, handleSuccessfulOperation, enqueueSnackbar]
  );

  const updateNote = useCallback(
    async (updatedNote: Note) => {
      try {
        const response = await axios.put<Note>(
          `${apiUrl}/notes/${updatedNote.id}/update`,
          updatedNote
        );
        handleSuccessfulOperation("Note updated successfully");
        return response.data;
      } catch (err: any) {
        setError(err);
        enqueueSnackbar("Error updating note: " + err?.message, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, handleSuccessfulOperation, enqueueSnackbar]
  );

  const deleteNote = useCallback(
    async (noteId: number) => {
      try {
        await axios.delete(`${apiUrl}/notes/${noteId}/delete`);
        handleSuccessfulOperation("Note deleted successfully");
      } catch (err: any) {
        setError(err);
        enqueueSnackbar("Error deleting note: " + err?.message, {
          variant: "error",
        });
        throw err;
      }
    },
    [apiUrl, handleSuccessfulOperation, enqueueSnackbar]
  );

  const clearNotes = useCallback(async () => {
    try {
      await axios.delete(`${apiUrl}/notes/clear`);
      handleSuccessfulOperation("Notes cleared successfully");
    } catch (err: any) {
      setError(err);
      enqueueSnackbar("Error clearing notes: " + err?.message, {
        variant: "error",
      });
      throw err;
    }
  }, [apiUrl, handleSuccessfulOperation, enqueueSnackbar]);

  const count = useCallback(async () => {
    try {
      const response = await axios.get<number>(`${apiUrl}/notes/count`);
      return response.data;
    } catch (err: any) {
      setError(err);
      enqueueSnackbar("Error fetching count: " + err?.message, {
        variant: "error",
      });
      throw err;
    }
  }, [apiUrl, enqueueSnackbar]);

  const throttledFetchNotes = useCallback(
    throttle(fetchNotes, 500, { leading: true, trailing: false }),
    [fetchNotes]
  );

  useEffect(() => {
    if (poll) {
      fetchNotes();
    }

    return () => {
      if (sourceRef.current) sourceRef.current.cancel();
    };
  }, [apiUrl, enqueueSnackbar, fetchNotes, loading, poll]);

  useInterval(throttledFetchNotes, 30);

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
function throttle(fn: (...args: any[]) => any, ms: number, { leading, trailing }: { leading: boolean, trailing: boolean }): (...args: any[]) => any {
  let lastCalled = 0;
  let timeout = 0;

  function throttled(...args: any[]) {
    const now = performance.now();
    const elapsed = now - lastCalled;

    if (timeout) {
      clearTimeout(timeout);
      timeout = 0;
    }

    if (leading === false && elapsed < ms) {
      timeout = window.setTimeout(() => throttled(...args), ms - elapsed);
    } else {
      lastCalled = now;
      fn(...args);
    }

    if (trailing === false) return;

    if (timeout) return;

    timeout = window.setTimeout(() => {
      timeout = 0;
      lastCalled = performance.now();
    }, ms);
  }

  return throttled;
}

