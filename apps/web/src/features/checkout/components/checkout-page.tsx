'use client'
import CheckoutPageClient from "./checkout-page-client";
import { useCart } from "~/features/cart/hooks/use-cart";
import { CheckoutSkeleton } from "./checkout-skeleton";

const CheckoutPage = () => {
    const { cart, isLoading: isCartLoading } = useCart();

    if (isCartLoading || (!cart?.id && !cart?.sessionId)) {
        return <CheckoutSkeleton />;
    }

    return <CheckoutPageClient cart={cart} />;
};

export default CheckoutPage;