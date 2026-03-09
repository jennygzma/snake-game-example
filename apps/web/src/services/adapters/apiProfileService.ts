import {
  createProfileInputSchema,
  updateProfileInputSchema,
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema,
  type CreateProfileInput,
  type UpdateProfileInput,
  type ProfilesListResponse,
  type ProfileResponse,
  type ActiveProfileResponse
} from "@snake/contracts";
import type { ZodType } from "zod";
import type { ProfileService } from "../profileService";

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

export const apiProfileService: ProfileService = {
  listProfiles() {
    return request<ProfilesListResponse>("/v1/profiles", profilesListResponseSchema);
  },

  async getProfile(profileId: string) {
    try {
      return await request<ProfileResponse>(`/v1/profiles/${profileId}`, profileResponseSchema);
    } catch (error) {
      // Return null for 404 not found
      return null;
    }
  },

  getActiveProfile() {
    return request<ActiveProfileResponse>("/v1/profiles/active", activeProfileResponseSchema);
  },

  createProfile(input: CreateProfileInput) {
    const payload = createProfileInputSchema.parse(input);
    return request<ProfileResponse>("/v1/profiles", profileResponseSchema, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async updateProfile(profileId: string, input: UpdateProfileInput) {
    const payload = updateProfileInputSchema.parse(input);
    try {
      return await request<ProfileResponse>(`/v1/profiles/${profileId}`, profileResponseSchema, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } catch (error) {
      // Return null for 404 not found
      return null;
    }
  },

  async deleteProfile(profileId: string) {
    try {
      await fetch(`${API_BASE_URL}/v1/profiles/${profileId}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async activateProfile(profileId: string) {
    try {
      return await request<ProfileResponse>(
        `/v1/profiles/${profileId}/activate`,
        profileResponseSchema,
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