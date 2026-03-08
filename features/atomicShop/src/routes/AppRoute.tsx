import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage"
import { DashBoardPage } from "@/modules/DashBoard/page/DashBoardPage"
import { LoginPage } from "@/modules/Login/pages/LoginPage"
import { createBrowserRouter } from "react-router"


export const appRouter = createBrowserRouter([
    {
        path: "/admin/login",
        element: <LoginPage />
    },
    {
        index: true,
        element: <DashBoardPage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
])

