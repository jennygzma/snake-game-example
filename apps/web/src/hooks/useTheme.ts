import { useCallback, useEffect, useState } from "react";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import type { ThemeService } from "../services/themeService";

type UseThemeResult = {
  themes: CustomTheme[];
  activeTheme: CustomTheme | null;
  loading: boolean;
  error: string | null;
  createTheme: (input: SaveThemeInput) => Promise<void>;
  updateTheme: (id: string, input: Partial<SaveThemeInput>) => Promise<void>;
  deleteTheme: (id: string) => Promise<void>;
  activateTheme: (id: string) => Promise<void>;
  refreshThemes: () => Promise<void>;
};

export const useTheme = (service: ThemeService): UseThemeResult => {
  const [themes, setThemes] = useState<CustomTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [themeList, active] = await Promise.all([
        service.listThemes(),
        service.getActiveTheme()
      ]);
      setThemes(themeList);
      setActiveTheme(active);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load themes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refreshThemes();
  }, [refreshThemes]);

  const createTheme = useCallback(
    async (input: SaveThemeInput) => {
      try {
        setError(null);
        await service.createTheme(input);
        await refreshThemes();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create theme";
        setError(message);
        throw err;
      }
    },
    [service, refreshThemes]
  );

  const updateTheme = useCallback(
    async (id: string, input: Partial<SaveThemeInput>) => {
      try {
        setError(null);
        await service.updateTheme(id, input);
        await refreshThemes();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update theme";
        setError(message);
        throw err;
      }
    },
    [service, refreshThemes]
  );

  const deleteTheme = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const success = await service.deleteTheme(id);
        if (!success) {
          throw new Error("Cannot delete active theme or theme not found");
        }
        await refreshThemes();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete theme";
        setError(message);
        throw err;
      }
    },
    [service, refreshThemes]
  );

  const activateTheme = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const theme = await service.activateTheme(id);
        if (!theme) {
          throw new Error("Theme not found");
        }
        setActiveTheme(theme);
        await refreshThemes();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to activate theme";
        setError(message);
        throw err;
      }
    },
    [service, refreshThemes]
  );

  return {
    themes,
    activeTheme,
    loading,
    error,
    createTheme,
    updateTheme,
    deleteTheme,
    activateTheme,
    refreshThemes
  };
};