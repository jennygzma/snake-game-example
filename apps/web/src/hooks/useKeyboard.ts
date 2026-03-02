import { useEffect } from "react";
import type { Direction } from "../types/game";

type UseKeyboardArgs = {
  onDirection: (direction: Direction) => void;
  onTogglePause: () => void;
  onStart: () => void;
  onReset: () => void;
};

export const useKeyboard = ({ onDirection, onTogglePause, onStart, onReset }: UseKeyboardArgs) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "arrowup" || key === "w") onDirection("up");
      if (key === "arrowdown" || key === "s") onDirection("down");
      if (key === "arrowleft" || key === "a") onDirection("left");
      if (key === "arrowright" || key === "d") onDirection("right");

      if (key === "p" || key === " ") onTogglePause();
      if (key === "enter") onStart();
      if (key === "r") onReset();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDirection, onStart, onReset, onTogglePause]);
};
