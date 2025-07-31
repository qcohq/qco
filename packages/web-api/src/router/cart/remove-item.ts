import { db } from "@qco/db/client";
import { cartItems } from "@qco/db/schema";
import { removeItemSchema } from "@qco/web-validators";
import { eq } from "@qco/db";
import { publicProcedure } from "../../trpc";

export const removeItem = publicProcedure
  .input(removeItemSchema)
  .mutation(async ({ input }) => {
    const { cartItemId } = input;
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
    return true;
  });
