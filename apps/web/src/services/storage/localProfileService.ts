import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";
import type { ProfileService } from "../profileService";

const STORAGE_KEY = "snake_profiles";

function getProfiles(): Profile[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Profile[];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export const localProfileService: ProfileService = {
  async listProfiles(): Promise<ProfilesListResponse> {
    const profiles = getProfiles();
    return { profiles };
  },

  async getProfile(id: string): Promise<ProfileResponse | null> {
    const profiles = getProfiles();
    const profile = profiles.find((p) => p.id === id);
    return profile ? { profile } : null;
  },

  async getActiveProfile(): Promise<ActiveProfileResponse> {
    const profiles = getProfiles();
    const profile = profiles.find((p) => p.isActive) || null;
    return { profile };
  },

  async createProfile(input: CreateProfileInput): Promise<ProfileResponse> {
    const profiles = getProfiles();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Auto-activate if first profile
    const isActive = profiles.length === 0;
    
    const profile: Profile = {
      id,
      name: input.name,
      avatarBase64: input.avatarBase64 || null,
      createdAt: now,
      updatedAt: now,
      isActive
    };
    
    saveProfiles([...profiles, profile]);
    return { profile };
  },

  async updateProfile(
    id: string,
    input: UpdateProfileInput
  ): Promise<ProfileResponse | null> {
    const profiles = getProfiles();
    const existing = profiles.find((p) => p.id === id);
    
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const updated: Profile = {
      id: existing.id,
      name: input.name ?? existing.name,
      avatarBase64:
        input.avatarBase64 !== undefined
          ? input.avatarBase64
          : existing.avatarBase64,
      createdAt: existing.createdAt,
      updatedAt: now,
      isActive: existing.isActive
    };
    
    const updatedProfiles = profiles.map((p) => (p.id === id ? updated : p));
    saveProfiles(updatedProfiles);
    
    return { profile: updated };
  },

  async deleteProfile(id: string): Promise<boolean> {
    const profiles = getProfiles();
    const filtered = profiles.filter((p) => p.id !== id);
    
    if (filtered.length === profiles.length) {
      return false; // Profile not found
    }
    
    saveProfiles(filtered);
    return true;
  },

  async activateProfile(id: string): Promise<ProfileResponse | null> {
    const profiles = getProfiles();
    const profile = profiles.find((p) => p.id === id);
    
    if (!profile) return null;
    
    const now = new Date().toISOString();
    const updated = profiles.map((p) => ({
      ...p,
      isActive: p.id === id,
      updatedAt: p.id === id ? now : p.updatedAt
    }));
    
    saveProfiles(updated);
    
    return { profile: { ...profile, isActive: true, updatedAt: now } };
  }
};