import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";
import { profileQueries } from "../db/profileQueries";

export const profileDataService = {
  listProfiles(): ProfilesListResponse {
    const profiles = profileQueries.listProfiles();
    return { profiles };
  },

  getProfile(id: string): ProfileResponse | null {
    const profile = profileQueries.getProfile(id);
    if (!profile) return null;
    return { profile };
  },

  getActiveProfile(): ActiveProfileResponse {
    const profile = profileQueries.getActiveProfile();
    return { profile };
  },

  createProfile(input: CreateProfileInput): ProfileResponse {
    const profile = profileQueries.createProfile(input);
    return { profile };
  },

  updateProfile(id: string, input: UpdateProfileInput): ProfileResponse | null {
    const profile = profileQueries.updateProfile(id, input);
    if (!profile) return null;
    return { profile };
  },

  deleteProfile(id: string): boolean {
    return profileQueries.deleteProfile(id);
  },

  activateProfile(id: string): ProfileResponse | null {
    const profile = profileQueries.activateProfile(id);
    if (!profile) return null;
    return { profile };
  }
};