import { authRouter } from "./router/auth";
import { bannersRouter } from "./router/banners";
import { blogRouter } from "./router/blog";
import { brandsRouter } from "./router/brands/index";
import { categoriesRouter } from "./router/categories";
import { categoryRouter } from "./router/category";
import { navigationRouter } from "./router/navigation";
import { productsRouter } from "./router/products";
import { searchRouter } from "./router/search";
import { cartRouter } from "./router/cart";
import { ordersRouter } from "./router/orders/index";
import { checkoutRouter } from "./router/checkout";
import { accountRouter } from "./router/account";
import { profileRouter } from "./router/profile";
import { favoritesRouter } from "./router/favorites";
import { getAll as deliverySettingsGetAll, getPickupPoints as deliverySettingsGetPickupPoints } from "./router/delivery-settings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  banners: bannersRouter,
  blog: blogRouter,
  navigation: navigationRouter,
  products: productsRouter,
  search: searchRouter,
  brands: brandsRouter,
  categories: categoriesRouter,
  category: categoryRouter,
  cart: cartRouter,
  checkout: checkoutRouter,
  orders: ordersRouter,
  account: accountRouter,
  profile: profileRouter,
  favorites: favoritesRouter,
  deliverySettings: {
    getAll: deliverySettingsGetAll,
    getPickupPoints: deliverySettingsGetPickupPoints,
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
