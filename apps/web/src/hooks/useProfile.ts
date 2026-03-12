import { useAppProfile } from "../contexts/ProfileContext";

/**
 * Hook to access profile state and operations
 * 
 * Provides:
 * - profiles: All profiles
 * - activeProfile: Currently active profile
 * - isLoading: Loading state
 * - refreshProfiles: Reload profiles from service
 * - createProfile: Create a new profile
 * - updateProfile: Update profile name/avatar
 * - deleteProfile: Delete a profile (CASCADE deletes themes/scores)
 * - activateProfile: Switch active profile
 */
export const useProfile = () => {
  return useAppProfile();
};