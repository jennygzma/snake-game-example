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
const THEMES_KEY = "snake.themes";
const RUNS_KEY = "snake.runs";
const SETTINGS_BY_PROFILE_KEY = "snake.settings.by_profile";

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
    const deletedProfile = profiles.find((p) => p.id === profileId);
    const filtered = profiles.filter((p) => p.id !== profileId);

    if (filtered.length === profiles.length) {
      // Profile not found
      return false;
    }

    // Keep exactly one active profile when profiles remain.
    const hasActive = filtered.some((profile) => profile.isActive);
    const nextProfiles =
      filtered.length > 0 && !hasActive
        ? filtered.map((profile, index) => ({
            ...profile,
            isActive: index === 0
          }))
        : filtered;

    writeProfiles(nextProfiles);

    // Cascade delete profile-scoped themes.
    const rawThemes = localStorage.getItem(THEMES_KEY);
    if (rawThemes) {
      try {
        const parsed = JSON.parse(rawThemes);
        if (Array.isArray(parsed)) {
          const nextThemes = parsed.filter((theme) => theme?.userId !== profileId);
          localStorage.setItem(THEMES_KEY, JSON.stringify(nextThemes));
        }
      } catch {
        // ignore malformed local cache
      }
    }

    // Cascade delete profile-scoped runs.
    const rawRuns = localStorage.getItem(RUNS_KEY);
    if (rawRuns) {
      try {
        const parsed = JSON.parse(rawRuns);
        if (Array.isArray(parsed)) {
          const nextRuns = parsed.filter((run) => run?.userId !== profileId);
          localStorage.setItem(RUNS_KEY, JSON.stringify(nextRuns));
        }
      } catch {
        // ignore malformed local cache
      }
    }

    // Cascade delete profile-scoped settings.
    const rawSettingsByProfile = localStorage.getItem(SETTINGS_BY_PROFILE_KEY);
    if (rawSettingsByProfile) {
      try {
        const parsed = JSON.parse(rawSettingsByProfile);
        if (parsed && typeof parsed === "object") {
          delete parsed[profileId];
          localStorage.setItem(SETTINGS_BY_PROFILE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore malformed local cache
      }
    }

    // Keep behavior deterministic if active profile was deleted and next exists.
    if (deletedProfile?.isActive && nextProfiles.length > 0 && !nextProfiles.some((p) => p.isActive)) {
      const [first] = nextProfiles;
      if (first) {
        const normalized = nextProfiles.map((p) => ({ ...p, isActive: p.id === first.id }));
        writeProfiles(normalized);
      }
    }
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
