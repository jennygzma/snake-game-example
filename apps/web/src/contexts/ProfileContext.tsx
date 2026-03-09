import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@snake/contracts";
import { apiProfileService } from "../services/adapters/apiProfileService";
import { localProfileService } from "../services/storage/localProfileService";
import { useAppTheme } from "./ThemeContext";

const USE_API = import.meta.env.VITE_USE_API === "true";
const profileService = USE_API ? apiProfileService : localProfileService;

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  loading: boolean;
  refreshProfiles: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<Profile | null>;
  updateProfile: (profileId: string, input: UpdateProfileInput) => Promise<Profile | null>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  activateProfile: (profileId: string) => Promise<Profile | null>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

const INITIAL_PROFILE_LOAD_TIMEOUT_MS = 5000;
const PROFILE_REQUEST_TIMEOUT_MS = 5000;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Profile initialization timed out"));
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { reloadTheme } = useAppTheme();

  const refreshProfiles = async () => {
    try {
      const [profilesResponse, activeResponse] = await Promise.all([
        withTimeout(profileService.listProfiles(), PROFILE_REQUEST_TIMEOUT_MS),
        withTimeout(profileService.getActiveProfile(), PROFILE_REQUEST_TIMEOUT_MS)
      ]);
      
      setProfiles(profilesResponse.profiles);
      setActiveProfile(activeResponse.profile);
    } catch (error) {
      console.error("Failed to refresh profiles:", error);
    }
  };

  // Load profiles on mount
  useEffect(() => {
    let cancelled = false;

    const loadProfiles = async () => {
      if (!cancelled) {
        setLoading(true);
      }

      try {
        await withTimeout(refreshProfiles(), INITIAL_PROFILE_LOAD_TIMEOUT_MS);
      } catch (error) {
        console.error("Profile initialization failed:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfiles();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reload theme when active profile changes
  useEffect(() => {
    if (!loading && activeProfile) {
      reloadTheme();
    }
  }, [activeProfile?.id, loading, reloadTheme]);

  const createProfile = async (input: CreateProfileInput): Promise<Profile | null> => {
    try {
      const response = await withTimeout(
        profileService.createProfile(input),
        PROFILE_REQUEST_TIMEOUT_MS
      );
      await refreshProfiles();
      return response.profile;
    } catch (error) {
      console.error("Failed to create profile:", error);
      return null;
    }
  };

  const updateProfile = async (
    profileId: string,
    input: UpdateProfileInput
  ): Promise<Profile | null> => {
    try {
      const response = await withTimeout(
        profileService.updateProfile(profileId, input),
        PROFILE_REQUEST_TIMEOUT_MS
      );
      if (response) {
        await refreshProfiles();
        return response.profile;
      }
      return null;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return null;
    }
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    try {
      const success = await withTimeout(
        profileService.deleteProfile(profileId),
        PROFILE_REQUEST_TIMEOUT_MS
      );
      if (success) {
        await refreshProfiles();
      }
      return success;
    } catch (error) {
      console.error("Failed to delete profile:", error);
      return false;
    }
  };

  const activateProfile = async (profileId: string): Promise<Profile | null> => {
    try {
      const response = await withTimeout(
        profileService.activateProfile(profileId),
        PROFILE_REQUEST_TIMEOUT_MS
      );
      if (response) {
        await refreshProfiles();
        return response.profile;
      }
      return null;
    } catch (error) {
      console.error("Failed to activate profile:", error);
      return null;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        loading,
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
