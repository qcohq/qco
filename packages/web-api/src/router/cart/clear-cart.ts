import { db } from "@qco/db/client";
import { cartItems } from "@qco/db/schema";
import { clearCartSchema } from "@qco/web-validators";
import { eq } from "@qco/db";
import { publicProcedure } from "../../trpc";

export const clearCart = publicProcedure
  .input(clearCartSchema)
  .mutation(async ({ input }) => {
    const { cartId } = input;
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return true;
  });
