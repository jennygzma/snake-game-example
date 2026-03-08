import {
  activeThemeResponseSchema,
  createThemeInputSchema,
  customThemeSchema,
  themeListResponseSchema,
  updateThemeInputSchema,
  type ActiveThemeResponse,
  type CreateThemeInput,
  type CustomTheme,
  type ThemeListResponse,
  type UpdateThemeInput
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
  getThemes() {
    return request<ThemeListResponse>("/v1/themes", themeListResponseSchema);
  },

  getTheme(id: string) {
    return request<CustomTheme>(`/v1/themes/${id}`, customThemeSchema);
  },

  getActiveTheme() {
    return request<ActiveThemeResponse>("/v1/themes/active", activeThemeResponseSchema);
  },

  createTheme(input: CreateThemeInput) {
    const payload = createThemeInputSchema.parse(input);
    return request<CustomTheme>("/v1/themes", customThemeSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  updateTheme(id: string, input: UpdateThemeInput) {
    const payload = updateThemeInputSchema.parse(input);
    return request<CustomTheme>(`/v1/themes/${id}`, customThemeSchema, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  async deleteTheme(id: string) {
    const response = await fetch(`${API_BASE_URL}/v1/themes/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  },

  activateTheme(id: string) {
    return request<CustomTheme>(`/v1/themes/${id}/activate`, customThemeSchema, {
      method: "POST"
    });
  }
};