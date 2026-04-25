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
import FirstUseAdmin from "@/modules/FirstUseAdmin/pages/FirstUSe"
import { ForgotPasswordAdminPage } from "@/modules/ForgotPasswordAdmin/pages/ForgotPasswordAdmin";
import { SendEmailAdmin } from "@/modules/SendEmailAdmin/pages/SendEmailAdmin";
import { ResetPasswordAdmin } from "@/modules/ResetPassword/pages/ResetPaswordAdmin";
import { SuccessResetAdmin } from "@/modules/SuccesResetAdmin/pages/SuccesResetAdmin";


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
              path: "ForgetPasswordAdmin",   
            element: <ForgotPasswordAdminPage />  // Si termina en /ForgetPassword, muestra recuperación de clave
            },
            {
                path: "createpassword", // si termina en /createpassword, muestra la creacion de contraseña - proximamente se validara con un store que el codigo de verificacion si se haya enviado
                element: <CreatePasswordPage />
            },
            {
                path: "FirstUseAdmin",
                element: <FirstUseAdmin />
            },
            {
                path: "succeschangepassword",
                element: <SuccessPage />
            },
            {
            path: "ForgetPasswordAdmin",
            element: <ForgotPasswordPage />
            },
            {
            path: "SendEmailAdmin",
            element: <SendEmailAdmin />
        },
        {
        path: "ResetPasswordAdmin",
        element: <ResetPasswordAdmin />
        },
        {
         path: "SuccessResetAdmin",
         element: <SuccessResetAdmin />
        },
        ]
    },
    {   
        // path: Lo que hacemos es que creamos una ruta que se podra ver en el navegador, y con la cual podremos utilziar para poder navegar entre modulos
        // Ya que cada modulo tendra su propia ruta.
        // Ejemplo: /atomicAdmin/procfile (a qui estamos accediendo al componente de mi perfil y a si haremos para otros componenetes, como los del Sidebar.tsx puedan permitir al usuario comunicarse entre modulos)
        // Y como ya emos creado las rutas, entonces solo las debemos de referenciar con el atributo path: para hacer que envien al usuario a distintos modulos que querramos
        // E incluso a qui manipularemos los permisos por usuario, ya que podremos validar roles y permitir o no rutas que no son permitidas para usuarios especificos.
        path: "/atomicAdmin",
        element: <AdminLayout />,
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
                element: <ProductsPage/>
            },
            {
                path: 'empleados',
                element: <EmployeePage/>
            },
            {
                path: 'empleados/nuevo',
                element: <EmployeeForm/>
            },
            {
                path: 'proveedores',
                element: <ProviderPage />
            },
            {
                path: 'proveedores/nuevo',
                element: <ProviderForm /> 
            },
            {
                path: 'clientes',
                element: <ClientPage />
            }
        ]
    },
    {
        path: "*", // Si escriben cualquier otra dirección que no existe, muestra "Error 404"
        element: <NotFoundPage />
    }
])

