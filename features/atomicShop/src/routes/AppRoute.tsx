import { AdminLayout } from "@/components/custom/admin/layout/AdminLayout"
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage"
import { DashboardPage } from "@/modules/DashBoard/page/DashBoardPage"

import { AuthLayout } from "@/modules/Login/layout/AuthLayout"
import CreatePasswordPage from "@/modules/Login/pages/CreatePasswordPage"
import { ForgotPasswordPage } from "@/modules/Login/pages/ForgetPassword"
import { LoginPage } from "@/modules/Login/pages/LoginPage"
import SuccessPage from "@/modules/Login/pages/SuccesPage"
import { createBrowserRouter } from "react-router"


export const appRouter = createBrowserRouter([
    {
        //todas las rutas que tengan el /admin/ mostraran el layout que es donde esta el fondo el cual es el mismo para todas las paginas
        //asi solo hereda el children que es el que mostrar pero siempre estando en el layout
        path: "/admin/",
        element: <AuthLayout />,
        children: [
            {
                path: "login", // Si la dirección termina en /login, muestra el formulario de entrada
                element: <LoginPage />
            },
            {
                path: "ForgetPassword", // Si termina en /ForgetPassword, muestra recuperación de clave
                element: <ForgotPasswordPage />
            },
            {
                path: "createpassword", // si termina en /createpassword, muestra la creacion de contraseña - proximamente se validara con un store que el codigo de verificacion si se haya enviado
                element: <CreatePasswordPage />
            },
            {
                path: "succeschangepassword",
                element: <SuccessPage />
            }
        ]
    },
    {
        path: "/atomicAdmin", //Por defecto sera dirigido al DashBoard proximamente se validara utilizando un store
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />
            }
        ]
    },
    {
        path: "*", // Si escriben cualquier otra dirección que no existe, muestra "Error 404"
        element: <NotFoundPage />
    }
])

