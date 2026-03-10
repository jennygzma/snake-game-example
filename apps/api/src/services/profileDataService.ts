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
     * Business rule: If this is the first profile, it will be auto-activated
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
     * Business rule: CASCADE deletes all related themes and game runs
     * Warning: If deleting the active profile, no profile will be active after deletion
     */
    deleteProfile(profileId: string): boolean {
      return queries.delete(profileId);
    },

    /**
     * Activate a profile
     * Business rule: Ensures only one profile is active at a time
     */
    activateProfile(profileId: string): ProfileResponse | null {
      const profile = queries.activate(profileId);
      if (!profile) return null;
      return { profile };
    },

    /**
     * Validate that a profile exists (for use by other services)
     */
    validateProfileExists(profileId: string): boolean {
      return queries.getById(profileId) !== null;
    }
  };
};