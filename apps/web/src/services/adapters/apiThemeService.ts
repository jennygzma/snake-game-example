import {
  saveThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  activeThemeResponseSchema,
  type SaveThemeInput,
  type ThemesListResponse,
  type ThemeResponse,
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
  listThemes() {
    return request<ThemesListResponse>("/v1/themes", themesListResponseSchema);
  },

  async getTheme(themeId: string) {
    try {
      return await request<ThemeResponse>(`/v1/themes/${themeId}`, themeResponseSchema);
    } catch (error) {
      // Return null for 404 not found
      return null;
    }
  },

  getActiveTheme() {
    return request<ActiveThemeResponse>("/v1/themes/active/current", activeThemeResponseSchema);
  },

  createTheme(input: SaveThemeInput) {
    const payload = saveThemeInputSchema.parse(input);
    return request<ThemeResponse>("/v1/themes", themeResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async updateTheme(themeId: string, input: SaveThemeInput) {
    const payload = saveThemeInputSchema.parse(input);
    try {
      return await request<ThemeResponse>(`/v1/themes/${themeId}`, themeResponseSchema, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } catch (error) {
      // Return null for 404 not found
      return null;
    }
  },

  async deleteTheme(themeId: string) {
    try {
      await fetch(`${API_BASE_URL}/v1/themes/${themeId}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async activateTheme(themeId: string) {
    try {
      return await request<ThemeResponse>(
        `/v1/themes/${themeId}/activate`,
        themeResponseSchema,
        {
          method: "POST"
        }
      );
    } catch (error) {
      // Return null for 404 not found
      return null;
    }
  }
};