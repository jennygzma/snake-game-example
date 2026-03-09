import { useContext, useCallback } from "react";
import type { CreateProfileInput, UpdateProfileInput } from "@snake/contracts";
import { ProfileContext } from "../contexts/ProfileContext";

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  const { profiles, activeProfile, service, isLoading, error, reloadProfiles } = context;

  const createProfile = useCallback(
    async (input: CreateProfileInput) => {
      await service.createProfile(input);
      await reloadProfiles();
    },
    [service, reloadProfiles]
  );

  const updateProfile = useCallback(
    async (id: string, input: UpdateProfileInput) => {
      await service.updateProfile(id, input);
      await reloadProfiles();
    },
    [service, reloadProfiles]
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      await service.deleteProfile(id);
      await reloadProfiles();
    },
    [service, reloadProfiles]
  );

  const activateProfile = useCallback(
    async (id: string) => {
      await service.activateProfile(id);
      await reloadProfiles();
    },
    [service, reloadProfiles]
  );

  return {
    profiles,
    activeProfile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    activateProfile,
    reloadProfiles
  };
};