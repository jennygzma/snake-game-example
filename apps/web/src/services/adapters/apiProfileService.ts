import {
  ProfileSchema,
  CreateProfileInputSchema,
  UpdateProfileInputSchema,
  ProfilesListResponseSchema,
  ProfileResponseSchema,
  ActiveProfileResponseSchema,
  type Profile,
  type CreateProfileInput,
  type UpdateProfileInput,
  type ProfilesListResponse,
  type ProfileResponse,
  type ActiveProfileResponse
} from "@snake/contracts";
import type { ZodType } from "zod";
import type { ProfileService } from "../profileService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 5000;

const fetchWithTimeout = async (url: string, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const request = async <T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Not found");
    }
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const json = await response.json();
  return schema.parse(json);
};

export const apiProfileService: ProfileService = {
  listProfiles() {
    return request<ProfilesListResponse>("/v1/profiles", ProfilesListResponseSchema);
  },

  async getProfile(profileId: string) {
    try {
      return await request<ProfileResponse>(`/v1/profiles/${profileId}`, ProfileResponseSchema);
    } catch (error) {
      if (error instanceof Error && error.message === "Not found") {
        return null;
      }
      throw error;
    }
  },

  getActiveProfile() {
    return request<ActiveProfileResponse>("/v1/profiles/active", ActiveProfileResponseSchema);
  },

  createProfile(input: CreateProfileInput) {
    const payload = CreateProfileInputSchema.parse(input);
    return request<ProfileResponse>("/v1/profiles", ProfileResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async updateProfile(profileId: string, input: UpdateProfileInput) {
    const payload = UpdateProfileInputSchema.parse(input);
    try {
      return await request<ProfileResponse>(`/v1/profiles/${profileId}`, ProfileResponseSchema, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Not found") {
        return null;
      }
      throw error;
    }
  },

  async deleteProfile(profileId: string) {
    try {
      await fetchWithTimeout(`${API_BASE_URL}/v1/profiles/${profileId}`, {
        method: "DELETE"
      });
      return true;
    } catch {
      return false;
    }
  },

  async activateProfile(profileId: string) {
    try {
      return await request<ProfileResponse>(
        `/v1/profiles/${profileId}/activate`,
        ProfileResponseSchema,
        {
          method: "POST"
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Not found") {
        return null;
      }
      throw error;
    }
  }
};
