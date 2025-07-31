import { createTRPCRouter } from "./trpc";
import { adminsRouter } from "./router/admins";
import { authRouter } from "./router/auth";
import { bannersRouter } from "./router/banners";
import { blogRouter } from "./router/blog";
import { brandsRouter } from "./router/brands";
import { categoriesRouter } from "./router/categories";
import { customersRouter } from "./router/customers";
import { dashboardRouter } from "./router/dashboard";
import { deliverySettingsRouter } from "./router/delivery-settings";
import { ordersRouter } from "./router/orders";
import { productTypesRouter } from "./router/product-types";
import { productTypeAttributesRouter } from "./router/product-type-attributes";
import { productAttributeValuesRouter } from "./router/product-attribute-values";
import { productsRouter } from "./router/products";
import { productVariantsRouter } from "./router/product-variants";
import { attachmentsRouter } from "./router/attachments";

export const appRouter = createTRPCRouter({
  admins: adminsRouter,
  attachments: attachmentsRouter,
  auth: authRouter,
  banners: bannersRouter,
  blog: blogRouter,
  brands: brandsRouter,
  categories: categoriesRouter,
  customers: customersRouter,
  dashboard: dashboardRouter,
  deliverySettings: deliverySettingsRouter,
  orders: ordersRouter,
  productTypes: productTypesRouter,
  productTypeAttributes: productTypeAttributesRouter,
  productAttributeValues: productAttributeValuesRouter,
  products: productsRouter,
  productVariants: productVariantsRouter,
});

export type AppRouter = typeof appRouter;
