import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfilesListResponse,
  ProfileResponse,
  ActiveProfileResponse
} from "@snake/contracts";

export interface ProfileService {
  listProfiles(): Promise<ProfilesListResponse>;
  getProfile(profileId: string): Promise<ProfileResponse | null>;
  getActiveProfile(): Promise<ActiveProfileResponse>;
  createProfile(input: CreateProfileInput): Promise<ProfileResponse>;
  updateProfile(profileId: string, input: UpdateProfileInput): Promise<ProfileResponse | null>;
  deleteProfile(profileId: string): Promise<boolean>;
  activateProfile(profileId: string): Promise<ProfileResponse | null>;
}