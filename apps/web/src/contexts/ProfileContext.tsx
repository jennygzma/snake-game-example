import { createContext, ReactNode, useEffect, useState } from "react";
import type { Profile } from "@snake/contracts";
import { apiProfileService } from "../services/adapters/apiProfileService";
import { localProfileService } from "../services/storage/localProfileService";
import type { ProfileService } from "../services/profileService";

type ProfileContextValue = {
  profiles: Profile[];
  activeProfile: Profile | null;
  service: ProfileService;
  isLoading: boolean;
  error: string | null;
  reloadProfiles: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

type ProfileProviderProps = {
  children: ReactNode;
  mode?: "local" | "api";
};

export const ProfileProvider = ({ children, mode = "api" }: ProfileProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = mode === "api" ? apiProfileService : localProfileService;

  const reloadProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [profilesResponse, activeResponse] = await Promise.all([
        service.listProfiles(),
        service.getActiveProfile()
      ]);

      setProfiles(profilesResponse.profiles);
      setActiveProfile(activeResponse.profile);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load profiles";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void reloadProfiles();
  }, [mode]);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        service,
        isLoading,
        error,
        reloadProfiles
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};