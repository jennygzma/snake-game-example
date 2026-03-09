import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput
} from "@snake/contracts";

type ProfileRow = {
  id: string;
  name: string;
  avatar_base64: string | null;
  created_at: string;
  updated_at: string;
  is_active: number;
};

const rowToProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  name: row.name,
  avatarBase64: row.avatar_base64,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isActive: row.is_active === 1
});

// In-memory store for profiles (simulating database)
const profiles: ProfileRow[] = [];

export const profileQueries = {
  listProfiles(): Profile[] {
    return profiles.map(rowToProfile);
  },

  getProfile(id: string): Profile | null {
    const row = profiles.find((p) => p.id === id);
    return row ? rowToProfile(row) : null;
  },

  getActiveProfile(): Profile | null {
    const row = profiles.find((p) => p.is_active === 1);
    return row ? rowToProfile(row) : null;
  },

  createProfile(input: CreateProfileInput): Profile {
    const now = new Date().toISOString();
    const isFirstProfile = profiles.length === 0;
    
    const row: ProfileRow = {
      id: crypto.randomUUID(),
      name: input.name,
      avatar_base64: input.avatarBase64 || null,
      created_at: now,
      updated_at: now,
      is_active: isFirstProfile ? 1 : 0
    };

    profiles.push(row);
    return rowToProfile(row);
  },

  updateProfile(id: string, input: UpdateProfileInput): Profile | null {
    const row = profiles.find((p) => p.id === id);
    if (!row) return null;

    if (input.name !== undefined) {
      row.name = input.name;
    }
    if (input.avatarBase64 !== undefined) {
      row.avatar_base64 = input.avatarBase64;
    }
    row.updated_at = new Date().toISOString();

    return rowToProfile(row);
  },

  deleteProfile(id: string): boolean {
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return false;

    profiles.splice(index, 1);
    return true;
  },

  activateProfile(id: string): Profile | null {
    const targetRow = profiles.find((p) => p.id === id);
    if (!targetRow) return null;

    // Deactivate all profiles
    profiles.forEach((p) => {
      p.is_active = 0;
    });

    // Activate target profile
    targetRow.is_active = 1;
    targetRow.updated_at = new Date().toISOString();

    return rowToProfile(targetRow);
  }
};