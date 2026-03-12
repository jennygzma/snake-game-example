import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";

export interface ProfileService {
  /**
   * List all profiles
   */
  listProfiles(): Promise<ProfilesListResponse>;

  /**
   * Get a specific profile by ID
   */
  getProfile(profileId: string): Promise<ProfileResponse | null>;

  /**
   * Get the active profile
   */
  getActiveProfile(): Promise<ActiveProfileResponse>;

  /**
   * Create a new profile
   */
  createProfile(input: CreateProfileInput): Promise<ProfileResponse>;

  /**
   * Update an existing profile
   */
  updateProfile(profileId: string, input: UpdateProfileInput): Promise<ProfileResponse | null>;

  /**
   * Delete a profile
   */
  deleteProfile(profileId: string): Promise<boolean>;

  /**
   * Activate a profile (and deactivate all others)
   */
  activateProfile(profileId: string): Promise<ProfileResponse | null>;
}