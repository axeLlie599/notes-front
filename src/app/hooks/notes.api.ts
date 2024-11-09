import { useState, useCallback, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { TimeUnits } from "../utils";

export interface Note {
  id?: number | null;
  name?: string | null;
  title: string;
  content: string;
}

export type NotesHook = {
  notes: Note[];
  error: AxiosError | null;
  isLoading: boolean;
  createNote: (title?: string, content?: string) => Promise<Note>;
  updateNote: (updatedNote: Note) => Promise<Note>;
  deleteNote: (noteId: number) => Promise<void>;
  clearNotes: () => Promise<void>;
  count: () => Promise<number>;
  refetch: () => Promise<void>;
};

const HEARTBEAT_INTERVAL = TimeUnits.Minute / 2;

function useNotes(
  apiUrl: string,
  heartbeat: { interval?: number; enabled: boolean } = {
    interval: HEARTBEAT_INTERVAL,
    enabled: false,
  }
): NotesHook {
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      if (!axios.isCancel(err)) {
        handleError(err as AxiosError);
        setIsLoading(false);
      }
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
    };
  }, [fetchNotes]);

  const handleSuccessfulOperation = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  const createNote = useCallback(
    async (title = "none", content = "none") => {
      try {
        const response: AxiosResponse<Note> = await axios.post(
          `${apiUrl}/notes/new`,
          { title, content }
        );
        handleSuccessfulOperation("Note created successfully");
        setNotes([...notes, response.data]);
        return response.data;
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation, notes]
  );

  const updateNote = useCallback(
    async (updatedNote: Note) => {
      try {
        const response: AxiosResponse<Note> = await axios.put(
          `${apiUrl}/notes/${updatedNote.id}/update`,
          updatedNote
        );
        handleSuccessfulOperation("Note updated successfully");
        setNotes(
          notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
        return response.data;
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation, notes]
  );

  const deleteNote = useCallback(
    async (noteId: number) => {
      try {
        await axios.delete(`${apiUrl}/notes/${noteId}/delete`);
        handleSuccessfulOperation("Note deleted successfully");
        setNotes(notes.filter((note) => note.id !== noteId));
      } catch (err) {
        handleError(err as AxiosError);
        throw err;
      }
    },
    [apiUrl, handleError, handleSuccessfulOperation, notes]
  );

  const clearNotes = useCallback(async () => {
    try {
      await axios.delete(`${apiUrl}/notes/clear`);
      handleSuccessfulOperation("All notes cleared successfully");
      setNotes([]);
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

  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      void refetch();
    }, heartbeat.interval);

    return () => {
      clearInterval(heartbeatRef.current!);
    };
  }, [heartbeat.interval, refetch]);

  return {
    notes,
    error,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    clearNotes,
    count,
    refetch,
  };
}

export default useNotes;
