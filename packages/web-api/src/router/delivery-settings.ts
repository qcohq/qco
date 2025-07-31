import { publicProcedure } from "../trpc";
import { z } from "zod";

// Статические данные для способов доставки
const deliverySettings = [
    {
        id: "courier",
        name: "Курьерская доставка",
        description: "Доставка по Москве и МО в течение 1-2 дней",
        deliveryType: "courier",
        deliveryCost: "500",
        freeDeliveryThreshold: "5000",
        estimatedDays: 2,
        isActive: true,
        isDefault: true,
        regions: ["Москва", "Московская область"],
    },
    {
        id: "cdek",
        name: "СДЭК",
        description: "Доставка в пункт выдачи или курьером по России",
        deliveryType: "cdek",
        deliveryCost: "350",
        freeDeliveryThreshold: "3000",
        estimatedDays: 5,
        isActive: true,
        isDefault: false,
        regions: ["Россия"],
    },
    {
        id: "post",
        name: "Почта России",
        description: "Доставка почтой в любую точку России",
        deliveryType: "post",
        deliveryCost: "250",
        freeDeliveryThreshold: "2000",
        estimatedDays: 10,
        isActive: true,
        isDefault: false,
        regions: ["Россия"],
    },
];

export const getAll = publicProcedure.query(() => {
    return deliverySettings;
});

export const getPickupPoints = publicProcedure
    .input(z.object({ deliverySettingsId: z.string() }))
    .query(({ input }) => {
        // Возвращаем пустой массив, так как у нас нет точек самовывоза
        return [];
    }); 
