import { z } from "zod";

// Profile schema
export const profileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(40),
  avatarBase64: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean()
});

// Input schemas for profile operations
export const createProfileInputSchema = z.object({
  name: z.string().min(1).max(40),
  avatarBase64: z.string().optional()
});

export const updateProfileInputSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  avatarBase64: z.string().nullable().optional()
});

// Response schemas
export const profilesListResponseSchema = z.object({
  profiles: z.array(profileSchema)
});

export const profileResponseSchema = z.object({
  profile: profileSchema
});

export const activeProfileResponseSchema = z.object({
  profile: profileSchema.nullable()
});

// Type exports
export type Profile = z.infer<typeof profileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type ProfilesListResponse = z.infer<typeof profilesListResponseSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ActiveProfileResponse = z.infer<typeof activeProfileResponseSchema>;