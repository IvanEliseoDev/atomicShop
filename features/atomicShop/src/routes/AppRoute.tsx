// Estas son importaciones que ayudan a importar componentes y a si mostrarlos en una pagina
/**
 * COMPONENTS
 */
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
import { createBrowserRouter } from "react-router"
import { EmployeePage } from "@/modules/employee/Pages/EmployeePage"
import { EmployeeForm } from "@/modules/employee/Pages/EmployeeForm"
import { ProviderPage } from "@/modules/provider/providerPage"
import { ProviderForm } from "@/modules/provider/pages/ProviderRegisterForm"
import { ClientPage } from "@/modules/clients/pages/ClientPage"
import { SalePage } from "@/modules/sale/page/SalePage"
import { ShoppingPage } from "@/modules/shopping/pages/ShoppingPage"
import { OrderPage } from "@/modules/orders/pages/OrderPage"
import { CustomerRegistrationForm } from "@/modules/clients/pages/ClientForm"
import { OrderRegisterForm } from "@/modules/orders/pages/OrderRegisterForm"
import { SalesRegisterForm } from "@/modules/sale/page/SalesRegisterForm"
import { ProductRegisterForm } from "@/modules/Products/Page/CreateProductPage"
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./custom/ProtectedAdminRoutes"
import { AdminRoute } from "./custom/AdminRoute"


export const appRouter = createBrowserRouter([
    {
        //todas las rutas que tengan el /admin/ mostraran el layout que es donde esta el fondo el cual es el mismo para todas las paginas
        //asi solo hereda el children que es el que mostrar pero siempre estando en el layout
        path: "/",
        element: <AuthLayout /> ,
        children: [
            {
                path: "login", // Si la dirección termina en /login, muestra el formulario de entrada
                element: <NotAuthenticatedRoute> <LoginPage /> </NotAuthenticatedRoute>
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
        // path: Lo que hacemos es que creamos una ruta que se podra ver en el navegador, y con la cual podremos utilziar para poder navegar entre modulos
        // Ya que cada modulo tendra su propia ruta.
        // Ejemplo: /atomicAdmin/procfile (a qui estamos accediendo al componente de mi perfil y a si haremos para otros componenetes, como los del Sidebar.tsx puedan permitir al usuario comunicarse entre modulos)
        // Y como ya emos creado las rutas, entonces solo las debemos de referenciar con el atributo path: para hacer que envien al usuario a distintos modulos que querramos
        // E incluso a qui manipularemos los permisos por usuario, ya que podremos validar roles y permitir o no rutas que no son permitidas para usuarios especificos.
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
                path: 'inventario',
                element: <ProductsPage />
            },
            {
                path: 'inventario/nuevo',
                element: <ProductRegisterForm />
            },
            {
                path: 'empleados',
                element: <AdminRoute><EmployeePage /></AdminRoute>
            },
            {
                path: 'empleados/nuevo',
                element: <AdminRoute><EmployeeForm /></AdminRoute>
            },
            {
                path: 'proveedores',
                element: <AdminRoute><ProviderPage /></AdminRoute>
            },
            {
                path: 'proveedores/nuevo',
                element: <AdminRoute><ProviderForm /></AdminRoute>
            },
            {
                path: 'clientes',
                element: <AdminRoute><ClientPage /></AdminRoute>
            },
            {
                path: 'clientes/nuevo',
                element: <AdminRoute><CustomerRegistrationForm /></AdminRoute>
            },
            {
                path: "ventas",
                element: <SalePage />
            },
            {
                path: "ventas/nuevo",
                element: <SalesRegisterForm />
            },
            {
                path: "compras",
                element: <ShoppingPage />
            },
            {
                path: "pedidos",
                element: <OrderPage />
            },
            {
                path: "pedidos/nuevo",
                element: <OrderRegisterForm />
            }
        ]
    },
    {
        path: "*", // Si escriben cualquier otra dirección que no existe, muestra "Error 404"
        element: <NotFoundPage />
    }
])

