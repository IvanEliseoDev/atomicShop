import { LoginPage } from "@/modules/Login/Pages/LoginPage";
import { createBrowserRouter } from "react-router";
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage";
// Importamos los apartados que pueden acceder los usuarios
import HomePage from "@/modules/Home/Pages/HomePage";
import Products from "@/modules/Products/Pages/Products";
import Favorites from "@/modules/Products/Pages/Favorites";
import DetalleCarritoCompras from "@/modules/CarShop/Pages/DetalleCarritoCompras";
import { AtomicShopLayout } from "@/modules/Home/Layouts/AtomicShopLayout";
import DatosEntrega from "@/modules/CarShop/Pages/DatosEntrega";
import DatosPago from "@/modules/CarShop/Pages/DatosPago";

export const appRouter = createBrowserRouter([
  {
    path: "/login/",
    // element: <Login> cuando se cree el componente Login,
    children: [
      {
        index: true, // Esto hace que cuando se habra solo la ruta /login, se va a mostrar este componete por defecto
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/atomicShop/",
    element: <AtomicShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "productos",
        element: <Products />,
      },
      {
        path: "favoritos",
        element: <Favorites />,
      },
      {
        path: "carrito",
        element: <DetalleCarritoCompras />,
      },
      {
        path: "carrito/datos-entrega",
        element: <DatosEntrega />,
      },
      {
        path: "carrito/datos-pago",
        element: <DatosPago />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
