import { z } from "zod";

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  totalOrders: z.number(),
  totalSpent: z.number(),
  registrationDate: z.string().datetime(),
});

export const createCustomerSchema = customerSchema.omit({ id: true });
export const updateCustomerSchema = createCustomerSchema.partial();

export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
