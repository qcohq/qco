import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import { OrderDetails } from "@/features/user-auth/components/order-details";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";

interface OrderPageProps {
    params: {
        orderId: string;
    };
}

export default function OrderPage({ params }: OrderPageProps) {
    return (
        <AuthGuard>
            <div className="min-h-screen">
                <main className="container mx-auto px-4 py-8">
                    <ProfileLayout>
                        <OrderDetails orderId={params.orderId} />
                    </ProfileLayout>
                </main>
            </div>
        </AuthGuard>
    );
} 