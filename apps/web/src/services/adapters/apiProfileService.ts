import type {
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";
import {
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema
} from "@snake/contracts";
import type { ProfileService } from "../profileService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return schema.parse(data);
}

export const apiProfileService: ProfileService = {
  async listProfiles(): Promise<ProfilesListResponse> {
    return request("/profiles", {}, profilesListResponseSchema);
  },

  async getProfile(id: string): Promise<ProfileResponse | null> {
    try {
      return await request(`/profiles/${id}`, {}, profileResponseSchema);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  },

  async getActiveProfile(): Promise<ActiveProfileResponse> {
    return request("/profiles/active", {}, activeProfileResponseSchema);
  },

  async createProfile(input: CreateProfileInput): Promise<ProfileResponse> {
    return request(
      "/profiles",
      {
        method: "POST",
        body: JSON.stringify(input)
      },
      profileResponseSchema
    );
  },

  async updateProfile(
    id: string,
    input: UpdateProfileInput
  ): Promise<ProfileResponse | null> {
    try {
      return await request(
        `/profiles/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(input)
        },
        profileResponseSchema
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  },

  async deleteProfile(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/v1/profiles/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch {
      return false;
    }
  },

  async activateProfile(id: string): Promise<ProfileResponse | null> {
    try {
      return await request(
        `/profiles/${id}/activate`,
        {
          method: "POST"
        },
        profileResponseSchema
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }
};