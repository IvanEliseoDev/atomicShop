import { RouterProvider } from "react-router"
import { appRouter } from "./Routes/AppRoutes"
import { Toaster } from "sonner"
import { CartProvider } from "./lib/CartContext";
import { AuthProvider } from "./lib/AuthContext";

export const AtomicShopEcommerce = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Toaster richColors />
                <RouterProvider router={appRouter} />
            </CartProvider>
        </AuthProvider>
    )
}