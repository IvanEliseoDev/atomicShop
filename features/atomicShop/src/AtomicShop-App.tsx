import { RouterProvider } from "react-router";
import { appRouter } from "./routes/AppRoute";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/auth/store/auth.store";

export const queryClient = new QueryClient();

export const AtomicShopApp = () => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
};
