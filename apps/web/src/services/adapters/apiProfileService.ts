import {
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema,
  type CreateProfileInput,
  type UpdateProfileInput,
  type ProfilesListResponse,
  type ProfileResponse,
  type ActiveProfileResponse
} from "@snake/contracts";
import type { ProfileService } from "../profileService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const request = async <T>(
  path: string,
  schema: { parse: (data: unknown) => T },
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/v1/profiles${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();
  return schema.parse(data);
};

export const apiProfileService: ProfileService = {
  async listProfiles(): Promise<ProfilesListResponse> {
    return request("", profilesListResponseSchema);
  },

  async getProfile(id: string): Promise<ProfileResponse> {
    return request(`/${id}`, profileResponseSchema);
  },

  async getActiveProfile(): Promise<ActiveProfileResponse> {
    return request("/active", activeProfileResponseSchema);
  },

  async createProfile(input: CreateProfileInput): Promise<ProfileResponse> {
    return request("", profileResponseSchema, {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateProfile(id: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    return request(`/${id}`, profileResponseSchema, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  async deleteProfile(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/v1/profiles/${id}`, {
      method: "DELETE"
    });
  },

  async activateProfile(id: string): Promise<ProfileResponse> {
    return request(`/${id}/activate`, profileResponseSchema, {
      method: "POST"
    });
  }
};