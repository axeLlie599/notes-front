import { useState, useEffect, useCallback } from "react";

export default function useNotesScroll(target: string = ".Notes ul") {
  const [isNotesScrolled, setIsNotesScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const notesUl = document.querySelector(target);
    if (notesUl) {
      setIsNotesScrolled(notesUl.scrollTop > 0);
    }
  }, [target]);

  useEffect(() => {
    const notesUl = document.querySelector(target);

    if (notesUl) {
      notesUl.addEventListener("scroll", handleScroll);
      return () => notesUl.removeEventListener("scroll", handleScroll);
    }

    return () => {}; // Correct cleanup even if no initial element
  }, [target, handleScroll]); // Include target AND handleScroll

  return isNotesScrolled;
}
