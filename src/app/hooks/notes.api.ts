import { useState, useEffect, useCallback, useRef } from "react";
import { useSnackbar } from "notistack";
import axios, { AxiosError, CancelTokenSource } from "axios";

export interface Note {
  id?: number | null;
  name?: string | null;
  title: string;
  content: string;
}

export interface APIError {
  detail?: string;
  codename?: string;
  code?: number;
  title?: string;
  message: string;
}

export type NotesHook = {
  notes: Note[];
  loading: boolean;
  error: APIError | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const heartbeatRef = useRef<number | null>(null);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const handleError = useCallback(
    (err: unknown, prefixMessage?: string) => {
      let apiError: APIError | null = null;
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        apiError = (error.response?.data as APIError) || {
          message: error.message,
        };
        if (error.response) {
          apiError.code = error.response.status;
        }
      } else if (err instanceof Error) {
        apiError = { message: err.message };
      } else {
        apiError = { message: "An unknown error occurred." };
      }
      setError(apiError);
      enqueueSnackbar(
        `${prefixMessage ? prefixMessage + " " : ""}${apiError?.message || "Unknown error"}`,
        {
          variant: "error",
        }
      );
    },
    [enqueueSnackbar]
  );

  const fetchNotes = useCallback(async () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Previous request cancelled.");
    }

    cancelTokenSourceRef.current = axios.CancelToken.source();

    try {
      setLoading(true);
      const response = await axios.get<Note[]>(`${apiUrl}/notes`, {
        cancelToken: cancelTokenSourceRef.current.token,
      });
      setNotes(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        handleError(err, "Error fetching notes:");
        setLoading(false);
      }
    }
  }, [apiUrl, handleError]);

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
        const response = await axios.post<Note>(`${apiUrl}/notes/new`, {
          title,
          content,
        });
        handleSuccessfulOperation("Note created successfully");
        return response.data;
      } catch (err) {
        handleError(err, "Error creating note:");
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation]
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
      } catch (err) {
        handleError(err, "Error updating note:");
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
        handleError(err, "Error deleting note:");
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
      handleError(err, "Error clearing notes:");
      throw err;
    }
  }, [apiUrl, handleError, handleSuccessfulOperation]);

  const count = useCallback(async () => {
    try {
      const response = await axios.get<number>(`${apiUrl}/notes/count`);
      return response.data;
    } catch (err) {
      handleError(err, "Error getting note count:");
      throw err;
    }
  }, [apiUrl, handleError]);

  const refetch = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    void fetchNotes(); // Initial fetch

    heartbeatRef.current = setInterval(() => {
      void fetchNotes();
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatRef.current!);
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel();
      }
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
