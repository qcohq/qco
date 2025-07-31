import { z } from "zod";

export const productTypeSchema = z.object({
  name: z.string().min(2, {
    message: "Name must contain at least 2 characters",
  }),
  description: z.string().optional(),
});

export type ProductTypeFormData = z.infer<typeof productTypeSchema>;
