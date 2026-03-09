import { useProfileContext } from "../contexts/ProfileContext";

/**
 * Convenience hook for accessing profile context
 * Provides CRUD operations and profile state
 */
export const useProfile = () => {
  return useProfileContext();
};