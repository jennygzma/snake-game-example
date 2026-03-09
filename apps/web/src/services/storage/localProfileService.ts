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
import type { ProfileService } from "../profileService";

const PROFILES_KEY = "snake.profiles";

const readProfiles = (): Profile[] => {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return ProfilesListResponseSchema.parse({ profiles: parsed }).profiles;
  } catch {
    return [];
  }
};

const writeProfiles = (profiles: Profile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const localProfileService: ProfileService = {
  async listProfiles() {
    const profiles = readProfiles();
    return ProfilesListResponseSchema.parse({ profiles }) satisfies ProfilesListResponse;
  },

  async getProfile(profileId: string) {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return null;
    return ProfileResponseSchema.parse({ profile }) satisfies ProfileResponse;
  },

  async getActiveProfile() {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.isActive) ?? null;
    return ActiveProfileResponseSchema.parse({ profile }) satisfies ActiveProfileResponse;
  },

  async createProfile(input: CreateProfileInput) {
    const payload = CreateProfileInputSchema.parse(input);
    const profiles = readProfiles();
    
    // If this is the first profile, make it active
    const isActive = profiles.length === 0;
    
    const profile: Profile = {
      id: crypto.randomUUID(),
      name: payload.name,
      avatarBase64: payload.avatarBase64 ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive
    };

    writeProfiles([profile, ...profiles]);
    return ProfileResponseSchema.parse({ profile }) satisfies ProfileResponse;
  },

  async updateProfile(profileId: string, input: UpdateProfileInput) {
    const payload = UpdateProfileInputSchema.parse(input);
    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.id === profileId);
    
    if (index === -1) return null;

    const existing = profiles[index];
    if (!existing) return null;

    const updated: Profile = {
      id: existing.id,
      name: payload.name ?? existing.name,
      avatarBase64: payload.avatarBase64 !== undefined ? payload.avatarBase64 : existing.avatarBase64,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      isActive: existing.isActive
    };

    profiles[index] = updated;
    writeProfiles(profiles);
    return ProfileResponseSchema.parse({ profile: updated }) satisfies ProfileResponse;
  },

  async deleteProfile(profileId: string) {
    const profiles = readProfiles();
    const filtered = profiles.filter((p) => p.id !== profileId);
    
    if (filtered.length === profiles.length) return false;
    
    writeProfiles(filtered);
    return true;
  },

  async activateProfile(profileId: string) {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === profileId);
    
    if (!profile) return null;

    // Deactivate all profiles
    const updated = profiles.map((p) => ({
      ...p,
      isActive: p.id === profileId
    }));

    writeProfiles(updated);
    
    const activated = updated.find((p) => p.id === profileId)!;
    return ProfileResponseSchema.parse({ profile: activated }) satisfies ProfileResponse;
  }
};