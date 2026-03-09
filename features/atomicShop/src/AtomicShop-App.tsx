import { RouterProvider } from "react-router"
import { appRouter } from "./routes/AppRoute"
import { Toaster } from "sonner"

export const AtomicShopApp = () => {
    return (
        <>
            <Toaster richColors />
            <RouterProvider router={appRouter} />
        </>
    )
}
