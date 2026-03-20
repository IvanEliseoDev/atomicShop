import { LoginPage } from "@/modules/Login/Pages/LoginPage";
import { createBrowserRouter } from "react-router";
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage"
import HomePage from "@/modules/Home/Pages/HomePage";

export const appRouter = createBrowserRouter([
  {
    path: "/login/",
    // element: <Login> cuando se cree el componente Login,
    children: [
      {
        index: true, // Esto hace que cuando se habra solo la ruta /login, se va a mostrar este componete por defecto
        element: <LoginPage/>,
      },
    ],
  },

  {
    path: "/atomicShop",
    element: <HomePage/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      // {
      //   path: "nosotros",
      //   element: <Abouts/>
      // },
      // {
      //   path: "contactanos",
      //   element: <Contact/>
      // },
      // {
      //   path: "productos",
      //   element: <Products/>
      // },
      // {
      //   path: "favoritos",
      //   element: <Favorites/>
      // },
      // {
      //   path: "carrito",
      //   element: <Cart/>
      // },
    ]
  },

  {
    path: "*",
    element: <NotFoundPage/>
  }
]);
