import { useEffect, useState } from "react";

interface ConnectionHookReturn {
  isOnline: boolean;
}

export default function useConnection(): ConnectionHookReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  return { isOnline };
}
