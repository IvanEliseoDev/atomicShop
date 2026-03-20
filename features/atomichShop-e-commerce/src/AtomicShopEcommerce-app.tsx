import { RouterProvider } from "react-router"
import { appRouter } from "./Routes/AppRoutes"
import { Toaster } from "sonner"

export const AtomicShopEcommerce = () => {
    return (
        <>
            <Toaster richColors />
            <RouterProvider router={appRouter} />
        </>
    )
}
