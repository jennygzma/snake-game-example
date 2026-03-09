import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile } from "@snake/contracts";
import { apiProfileService } from "../services/adapters/apiProfileService";
import { localProfileService } from "../services/storage/localProfileService";

const USE_API = import.meta.env.VITE_USE_API === "true";
const profileService = USE_API ? apiProfileService : localProfileService;

interface ProfileContextValue {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile | null) => void;
  loading: boolean;
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

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load active profile on mount
  useEffect(() => {
    const loadActiveProfile = async () => {
      try {
        const response = await profileService.getActiveProfile();
        setActiveProfile(response.profile);
      } catch (error) {
        console.error("Failed to load active profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActiveProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};