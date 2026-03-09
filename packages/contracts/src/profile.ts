import { z } from "zod";

// Profile Schema
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(40),
  avatarBase64: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Create Profile Input
export const CreateProfileInputSchema = z.object({
  name: z.string().min(1).max(40),
  avatarBase64: z.string().optional(),
});

export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;

// Update Profile Input
export const UpdateProfileInputSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  avatarBase64: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

// Response Schemas
export const ProfilesListResponseSchema = z.object({
  profiles: z.array(ProfileSchema),
});

export type ProfilesListResponse = z.infer<typeof ProfilesListResponseSchema>;

export const ProfileResponseSchema = z.object({
  profile: ProfileSchema,
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

export const ActiveProfileResponseSchema = z.object({
  profile: ProfileSchema.nullable(),
});

export type ActiveProfileResponse = z.infer<typeof ActiveProfileResponseSchema>;