import { useEffect } from "react";

type UseGameLoopArgs = {
  enabled: boolean;
  ticksPerSecond: number;
  onTick: () => void;
};

export const useGameLoop = ({ enabled, ticksPerSecond, onTick }: UseGameLoopArgs) => {
  useEffect(() => {
    if (!enabled) return;

    const intervalMs = Math.max(16, Math.floor(1000 / ticksPerSecond));
    const id = window.setInterval(onTick, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, onTick, ticksPerSecond]);
};
