import type { AppRouter } from "@qco/api";
import type { inferRouterOutputs } from "@trpc/server";

// Получаем типы из tRPC router outputs
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Типы для баннеров из API
export type BannerFromAPI = RouterOutputs["banners"]["getById"];
export type BannerListFromAPI = RouterOutputs["banners"]["getAll"]["items"][0];
