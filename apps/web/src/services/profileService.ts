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
  getProfile(id: string): Promise<ProfileResponse | null>;
  getActiveProfile(): Promise<ActiveProfileResponse>;
  createProfile(input: CreateProfileInput): Promise<ProfileResponse>;
  updateProfile(id: string, input: UpdateProfileInput): Promise<ProfileResponse | null>;
  deleteProfile(id: string): Promise<boolean>;
  activateProfile(id: string): Promise<ProfileResponse | null>;
}