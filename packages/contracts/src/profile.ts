import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(40),
  avatarBase64: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean()
});

export const createProfileInputSchema = z.object({
  name: z.string().min(1).max(40),
  avatarBase64: z.string().optional()
});

export const updateProfileInputSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  avatarBase64: z.string().nullable().optional()
});

export const profilesListResponseSchema = z.object({
  profiles: z.array(profileSchema)
});

export const profileResponseSchema = z.object({
  profile: profileSchema
});

export const activeProfileResponseSchema = z.object({
  profile: profileSchema.nullable()
});

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type ProfilesListResponse = z.infer<typeof profilesListResponseSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ActiveProfileResponse = z.infer<typeof activeProfileResponseSchema>;