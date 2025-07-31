import { z } from "zod"

export const deliverySettingsSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    deliveryType: z.enum(["pickup", "courier", "post", "cdek", "boxberry"]),
    minOrderAmount: z.number().min(0, "Minimum order amount cannot be negative"),
    maxOrderAmount: z.number().optional(),
    deliveryCost: z.number().min(0, "Delivery cost cannot be negative"),
    freeDeliveryThreshold: z.number().optional(),
    estimatedDays: z.number().min(1, "Number of days must be greater than 0").optional(),
    regions: z.array(z.string()).optional(),
    weightLimit: z.number().min(0).optional(),
    sizeLimit: z.string().optional(),
    isDefault: z.boolean().default(false),
})

export const pickupPointSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    workingHours: z.string().optional(),
    coordinates: z.string().optional(),
    isActive: z.boolean().default(true),
    deliverySettingsId: z.string().optional(),
})

export const deliveryZoneSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    region: z.string().min(1, "Region is required"),
    city: z.string().optional(),
    deliveryCost: z.number().min(0, "Delivery cost cannot be negative"),
    estimatedDays: z.number().min(1, "Number of days must be greater than 0"),
    isActive: z.boolean().default(true),
    deliverySettingsId: z.string().optional(),
})

export const deliverySettingsFormSchema = z.object({
    deliverySettings: deliverySettingsSchema,
    pickupPoints: z.array(pickupPointSchema).optional(),
    deliveryZones: z.array(deliveryZoneSchema).optional(),
})

export type DeliverySettings = z.infer<typeof deliverySettingsSchema>
export type PickupPoint = z.infer<typeof pickupPointSchema>
export type DeliveryZone = z.infer<typeof deliveryZoneSchema>
export type DeliverySettingsForm = z.infer<typeof deliverySettingsFormSchema> 
