import { LoginPage } from "@/modules/Login/Pages/LoginPage";
import { createBrowserRouter } from "react-router";
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage";
// Importamos los apartados que pueden acceder los usuarios
import HomePage from "@/modules/Home/Pages/HomePage";
import Products from "@/modules/Products/Pages/Products";
import Favorites from "@/modules/Products/Pages/Favorites";
import Cart from "@/modules/CarShop/Pages/Cart";
import { AtomicShopLayout } from "@/modules/Home/Layouts/AtomicShopLayout";

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
        element: <Cart />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
