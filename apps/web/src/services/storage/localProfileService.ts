import {
  createProfileInputSchema,
  updateProfileInputSchema,
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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
    return profilesListResponseSchema.parse({ profiles }) satisfies ProfilesListResponse;
  },

  async getProfile(profileId: string) {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return null;
    return profileResponseSchema.parse({ profile }) satisfies ProfileResponse;
  },

  async getActiveProfile() {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.isActive) ?? null;
    return activeProfileResponseSchema.parse({ profile }) satisfies ActiveProfileResponse;
  },

  async createProfile(input: CreateProfileInput) {
    const validated = createProfileInputSchema.parse(input);
    const now = new Date().toISOString();
    
    const profiles = readProfiles();
    
    // First profile is automatically activated
    const isActive = profiles.length === 0;

    const profile: Profile = {
      id: crypto.randomUUID(),
      name: validated.name,
      avatarBase64: validated.avatarBase64 ?? null,
      createdAt: now,
      updatedAt: now,
      isActive
    };

    // If this is the first profile, it's active; if activating, deactivate others
    const updatedProfiles = isActive
      ? [profile]
      : [...profiles, profile];

    writeProfiles(updatedProfiles);

    return profileResponseSchema.parse({ profile }) satisfies ProfileResponse;
  },

  async updateProfile(profileId: string, input: UpdateProfileInput) {
    const validated = updateProfileInputSchema.parse(input);
    const profiles = readProfiles();
    const existing = profiles.find((p) => p.id === profileId);

    if (!existing) return null;

    const now = new Date().toISOString();
    const updatedProfile: Profile = {
      ...existing,
      name: validated.name !== undefined ? validated.name : existing.name,
      avatarBase64: validated.avatarBase64 !== undefined ? validated.avatarBase64 : existing.avatarBase64,
      updatedAt: now
    };

    const updatedProfiles = profiles.map((p) => (p.id === profileId ? updatedProfile : p));
    writeProfiles(updatedProfiles);

    return profileResponseSchema.parse({ profile: updatedProfile }) satisfies ProfileResponse;
  },

  async deleteProfile(profileId: string) {
    const profiles = readProfiles();
    const filtered = profiles.filter((p) => p.id !== profileId);

    if (filtered.length === profiles.length) {
      // Profile not found
      return false;
    }

    writeProfiles(filtered);
    return true;
  },

  async activateProfile(profileId: string) {
    const profiles = readProfiles();
    const targetIndex = profiles.findIndex((p) => p.id === profileId);

    if (targetIndex === -1) return null;

    // Deactivate all profiles and activate the target
    const updatedProfiles = profiles.map((p, index) => ({
      ...p,
      isActive: index === targetIndex
    }));

    writeProfiles(updatedProfiles);

    return profileResponseSchema.parse({
      profile: updatedProfiles[targetIndex]
    }) satisfies ProfileResponse;
  }
};