import { z } from "zod";

export const FileNameRegex = /^[a-zA-Z0-9!_.*'()-\\/]+$/;
export const AVATAR_MAX_FILE_SIZE_MB = 2;
export const AVATAR_ALLOWED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const CreatePresignedUrlSchema = z.object({
  key: z
    .string()
    .min(1, "Key cannot be empty")
    .max(1024, "Key cannot be longer than 1024 characters"),

  temporary: z.boolean().optional(),
});

export type CreatePresignedUrlInput = z.infer<typeof CreatePresignedUrlSchema>;

export const FileInfoSchema = z.object({
  key: z.string(),
  name: z.string(),
  size: z.number(),
  logoType: z.enum(["workspace", "assistant"]),
});

export type FileInfo = z.infer<typeof FileInfoSchema>;

export const UserFileInfoSchema = z.object({
  key: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

export type UserFileInfo = z.infer<typeof UserFileInfoSchema>;
