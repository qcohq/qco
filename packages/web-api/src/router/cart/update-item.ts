import { db } from "@qco/db/client";
import { cartItems } from "@qco/db/schema";
import { updateItemSchema } from "@qco/web-validators";
import { eq } from "@qco/db";
import { publicProcedure } from "../../trpc";

export const updateItem = publicProcedure
  .input(updateItemSchema)
  .mutation(async ({ input }) => {
    const { cartItemId, quantity } = input;
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));
    return true;
  });
