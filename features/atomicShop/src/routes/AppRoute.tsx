import { AdminLayout } from "@/components/custom/admin/layout/AdminLayout"
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage"
import { DashboardPage } from "@/modules/DashBoard/page/DashBoardPage"
import { ProfilePage } from "@/modules/Profile/Page/ProfilePage"
import { ProductsPage } from "@/modules/Products/Page/ProductsPage"
import { AuthLayout } from "@/modules/Login/layout/AuthLayout"
import CreatePasswordPage from "@/modules/Login/pages/CreatePasswordPage"
import { ForgotPasswordPage } from "@/modules/Login/pages/ForgetPassword"
import { LoginPage } from "@/modules/Login/pages/LoginPage"
import SuccessPage from "@/modules/Login/pages/SuccesPage"
import { VerifyCodePage } from "@/modules/Login/pages/VerifyCodePage"
import { createBrowserRouter, Navigate } from "react-router"
import { EmployeePage } from "@/modules/employee/Pages/EmployeePage"
import { EmployeeForm } from "@/modules/employee/Pages/EmployeeForm"
import { ClientPage } from "@/modules/clients/pages/ClientPage"
import { ClientForm } from "@/modules/clients/pages/ClientForm"
import { SalePage } from "@/modules/sale/page/SalePage"
import { ProductRegisterForm } from "@/modules/Products/Page/CreateProductPage"
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./custom/ProtectedAdminRoutes"
import { AdminRoute } from "./custom/AdminRoute"

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />
            },
            {
                path: "login",
                element: <NotAuthenticatedRoute><LoginPage /></NotAuthenticatedRoute>
            },
            {
                path: "ForgetPassword",
                element: <ForgotPasswordPage />
            },
            {
                path: "verifycode",
                element: <VerifyCodePage />
            },
            {
                path: "createpassword",
                element: <CreatePasswordPage />
            },
            {
                path: "succeschangepassword",
                element: <SuccessPage />
            }
        ]
    },
    {
        path: "/atomicAdmin",
        element: <AuthenticatedRoute><AdminLayout /></AuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            },
            {
                path: "inventario",
                element: <ProductsPage />
            },
            {
                path: "inventario/nuevo",
                element: <ProductRegisterForm />
            },
            {
                path: "empleados",
                element: <AdminRoute><EmployeePage /></AdminRoute>
            },
            {
                path: "empleados/nuevo",
                element: <AdminRoute><EmployeeForm /></AdminRoute>
            },
            {
                path: "clientes",
                element: <AdminRoute><ClientPage /></AdminRoute>
            },
            {
                path: "clientes/nuevo",
                element: <AdminRoute><ClientForm /></AdminRoute>
            },
            {
                path: "ventas",
                element: <SalePage />
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
])
