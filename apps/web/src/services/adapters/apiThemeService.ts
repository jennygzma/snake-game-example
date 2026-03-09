import {
  ActiveThemeResponseSchema,
  CustomThemeSchema,
  SaveThemeInputSchema,
  ThemeListResponseSchema,
  ThemeResponseSchema,
  type CustomTheme,
  type SaveThemeInput
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
  async listThemes() {
    const response = await request(`/v1/themes`, ThemeListResponseSchema);
    return response.themes;
  },

  async getTheme(id: string) {
    try {
      const response = await request(`/v1/themes/${id}`, ThemeResponseSchema);
      return response.theme;
    } catch (error) {
      // 404 returns null
      return null;
    }
  },

  async getActiveTheme() {
    const response = await request(`/v1/themes/active`, ActiveThemeResponseSchema);
    return response.theme;
  },

  async createTheme(input: SaveThemeInput) {
    const payload = SaveThemeInputSchema.parse(input);
    const response = await request(`/v1/themes`, ThemeResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response.theme;
  },

  async updateTheme(id: string, input: Partial<SaveThemeInput>) {
    const payload = SaveThemeInputSchema.partial().parse(input);
    try {
      const response = await request(`/v1/themes/${id}`, ThemeResponseSchema, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      return response.theme;
    } catch (error) {
      // 404 returns null
      return null;
    }
  },

  async deleteTheme(id: string) {
    try {
      await fetch(`${API_BASE_URL}/v1/themes/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async activateTheme(id: string) {
    try {
      const response = await request(`/v1/themes/${id}/activate`, ThemeResponseSchema, {
        method: "POST"
      });
      return response.theme;
    } catch (error) {
      // 404 returns null
      return null;
    }
  }
};