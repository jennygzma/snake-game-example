import { useState, useEffect, useCallback } from "react";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@snake/contracts";
import { apiProfileService } from "../services/adapters/apiProfileService";
import { localProfileService } from "../services/storage/localProfileService";
import { useProfileContext } from "../contexts/ProfileContext";

const USE_API = import.meta.env.VITE_USE_API === "true";
const profileService = USE_API ? apiProfileService : localProfileService;

export const useProfile = () => {
  const { activeProfile, setActiveProfile } = useProfileContext();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profiles
  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.listProfiles();
      setProfiles(response.profiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Create a new profile
  const createProfile = useCallback(
    async (input: CreateProfileInput) => {
      try {
        setError(null);
        const response = await profileService.createProfile(input);
        setProfiles((prev) => [...prev, response.profile]);
        
        // If first profile, auto-activate
        if (response.profile.isActive) {
          setActiveProfile(response.profile);
        }
        
        return response.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create profile";
        setError(message);
        throw new Error(message);
      }
    },
    [setActiveProfile]
  );

  // Update a profile
  const updateProfile = useCallback(
    async (id: string, input: UpdateProfileInput) => {
      try {
        setError(null);
        const response = await profileService.updateProfile(id, input);
        
        if (!response) {
          throw new Error("Profile not found");
        }
        
        setProfiles((prev) => prev.map((p) => (p.id === id ? response.profile : p)));
        
        // Update active profile if it's the one being updated
        if (activeProfile?.id === id) {
          setActiveProfile(response.profile);
        }
        
        return response.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update profile";
        setError(message);
        throw new Error(message);
      }
    },
    [activeProfile, setActiveProfile]
  );

  // Delete a profile
  const deleteProfile = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const success = await profileService.deleteProfile(id);
        
        if (!success) {
          throw new Error("Profile not found");
        }
        
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        
        // Clear active profile if it was deleted
        if (activeProfile?.id === id) {
          setActiveProfile(null);
        }
        
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete profile";
        setError(message);
        throw new Error(message);
      }
    },
    [activeProfile, setActiveProfile]
  );

  // Activate a profile
  const activateProfile = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const response = await profileService.activateProfile(id);
        
        if (!response) {
          throw new Error("Profile not found");
        }
        
        // Update profiles list
        setProfiles((prev) =>
          prev.map((p) => ({
            ...p,
            isActive: p.id === id
          }))
        );
        
        // Update active profile
        setActiveProfile(response.profile);
        
        return response.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to activate profile";
        setError(message);
        throw new Error(message);
      }
    },
    [setActiveProfile]
  );

  return {
    profiles,
    activeProfile,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    activateProfile,
    refreshProfiles: loadProfiles
  };
};