import type { Database } from "better-sqlite3";
import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";
import { profileQueries } from "../db/profileQueries";

export const createProfileDataService = (db: Database) => {
  const queries = profileQueries(db);

  return {
    /**
     * List all profiles
     */
    listProfiles(): ProfilesListResponse {
      const profiles = queries.list();
      return { profiles };
    },

    /**
     * Get a specific profile by ID
     */
    getProfile(profileId: string): ProfileResponse | null {
      const profile = queries.getById(profileId);
      if (!profile) return null;
      return { profile };
    },

    /**
     * Get the active profile
     */
    getActiveProfile(): ActiveProfileResponse {
      const profile = queries.getActive();
      return { profile };
    },

    /**
     * Create a new profile
     * First profile is automatically activated
     */
    createProfile(input: CreateProfileInput): ProfileResponse {
      const profile = queries.create(input);
      return { profile };
    },

    /**
     * Update an existing profile
     */
    updateProfile(profileId: string, input: UpdateProfileInput): ProfileResponse | null {
      const profile = queries.update(profileId, input);
      if (!profile) return null;
      return { profile };
    },

    /**
     * Delete a profile
     * CASCADE will automatically delete associated themes and game runs
     */
    deleteProfile(profileId: string): boolean {
      return queries.delete(profileId);
    },

    /**
     * Activate a profile (and deactivate all others)
     * Ensures only one profile is active at a time
     */
    activateProfile(profileId: string): ProfileResponse | null {
      const profile = queries.activate(profileId);
      if (!profile) return null;
      return { profile };
    },

    /**
     * Validate that a profile exists
     * Useful for operations that depend on a valid profile
     */
    validateProfileExists(profileId: string): boolean {
      const profile = queries.getById(profileId);
      return profile !== null;
    }
  };
};