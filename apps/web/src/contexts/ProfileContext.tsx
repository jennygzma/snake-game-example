import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@snake/contracts";
import { apiProfileService } from "../services/adapters/apiProfileService";
import { localProfileService } from "../services/storage/localProfileService";

const USE_API = import.meta.env.VITE_USE_API === "true";
const profileService = USE_API ? apiProfileService : localProfileService;

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  refreshProfiles: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<Profile>;
  updateProfile: (profileId: string, input: UpdateProfileInput) => Promise<Profile | null>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  activateProfile: (profileId: string) => Promise<Profile | null>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const useAppProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useAppProfile must be used within ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles and active profile on mount
  const refreshProfiles = async () => {
    try {
      setIsLoading(true);
      const [profilesResponse, activeResponse] = await Promise.all([
        profileService.listProfiles(),
        profileService.getActiveProfile()
      ]);
      setProfiles(profilesResponse.profiles);
      setActiveProfile(activeResponse.profile);
    } catch (error) {
      console.error("Failed to load profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  const createProfile = async (input: CreateProfileInput): Promise<Profile> => {
    const response = await profileService.createProfile(input);
    await refreshProfiles();
    return response.profile;
  };

  const updateProfile = async (profileId: string, input: UpdateProfileInput): Promise<Profile | null> => {
    const response = await profileService.updateProfile(profileId, input);
    if (response) {
      await refreshProfiles();
      return response.profile;
    }
    return null;
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    const success = await profileService.deleteProfile(profileId);
    if (success) {
      await refreshProfiles();
    }
    return success;
  };

  const activateProfile = async (profileId: string): Promise<Profile | null> => {
    const response = await profileService.activateProfile(profileId);
    if (response) {
      await refreshProfiles();
      return response.profile;
    }
    return null;
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isLoading,
        refreshProfiles,
        createProfile,
        updateProfile,
        deleteProfile,
        activateProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};