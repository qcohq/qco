import { z } from "zod"

export const deliverySettingsSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Название обязательно"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    deliveryType: z.enum(["pickup", "courier", "post", "cdek", "boxberry"]),
    minOrderAmount: z.number().min(0, "Минимальная сумма заказа не может быть отрицательной"),
    maxOrderAmount: z.number().optional(),
    deliveryCost: z.number().min(0, "Стоимость доставки не может быть отрицательной"),
    freeDeliveryThreshold: z.number().optional(),
    estimatedDays: z.number().min(1, "Количество дней должно быть больше 0").optional(),
    regions: z.array(z.string()).optional(),
    weightLimit: z.number().min(0).optional(),
    sizeLimit: z.string().optional(),
    isDefault: z.boolean().default(false),
})

export const pickupPointSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Название обязательно"),
    address: z.string().min(1, "Адрес обязателен"),
    city: z.string().min(1, "Город обязателен"),
    region: z.string().min(1, "Регион обязателен"),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    workingHours: z.string().optional(),
    coordinates: z.string().optional(),
    isActive: z.boolean().default(true),
    deliverySettingsId: z.string().optional(),
})

export const deliveryZoneSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Название обязательно"),
    region: z.string().min(1, "Регион обязателен"),
    city: z.string().optional(),
    deliveryCost: z.number().min(0, "Стоимость доставки не может быть отрицательной"),
    estimatedDays: z.number().min(1, "Количество дней должно быть больше 0"),
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
