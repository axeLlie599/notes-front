import { useState, useEffect, useCallback, useRef } from "react";
import { useSnackbar } from "notistack";
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";

export interface Note {
  id?: number | null;
  name?: string | null;
  title: string;
  content: string;
}

export type NotesHook = {
  notes: Note[];
  loading: boolean;
  error: AxiosError | null;
  createNote: (title?: string, content?: string) => Promise<Note>;
  updateNote: (updatedNote: Note) => Promise<Note>;
  deleteNote: (noteId: number) => Promise<void>;
  clearNotes: () => Promise<void>;
  count: () => Promise<number>;
  refetch: () => Promise<void>;
};

const HEARTBEAT_INTERVAL = 30000;

function useNotes(apiUrl: string): NotesHook {
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading true
  const [error, setError] = useState<AxiosError | null>(null);

  const heartbeatRef = useRef<number | null>(null);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const handleError = useCallback(
    (err: AxiosError) => {
      setError(err);
      enqueueSnackbar(`Error ${err.code}: ${err.message}`, {
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  const fetchNotes = useCallback(async () => {
    if (!loading) setLoading(true); // Set loading if not already loading

    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Previous request cancelled.");
    }
    cancelTokenSourceRef.current = axios.CancelToken.source();

    try {
      const response: AxiosResponse<Note[]> = await axios.get(
        `${apiUrl}/notes`,
        {
          cancelToken: cancelTokenSourceRef.current.token,
        }
      );
      setNotes(response.data);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        handleError(err as AxiosError);
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleError, loading]); // loading dependency

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
        const response: AxiosResponse<Note> = await axios.post(
          `${apiUrl}/notes/new`,
          { title, content }
        );
        handleSuccessfulOperation("Note created successfully");
        return response.data;
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation]
  );

  const updateNote = useCallback(
    async (updatedNote: Note) => {
      try {
        const response: AxiosResponse<Note> = await axios.put(
          `${apiUrl}/notes/${updatedNote.id}/update`,
          updatedNote
        );
        handleSuccessfulOperation("Note updated successfully");
        return response.data;
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation]
  );

  const deleteNote = useCallback(
    async (noteId: number) => {
      try {
        await axios.delete(`${apiUrl}/notes/${noteId}/delete`);
        handleSuccessfulOperation("Note deleted successfully");
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation]
  );

  const clearNotes = useCallback(async () => {
    try {
      await axios.delete(`${apiUrl}/notes/clear`);
      handleSuccessfulOperation("All notes cleared successfully");
    } catch (err) {
      handleError(err as AxiosError);
      throw err;
    }
  }, [apiUrl, handleError, handleSuccessfulOperation]);

  const count = useCallback(async () => {
    try {
      const response: AxiosResponse<number> = await axios.get(
        `${apiUrl}/notes/count`
      );
      return response.data;
    } catch (err) {
      handleError(err as AxiosError);
      throw err;
    }
  }, [apiUrl, handleError]);

  const refetch = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchNotes();
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel();
      }
      setLoading(false); // Set loading false on unmount
    };
  }, [fetchNotes]);

  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      void fetchNotes();
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatRef.current!);
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
    refetch,
  };
}

export default useNotes;
