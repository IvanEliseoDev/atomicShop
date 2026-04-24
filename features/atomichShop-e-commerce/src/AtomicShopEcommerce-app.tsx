import { RouterProvider } from "react-router"
import { appRouter } from "./Routes/AppRoutes"
import { Toaster } from "sonner"
import { CartProvider } from "./lib/CartContext";

export const AtomicShopEcommerce = () => {
    return (
        <CartProvider>
            <Toaster richColors />
            <RouterProvider router={appRouter} />
        </CartProvider>
    )
}