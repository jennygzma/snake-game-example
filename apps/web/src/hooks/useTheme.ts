import { useCallback, useEffect, useState } from "react";
import type { CreateThemeInput, CustomTheme, UpdateThemeInput } from "@snake/contracts";
import type { ThemeService } from "../services/themeService";

export const useTheme = (service: ThemeService) => {
  const [themes, setThemes] = useState<CustomTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThemes = useCallback(async () => {
    try {
      const response = await service.getThemes();
      setThemes(response.themes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load themes");
    }
  }, [service]);

  const loadActiveTheme = useCallback(async () => {
    try {
      const response = await service.getActiveTheme();
      setActiveTheme(response.theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load active theme");
    }
  }, [service]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadThemes(), loadActiveTheme()]);
      setLoading(false);
    };

    initialize();
  }, [loadThemes, loadActiveTheme]);

  const createTheme = useCallback(
    async (input: CreateThemeInput) => {
      try {
        setError(null);
        const newTheme = await service.createTheme(input);
        await loadThemes();
        return newTheme;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create theme";
        setError(message);
        throw new Error(message);
      }
    },
    [service, loadThemes]
  );

  const updateTheme = useCallback(
    async (id: string, input: UpdateThemeInput) => {
      try {
        setError(null);
        const updated = await service.updateTheme(id, input);
        await loadThemes();
        if (activeTheme?.id === id) {
          setActiveTheme(updated);
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update theme";
        setError(message);
        throw new Error(message);
      }
    },
    [service, loadThemes, activeTheme]
  );

  const deleteTheme = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await service.deleteTheme(id);
        await loadThemes();
        if (activeTheme?.id === id) {
          setActiveTheme(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete theme";
        setError(message);
        throw new Error(message);
      }
    },
    [service, loadThemes, activeTheme]
  );

  const activateTheme = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const activated = await service.activateTheme(id);
        setActiveTheme(activated);
        await loadThemes();
        return activated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to activate theme";
        setError(message);
        throw new Error(message);
      }
    },
    [service, loadThemes]
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
    refreshThemes: loadThemes,
    refreshActiveTheme: loadActiveTheme
  };
};