import {
  profileSchema,
  profilesListResponseSchema,
  profileResponseSchema,
  activeProfileResponseSchema,
  type Profile,
  type CreateProfileInput,
  type UpdateProfileInput,
  type ProfilesListResponse,
  type ProfileResponse,
  type ActiveProfileResponse
} from "@snake/contracts";
import type { ProfileService } from "../profileService";

const PROFILES_KEY = "snake.profiles";

const readProfiles = (): Profile[] => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return profilesListResponseSchema.parse({ profiles: data }).profiles;
  } catch {
    return [];
  }
};

const writeProfiles = (profiles: Profile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const localProfileService: ProfileService = {
  async listProfiles(): Promise<ProfilesListResponse> {
    const profiles = readProfiles();
    return profilesListResponseSchema.parse({ profiles });
  },

  async getProfile(id: string): Promise<ProfileResponse> {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profileResponseSchema.parse({ profile });
  },

  async getActiveProfile(): Promise<ActiveProfileResponse> {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.isActive) || null;
    return activeProfileResponseSchema.parse({ profile });
  },

  async createProfile(input: CreateProfileInput): Promise<ProfileResponse> {
    const profiles = readProfiles();
    const now = new Date().toISOString();
    const isFirstProfile = profiles.length === 0;

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: input.name,
      avatarBase64: input.avatarBase64 || null,
      createdAt: now,
      updatedAt: now,
      isActive: isFirstProfile
    };

    profiles.push(newProfile);
    writeProfiles(profiles);

    return profileResponseSchema.parse({ profile: newProfile });
  },

  async updateProfile(id: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    if (input.name !== undefined) {
      profile.name = input.name;
    }
    if (input.avatarBase64 !== undefined) {
      profile.avatarBase64 = input.avatarBase64;
    }
    profile.updatedAt = new Date().toISOString();

    writeProfiles(profiles);
    return profileResponseSchema.parse({ profile });
  },

  async deleteProfile(id: string): Promise<void> {
    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Profile not found");
    }

    profiles.splice(index, 1);
    writeProfiles(profiles);
  },

  async activateProfile(id: string): Promise<ProfileResponse> {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Deactivate all profiles
    profiles.forEach((p) => {
      p.isActive = false;
    });

    // Activate target profile
    profile.isActive = true;
    profile.updatedAt = new Date().toISOString();

    writeProfiles(profiles);
    return profileResponseSchema.parse({ profile });
  }
};