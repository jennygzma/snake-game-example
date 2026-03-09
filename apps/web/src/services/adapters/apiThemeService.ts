import {
  saveThemeInputSchema,
  themeResponseSchema,
  themesListResponseSchema,
  activeThemeResponseSchema,
  type SaveThemeInput,
  type ThemeResponse,
  type ThemesListResponse,
  type ActiveThemeResponse
} from "@snake/contracts";
import type { ZodType } from "zod";
import type { ThemeService } from "../themeService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return schema.parse(json);
};

export const apiThemeService: ThemeService = {
  getAllThemes() {
    return request<ThemesListResponse>("/v1/themes", themesListResponseSchema);
  },

  async getThemeById(id: string) {
    try {
      return await request<ThemeResponse>(`/v1/themes/${id}`, themeResponseSchema);
    } catch {
      return null;
    }
  },

  getActiveTheme() {
    return request<ActiveThemeResponse>("/v1/themes/active", activeThemeResponseSchema);
  },

  createTheme(input: SaveThemeInput) {
    const payload = saveThemeInputSchema.parse(input);
    return request<ThemeResponse>("/v1/themes", themeResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async updateTheme(id: string, updates: Partial<SaveThemeInput>) {
    try {
      const payload = saveThemeInputSchema.partial().parse(updates);
      return await request<ThemeResponse>(`/v1/themes/${id}`, themeResponseSchema, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } catch {
      return null;
    }
  },

  async deleteTheme(id: string) {
    try {
      await fetch(`${API_BASE_URL}/v1/themes/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch {
      return false;
    }
  },

  async setActiveTheme(id: string) {
    try {
      return await request<ThemeResponse>(
        `/v1/themes/${id}/activate`,
        themeResponseSchema,
        { method: "POST" }
      );
    } catch {
      return null;
    }
  }
};