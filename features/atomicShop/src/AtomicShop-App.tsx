import { RouterProvider } from "react-router"
import { appRouter } from "./routes/AppRoute"

export const AtomicShopApp = () => {
    return (
        <RouterProvider router={appRouter} />
    )
}
