import type { Database } from "better-sqlite3";
import {
  type Profile,
  type CreateProfileInput,
  type UpdateProfileInput,
  type ProfilesListResponse,
  type ProfileResponse,
  type ActiveProfileResponse
} from "@snake/contracts";
import { profileQueries } from "../db/profileQueries";

export const createProfileDataService = (db: Database) => {
  const queries = profileQueries(db);

  return {
  listProfiles(): ProfilesListResponse {
    const profiles = queries.listProfiles();
    return { profiles };
  },

  getProfile(id: string): ProfileResponse | null {
    const profile = queries.getProfile(id);
    if (!profile) return null;
    return { profile };
  },

  getActiveProfile(): ActiveProfileResponse {
    const profile = queries.getActiveProfile();
    return { profile };
  },

  createProfile(input: CreateProfileInput): ProfileResponse {
    const profile = queries.createProfile(input);
    return { profile };
  },

  updateProfile(id: string, input: UpdateProfileInput): ProfileResponse | null {
    const profile = queries.updateProfile(id, input);
    if (!profile) return null;
    return { profile };
  },

  deleteProfile(id: string): boolean {
    return queries.deleteProfile(id);
  },

  activateProfile(id: string): ProfileResponse | null {
    const profile = queries.activateProfile(id);
    if (!profile) return null;
    return { profile };
  }
  };
};
