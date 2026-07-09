import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { appRouter } from "./Routes/AppRoutes";
import { AuthProvider } from "./lib/AuthContext";
import { CartProvider } from "./lib/CartContext";
import { FavoritesProvider } from "./lib/FavoritesContext";
import { ProductDetailProvider } from "./lib/ProductDetailContext";

export const AtomicShopEcommerce = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ProductDetailProvider>
            <Toaster richColors position="top-right" />
            <RouterProvider router={appRouter} />
          </ProductDetailProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};
