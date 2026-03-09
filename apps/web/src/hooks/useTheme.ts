import { useState, useEffect, useCallback } from "react";
import type { CustomTheme, SaveThemeInput } from "@snake/contracts";
import { apiThemeService } from "../services/adapters/apiThemeService";
import { localThemeService } from "../services/storage/localThemeService";
import { useAppTheme } from "../contexts/ThemeContext";

// Toggle between API and local service
const USE_API = import.meta.env.VITE_USE_API === "true";
const themeService = USE_API ? apiThemeService : localThemeService;

export const useTheme = () => {
  const { setActiveCustomTheme } = useAppTheme();
  const [themes, setThemes] = useState<CustomTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load themes and active theme
  const loadThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [themesResponse, activeResponse] = await Promise.all([
        themeService.listThemes(),
        themeService.getActiveTheme()
      ]);

      setThemes(themesResponse.themes);
      setActiveTheme(activeResponse.theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  // Create a new theme
  const createTheme = useCallback(
    async (input: SaveThemeInput) => {
      try {
        setError(null);
        const response = await themeService.createTheme(input);
        setThemes((prev) => [...prev, response.theme]);
        return response.theme;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create theme";
        setError(message);
        throw new Error(message);
      }
    },
    []
  );

  // Update an existing theme
  const updateTheme = useCallback(
    async (themeId: string, input: SaveThemeInput) => {
      try {
        setError(null);
        const response = await themeService.updateTheme(themeId, input);
        if (!response) {
          throw new Error("Theme not found");
        }

        setThemes((prev) => prev.map((t) => (t.id === themeId ? response.theme : t)));

        // Update active theme if it's the one being updated
        if (activeTheme?.id === themeId) {
          setActiveTheme(response.theme);
        }

        return response.theme;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update theme";
        setError(message);
        throw new Error(message);
      }
    },
    [activeTheme]
  );

  // Delete a theme
  const deleteTheme = useCallback(
    async (themeId: string) => {
      try {
        setError(null);
        const success = await themeService.deleteTheme(themeId);
        if (!success) {
          throw new Error("Theme not found");
        }

        setThemes((prev) => prev.filter((t) => t.id !== themeId));

        // Clear active theme if it was deleted
        if (activeTheme?.id === themeId) {
          setActiveTheme(null);
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete theme";
        setError(message);
        throw new Error(message);
      }
    },
    [activeTheme]
  );

  // Activate a theme
  const activateTheme = useCallback(async (themeId: string) => {
    try {
      setError(null);
      const response = await themeService.activateTheme(themeId);
      if (!response) {
        throw new Error("Theme not found");
      }

      // Update themes list to reflect new active state
      setThemes((prev) =>
        prev.map((t) => ({
          ...t,
          isActive: t.id === themeId
        }))
      );

      setActiveTheme(response.theme);
      
      // Notify context for immediate UI update
      setActiveCustomTheme(response.theme);
      
      return response.theme;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to activate theme";
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    themes,
    activeTheme,
    loading,
    error,
    createTheme,
    updateTheme,
    deleteTheme,
    activateTheme,
    refreshThemes: loadThemes
  };
};