# Contribution Guidelines

Welcome to our open-source e-commerce platform, a **flexible alternative to Shopify** designed for developers to build customizable online stores. Built with a modern tech stack—**Next.js 15**, **React 17**, **TypeScript**, **Tailwind CSS 4**, **tRPC**, **Drizzle ORM**, **Neon Postgres**, **Zod/v4**, **next-intl**, **Better Auth**, **Shadcn/ui**, **T3 Stack**, **TurboRepo**, **Bun**, and **BiomeJS**—this project prioritizes **modularity**, **maintainability**, and **community collaboration**. These guidelines ensure the codebase remains scalable and easy to extend, making it an ideal template for e-commerce projects.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Design System and UI Components](#design-system-and-ui-components)
4. [Code Style and Standards](#code-style-and-standards)
5. [Modularity Principles](#modularity-principles)
6. [Development Workflow](#development-workflow)
7. [Database and API](#database-and-api)
8. [Authentication](#authentication)
9. [UI Components](#ui-components)
10. [S3 Integration](#s3-integration)
11. [Submitting Contributions](#submitting-contributions)
12. [Example Contribution](#example-contribution)

---

## Project Overview
This open-source project is a **developer-friendly e-commerce platform**, offering a customizable alternative to Shopify. Key features include:
- **Storefronts** (`/apps/web`): Product catalogs, carts, and checkout flows built with Next.js 15.
- **Admin Dashboards** (`/apps/app`): Tools for managing products, orders, and customers, adaptable for web or native apps.
- **Core Functionality**: Product management, payment integrations, multi-language support, and media storage via AWS S3.
- **Extensibility**: Modular design for adding features like subscriptions, reviews, or analytics.
- **Community-Driven**: Open to contributions for new integrations, optimizations, and e-commerce enhancements.

The goal is to provide a production-ready template that developers can adopt to build tailored e-commerce solutions, with a focus on scalability, type safety, and modern practices.

---

## Project Structure
The project uses **TurboRepo** for monorepo management, following the **T3 Stack** philosophy. The structure is:

- **/apps**:
  - `/apps/web`: Next.js 15 storefront.
    - `/features`: Feature-based organization (e.g., `/features/product`, `/features/cart`) for components, hooks, and utilities.
    - `/pages`: Next.js routing (API routes in `/pages/api`).
    - `/public`: Static assets (e.g., product images).
    - `/tailwind.config.ts`: Tailwind CSS 4 configuration (if customized; otherwise, uses defaults).
  - `/apps/app`: Admin dashboard or companion app.
    - `/features`: Feature-based organization (e.g., `/features/orders`, `/features/inventory`).
- **/packages**:
  - `/packages/web-api`: tRPC routers for `/apps/web`, using **Drizzle Queries** and **Zod/v4** from `/packages/web-validators`.
  - `/packages/api`: API logic (preferably tRPC) for `/apps/app`, using **Zod/v4** from `/packages/validators`.
  - `/packages/web-auth`: **Better Auth** configurations for `/apps/web`.
  - `/packages/web-validators`: **Zod/v4** schemas for `/apps/web` and `/packages/web-api` (e.g., product, cart schemas).
  - `/packages/validators`: **Zod/v4** schemas for `/apps/app` and `/packages/api` (e.g., order, inventory schemas).
  - `/packages/ui`: Reusable **Shadcn/ui** and custom UI components (e.g., product cards).
  - `/packages/db`: **Drizzle ORM** schemas and utilities.
    - Exports: `import { desc, eq } from '@qco/db'` (query helpers), `import { client } from '@qco/db/client'` (Neon Postgres client), `import { Product, Post, users } from '@qco/db/schema'` (schemas).
  - `/packages/lib`: Utility functions, including AWS S3 operations (e.g., `uploadToS3`).
- **/tooling**: Configurations for **BiomeJS**, TypeScript, etc.

Dependencies are managed via `bun.lockb` and `package.json`.

---

## Design System and UI Components
The project follows a **Shadcn/ui-based design system** with a comprehensive component library in `@qco/ui`:

### Core Design Principles
- **Consistency**: Unified design tokens, spacing, and typography across all applications
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA attributes and keyboard navigation
- **Responsive**: Mobile-first design with Tailwind CSS 4 breakpoints
- **Theming**: Support for light/dark modes using CSS custom properties
- **Performance**: Optimized components with minimal bundle impact

### Component Library (`@qco/ui`)
All visual components are centralized in the `@qco/ui` package:

```ts
// Import common components
import { 
  Button, 
  Card, 
  Input, 
  Label, 
  Badge, 
  Alert,
  Dialog,
  DropdownMenu,
  Select,
  Tabs,
  Toast
} from '@qco/ui';
```

### Component Categories
- **Layout**: Card, Container, Grid, Stack, Divider
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch
- **Navigation**: Button, Link, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Progress, Skeleton, Spinner
- **Data Display**: Badge, Avatar, Table, List
- **Overlay**: Dialog, Drawer, Popover, Tooltip
- **Typography**: Heading, Text, Label, Code

### Usage Guidelines
- **Always import from `@qco/ui`**: Never create duplicate components
- **Compose components**: Combine multiple components for complex UIs
- **Extend with variants**: Use Tailwind classes for custom styling
- **Follow patterns**: Maintain consistent spacing, sizing, and interactions
- **Test accessibility**: Ensure keyboard navigation and screen reader support

### Component Guidelines
- **Small and Focused**: Each component must have a single responsibility and should be as small as possible.
- **One Component — One File**: Every React component must be defined in its own separate file. Do not place multiple components in a single file, even if they are small or related.
- **Extract UI Sections**: If a component contains several distinct UI sections or logical blocks, extract each section into its own dedicated component file.
- **No Unrelated UI Blocks Together**: Never keep multiple unrelated UI blocks or components in the same file.
- **Compose Complex UIs**: Build complex interfaces only by composing small, focused components from separate files.

---

## Code Style and Standards
- **TypeScript**: Strict typing, avoid `any`.
- **BiomeJS**: Run `bun lint` per `biome.json`.
- **File Naming**: Kebab-case (e.g., `product-card.tsx`, `cart-router.ts`).
- **Folder Structure**: Feature-based in `/apps/web/features` and `/apps/app/features`.
- **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(product): add product search`, `fix(cart): resolve checkout bug`).
- **Documentation**: Update `/docs` with e-commerce examples (e.g., payment gateway integration).
- **Frontend Components**: Components on the frontend must be small and focused, each located in its own file. Avoid creating large, monolithic components—split UI into small, reusable pieces for better maintainability and scalability.
- **Forms**: Use `react-hook-form` for all forms on the frontend to ensure consistency, type safety, and better integration with validation schemas.
- **Validation Schemas**: Use the same Zod schemas on both frontend and backend. Import schemas from `/packages/web-validators` (for web) and `/packages/validators` (for app) to guarantee unified validation and type safety across the stack.
- **Server Data Preparation**: The server must prepare and return clear, frontend-ready data structures. All necessary transformations and formatting should be performed on the server, so that the frontend receives data in the exact shape it needs, with no additional field transformations required on the client.

### Frontend Component Size and Structure

- All frontend components must be small, focused, and maintain a single responsibility.
- Each logical UI part should be placed in its own file.
- Large or complex components must be split into multiple smaller components, each in a separate file.
- Reuse and compose these small components to build more complex UIs.
- Avoid monolithic files: if a component exceeds ~100 lines or contains multiple UI blocks, refactor it into smaller parts.
- Place all feature-specific components in the corresponding `/features/feature-name/components/` directory.
- Shared UI elements should be moved to `/packages/ui` for reuse across the project.

#### Example

Instead of:

```tsx
// BAD: Large, monolithic component
export function ProductPage() {
  // ... 200+ lines of mixed UI logic ...
}
```

Do:

```tsx
// GOOD: Split into small, focused components
import { ProductHeader } from './components/product-header';
import { ProductGallery } from './components/product-gallery';
import { ProductDetails } from './components/product-details';

export function ProductPage() {
  return (
    <>
      <ProductHeader />
      <ProductGallery />
      <ProductDetails />
    </>
  );
}
```

---

## Modularity Principles
- **Feature-Based Organization**: Group code in `/features` (e.g., `/features/product` for product-related logic).
- **Single Responsibility**: Each file/module has one purpose.
- **Reusable Code**: Share UI in `/packages/ui`, S3 utilities in `/packages/lib`, database utilities in `/packages/db`.
- **Type Safety**: Use **Zod/v4** schemas from `/packages/web-validators` (demo) and `/packages/validators` (app).
- **Feature Flags**: Use environment variables or `@t3-oss/env-core` for experimental features.
- **Decoupled Logic**: Keep business logic in `/packages/web-api`, `/packages/api`, or `/packages/lib`.

---

## Development Workflow
1. **Setup**:
   - Install: `bun install`.
   - Configure `.env.local` from `.env.example` (e.g., Neon Postgres, AWS S3, payment gateways).
   - Set up **Neon Postgres** via Neon's CLI or dashboard.
   - Configure AWS S3 for `/packages/lib`.
2. **Run Locally**:
   - Start: `bun turbo run dev`.
   - Verify Neon Postgres via `/packages/db/client`.
3. **Build**:
   - Build: `bun turbo run build`.
   - Optimize for **Next.js 15** and **React 17**.
4. **Lint and Format**:
   - Run `bun lint`.

---

## Database and API
- **Database**: **Drizzle ORM** with **Neon Postgres**.
  - Imports: `import { desc, eq } from '@qco/db'`, `import { client } from '@qco/db/client'`, `import { Product, Post, users } from '@qco/db/schema'`.
  - Use **Drizzle Queries** (e.g., `ctx.db.query.Product.findMany` in `/packages/web-api`, `db.query.Order.findFirst` in `/packages/api`).
  - Access database via `ctx.db` in `/packages/web-api`, `db` in `/packages/api`.
- **Data Schema Preparation**: 
  - **Server-side data preparation**: All data transformations, formatting, and schema preparation must be done on the server side. The frontend should receive data in the exact shape it needs, with no additional field transformations required on the client.
  - **Unified schema**: Use a single, unified schema stored in `@qco/web-validators` for the web project. This ensures consistency between frontend and backend validation.
  - **No frontend transformations**: Avoid any data manipulation, formatting, or schema transformations on the frontend. All necessary data processing should be completed on the server before sending to the client.
  - **Type safety**: Import schemas from `/packages/web-validators` (for web) and `/packages/validators` (for app) to guarantee unified validation and type safety across the stack.
- **tRPC Router Organization**:
  - **Separate Files**: Each tRPC router must be placed in its own file for better maintainability and organization.
  - **Dedicated Folders**: All tRPC routers should be organized in dedicated folders within the API packages.
  - **File Structure**:
    ```
    /packages/web-api/
    ├── src/
    │   ├── router/
    │   │   ├── product/
    │   │   │   ├── index.ts              # Main product router
    │   │   │   ├── list.ts               # Product list query
    │   │   │   ├── get-by-id.ts          # Get product by ID
    │   │   │   ├── create.ts             # Create product mutation
    │   │   │   ├── update.ts             # Update product mutation
    │   │   │   ├── delete.ts             # Delete product mutation
    │   │   │   └── types.ts              # Product-specific types
    │   │   ├── cart/
    │   │   │   ├── index.ts
    │   │   │   ├── get-items.ts
    │   │   │   ├── add-item.ts
    │   │   │   ├── remove-item.ts
    │   │   │   └── clear.ts
    │   │   └── index.ts                  # Root router
    │   └── trpc.ts                       # tRPC configuration
    ```
  - **Naming Convention**: 
    - **Folders**: kebab-case (e.g., `product-management`, `user-profile`)
    - **Files**: kebab-case (e.g., `get-by-id.ts`, `create-product.ts`)
  - **Router Composition**: Import and compose routers in the main router file.

### tRPC Route Naming Best Practices
- **Query Routes** (Read operations):
  - `list` - Get paginated list of items
  - `getById` - Get single item by ID
  - `getBySlug` - Get single item by slug
  - `search` - Search items with filters
  - `getCount` - Get total count of items
  - `getStats` - Get statistics/analytics
  - `getOptions` - Get dropdown options
  - `getRelated` - Get related items

- **Mutation Routes** (Write operations):
  - `create` - Create new item
  - `update` - Update existing item
  - `delete` - Delete item
  - `bulkCreate` - Create multiple items
  - `bulkUpdate` - Update multiple items
  - `bulkDelete` - Delete multiple items
  - `toggle` - Toggle boolean field
  - `duplicate` - Duplicate existing item

- **Action Routes** (Complex operations):
  - `addToCart` - Add item to cart
  - `removeFromCart` - Remove item from cart
  - `updateQuantity` - Update item quantity
  - `applyDiscount` - Apply discount code
  - `processPayment` - Process payment
  - `sendNotification` - Send notification
  - `exportData` - Export data
  - `importData` - Import data

- **Naming Rules**:
  - Use **lowerCamelCase** for all route names
  - Be **descriptive** and **action-oriented**
  - Use **verbs** for mutations and actions
  - Use **nouns** for queries when appropriate
  - Keep names **concise** but **clear**
  - Avoid abbreviations unless widely understood
  - Use **consistent** patterns across similar operations


- **APIs**:
  - **/packages/web-api**: tRPC routers for `/apps/web` with **Zod/v4** from `/packages/web-validators`. Use `satisfies TRPCRouterRecord` and direct **Drizzle Queries** returns.
  - **/packages/api**: APIs for `/apps/app` (preferably tRPC) with **Zod/v4** from `/packages/validators`.
  - Example:
    ```ts
    // /packages/web-api/src/router/product/index.ts
    import type { TRPCRouterRecord } from '@trpc/server';
    import { list } from './list';
    import { getById } from './get-by-id';
    import { create } from './create';
    import { update } from './update';
    import { deleteProduct } from './delete';

    export const productRouter = {
      list,
      getById,
      create,
    } satisfies TRPCRouterRecord;

    // /packages/web-api/src/router/product/list.ts
    import { z } from 'zod/v4';
    import { desc } from '@qco/db';
    import { Product } from '@qco/db/schema';
    import { publicProcedure } from '../../trpc';

    export const list = publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(({ ctx, input }) =>
        ctx.db.query.Product.findMany({
          orderBy: desc(Product.id),
          limit: input.limit,
        }),
      );

    // /packages/web-api/src/router/product/get-by-id.ts
    import { z } from 'zod/v4';
    import { eq } from '@qco/db';
    import { Product } from '@qco/db/schema';
    import { publicProcedure } from '../../trpc';

    export const getById = publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ ctx, input }) =>
        ctx.db.query.Product.findFirst({
          where: eq(Product.id, input.id),
        }),
      );

    // /packages/web-api/src/router/index.ts
    import { productRouter } from './product';
    import { cartRouter } from './cart';
    import { userRouter } from './user';

    export const appRouter = {
      product: productRouter,
      cart: cartRouter,
      user: userRouter,
    };
    ```

---

## Authentication
- Use **Better Auth** in `/packages/web-auth` for `/apps/web` (e.g., customer logins).
- For `/apps/app`, implement authentication in `/packages/api` (e.g., admin access).
- Use `protectedProcedure` for authenticated routes.
- Support OAuth providers in `/packages/web-auth`.

---

## UI Components
- **Design System**: Follow **Shadcn/ui** design principles and patterns for consistent, accessible, and modern UI components.
- **Component Library**: Use shared components from `@qco/ui` package for all visual elements across the platform.
- **Component Organization**: 
  - Build reusable components in `/packages/ui` with **Shadcn/ui** and **Tailwind CSS 4**.
  - Organize feature-specific components in `/apps/web/features` and `/apps/app/features`.
  - Import common components: `import { Button, Card, Input } from '@qco/ui'`.
- **Design Principles**:
  - **Consistency**: Use Shadcn/ui design tokens and spacing system.
  - **Accessibility**: Ensure ARIA attributes, keyboard navigation, and screen reader support.
  - **Responsive Design**: Mobile-first approach with Tailwind CSS 4 breakpoints.
  - **Dark Mode**: Support both light and dark themes using CSS variables.
- **Component Guidelines**:
  - **Small and Focused**: Each component should have a single responsibility.
  - **Composable**: Design components to work together seamlessly.
  - **Customizable**: Use CSS variables and Tailwind classes for theming.
  - **Type Safe**: Full TypeScript support with proper prop interfaces.
- **Form Components**: Use `react-hook-form` with Shadcn/ui form components for consistency.
- **State Management**: Use **React 17** patterns with proper state isolation.

### Creating Custom Components
When building feature-specific components, compose them from `@qco/ui` components:

```tsx
// /apps/web/features/product/components/product-card.tsx
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Button,
  Image
} from '@qco/ui';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
  };
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {product.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            ${product.price.toFixed(2)}
          </Badge>
        </div>
        
        {product.category && (
          <p className="text-sm text-muted-foreground mb-3">
            {product.category}
          </p>
        )}
        
        {onAddToCart && (
          <Button 
            onClick={() => onAddToCart(product.id)}
            className="w-full"
            size="sm"
          >
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```



## Monorepo Management
- Run tasks: `bun turbo run <command>`.
- Use workspace references in `package.json`.
- Leverage TurboRepo caching.

---

## Submitting Contributions
Contribute to enhance e-commerce features, fix bugs, or improve performance:
1. Fork and branch: `git checkout -b feat/my-feature`.
2. Follow [Code Style and Standards](#code-style-and-standards).
3. Submit a PR with a clear description.
4. Ensure CI passes.
5. Engage via GitHub Discussions.

---

## Example Contribution
### Adding a Product Feature
1. **Zod Schema** (`/packages/web-validators/product.ts`):
   ```ts
   import { z } from 'zod/v4';

   export const productInput = z.object({
     limit: z.number().default(10),
   });

   export const productIdInput = z.object({
     id: z.string(),
   });

   export const createProductInput = z.object({
     name: z.string(),
     price: z.number(),
     description: z.string().optional(),
     imageKey: z.string().optional(),
   });
   ```

2. **tRPC Router Structure**:

   **Main Router** (`/packages/web-api/src/router/product/index.ts`):
   ```ts
   import type { TRPCRouterRecord } from '@trpc/server';
   import { list } from './list';
   import { getById } from './get-by-id';
   import { create } from './create';
   import { update } from './update';
   import { deleteProduct } from './delete';

   export const productRouter = {
     list,
     getById,
     create,
   } satisfies TRPCRouterRecord;
   ```

   **List Query** (`/packages/web-api/src/router/product/list.ts`):
   ```ts
   import { desc } from '@qco/db';
   import { Product } from '@qco/db/schema';
   import { productInput } from '@qco/web-validators/product';
   import { publicProcedure } from '../../trpc';

   export const list = publicProcedure
     .input(productInput)
     .query(({ ctx, input }) =>
       ctx.db.query.Product.findMany({
         orderBy: desc(Product.id),
         limit: input.limit,
       }),
     );
   ```

   **Get By ID Query** (`/packages/web-api/src/router/product/get-by-id.ts`):
   ```ts
   import { z } from 'zod/v4';
   import { eq } from '@qco/db';
   import { Product } from '@qco/db/schema';
   import { publicProcedure } from '../../trpc';

   export const getById = publicProcedure
     .input(z.object({ id: z.string() }))
     .query(({ ctx, input }) =>
       ctx.db.query.Product.findFirst({
         where: eq(Product.id, input.id),
       }),
     );
   ```

   **Create Mutation** (`/packages/web-api/src/router/product/create.ts`):
   ```ts
   import { Product } from '@qco/db/schema';
   import { createProductInput } from '@qco/web-validators/product';
   import { protectedProcedure } from '../../trpc';

   export const create = protectedProcedure
     .input(createProductInput)
     .mutation(({ ctx, input }) => ctx.db.insert(Product).values(input));
   ```

   **Delete Mutation** (`/packages/web-api/src/router/product/delete.ts`):
   ```ts
   import { z } from 'zod/v4';
   import { eq } from '@qco/db';
   import { Product } from '@qco/db/schema';
   import { protectedProcedure } from '../../trpc';

   export const deleteProduct = protectedProcedure
     .input(z.string())
     .mutation(({ ctx, input }) => ctx.db.delete(Product).where(eq(Product.id, input)));
   ```

3. **Frontend Component** (`/apps/web/features/product/components/product-form.tsx`):
   ```ts
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { useTRPC } from '@/lib/trpc';
   import { createProductInput } from '@qco/web-validators/product';
   import { useState } from 'react';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { 
     Button, 
     Card, 
     CardContent, 
     CardHeader, 
     CardTitle,
     Input,
     Label,
     Textarea,
     Alert,
     AlertDescription
   } from '@qco/ui';

   export function ProductForm() {
     const queryClient = useQueryClient();
     const trpc = useTRPC();

     const form = useForm({
       resolver: zodResolver(createProductInput),
       defaultValues: {
         name: '',
         price: 0,
         description: '',
       },
     });

     const { mutate, error, isPending } = useMutation(
       trpc.product.create.mutationOptions({
         async onSuccess() {
           form.reset();
           await queryClient.invalidateQueries(trpc.product.all.queryFilter());
         },
       }),
     );

     const onSubmit = (data: any) => {
       mutate(data);
     };

     return (
       <Card className="w-full max-w-md">
         <CardHeader>
           <CardTitle>Create New Product</CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {error && (
               <Alert variant="destructive">
                 <AlertDescription>{error.message}</AlertDescription>
               </Alert>
             )}
             
             <div className="space-y-2">
               <Label htmlFor="name">Product Name</Label>
               <Input
                 id="name"
                 {...form.register('name')}
                 placeholder="Enter product name"
               />
               {form.formState.errors.name && (
                 <p className="text-sm text-destructive">
                   {form.formState.errors.name.message}
                 </p>
               )}
             </div>

             <div className="space-y-2">
               <Label htmlFor="price">Price</Label>
               <Input
                 id="price"
                 type="number"
                 step="0.01"
                 {...form.register('price', { valueAsNumber: true })}
                 placeholder="0.00"
               />
               {form.formState.errors.price && (
                 <p className="text-sm text-destructive">
                   {form.formState.errors.price.message}
                 </p>
               )}
             </div>

             <div className="space-y-2">
               <Label htmlFor="description">Description</Label>
               <Textarea
                 id="description"
                 {...form.register('description')}
                 placeholder="Enter product description"
                 rows={3}
               />
               {form.formState.errors.description && (
                 <p className="text-sm text-destructive">
                   {form.formState.errors.description.message}
                 </p>
               )}
             </div>

             <Button type="submit" className="w-full" disabled={isPending}>
               {isPending ? 'Creating...' : 'Create Product'}
             </Button>
           </form>
         </CardContent>
       </Card>
     );
   }
   ```

4. **S3 Integration** (`/apps/web/features/product/hooks/use-product-image-upload.ts`):
   ```ts
   import { useMutation } from '@tanstack/react-query';
   import { uploadToS3 } from '@qco/lib';

   export function useProductImageUpload() {
     return useMutation({
       mutationFn: async ({ file, key }: { file: Buffer; key: string }) => {
         return uploadToS3(file, key);
       },
     });
   }
   ```

5. **App Router Structure**:

   **Main Router** (`/packages/api/src/router/product/index.ts`):
   ```ts
   import type { TRPCRouterRecord } from '@trpc/server';
   import { getById } from './get-by-id';

   export const productRouter = {
     getById,
   } satisfies TRPCRouterRecord;
   ```

   **Get By ID Query** (`/packages/api/src/router/product/get-by-id.ts`):
   ```ts
   import { eq } from '@qco/db';
   import { Product } from '@qco/db/schema';
   import { productIdInput } from '@qco/validators/product';
   import { publicProcedure } from '../../trpc';

   export const getById = publicProcedure
     .input(productIdInput)
     .query(({ input }) =>
       db.query.Product.findFirst({
         where: eq(Product.id, input.id),
       }),
     );
   ```

6. **App Component** (`/apps/app/features/product/components/product-detail.tsx`):
   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { useTRPC } from '@/lib/trpc';
   import { productIdInput } from '@qco/validators/product';
   import { 
     Card, 
     CardContent, 
     CardHeader, 
     CardTitle,
     Badge,
     Separator,
     Skeleton
   } from '@qco/ui';

   export function ProductDetail({ id }: { id: string }) {
     const trpc = useTRPC();
     const queryOptions = trpc.product.getById.queryOptions(productIdInput.parse({ id }), {
       staleTime: 1000,
     });
     const { data, isLoading, error } = useQuery(queryOptions);

     if (isLoading) {
       return (
         <Card className="w-full max-w-md">
           <CardHeader>
             <Skeleton className="h-6 w-3/4" />
           </CardHeader>
           <CardContent className="space-y-4">
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-4 w-3/4" />
           </CardContent>
         </Card>
       );
     }

     if (error || !data) {
       return (
         <Card className="w-full max-w-md">
           <CardContent className="p-6 text-center">
             <p className="text-muted-foreground">Product not found</p>
           </CardContent>
         </Card>
       );
     }

     return (
       <Card className="w-full max-w-md">
         <CardHeader>
           <CardTitle className="flex items-center justify-between">
             {data.name}
             <Badge variant="secondary">
               ${data.price.toFixed(2)}
             </Badge>
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           {data.description && (
             <>
               <Separator />
               <p className="text-sm text-muted-foreground">
                 {data.description}
               </p>
             </>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

---

Thank you for contributing to this open-source Shopify alternative! Join our community on GitHub Discussions to share ideas or propose features.