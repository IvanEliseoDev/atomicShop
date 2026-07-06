import { createBrowserRouter } from "react-router";

import { LoginPage } from "@/modules/Login/Pages/LoginPage";
import { RegisterPage } from "@/modules/Register/Pages/RegisterPage";
import { RecoverPasswordPage } from "@/modules/RecoverPassword/Pages/RecoverPasswordPage";
import { VerifyEmailPage } from "@/modules/Register/Pages/VerifyEmailPage";
import { NotFoundPage } from "@/modules/404NotFound/page/404NotFoundPage";

import { AtomicShopLayout } from "@/modules/Home/Layouts/AtomicShopLayout";
import HomePage from "@/modules/Home/Pages/HomePage";
import Products from "@/modules/Products/Pages/Products";
import ProductDetail from "@/modules/Products/Pages/ProductDetail";
import DetalleCarritoCompras from "@/modules/CarShop/Pages/DetalleCarritoCompras";
import TerminosCondiciones from "@/modules/Terms/Pages/TerminosCondiciones";

import Favorites from "@/modules/Products/Pages/Favorites";
import DatosEntrega from "@/modules/CarShop/Pages/DatosEntrega";
import DatosPago from "@/modules/CarShop/Pages/DatosPago";
import { ManageProfilePage } from "@/modules/Profile/Pages/ManageProfilePerfil";

import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from "./Custom/ProtectedRoute";

export const appRouter = createBrowserRouter([
  /* ── Rutas públicas (solo cuando NO hay sesión) ── */
  {
    element: <NotAuthenticatedRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/recover-password", element: <RecoverPasswordPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  /* ── Layout principal con Navbar / Footer ── */
  {
    path: "/",
    element: <AtomicShopLayout />,
    children: [
      /* Rutas públicas dentro del layout */
      { index: true, element: <HomePage /> },
      { path: "productos", element: <Products /> },
      { path: "productos/:id", element: <ProductDetail /> },
      { path: "carrito", element: <DetalleCarritoCompras /> },
      { path: "terminos y condiciones", element: <TerminosCondiciones /> },

      /* Rutas protegidas (requieren sesión) dentro del mismo layout */
      {
        element: <AuthenticatedRoute />,
        children: [
          { path: "favoritos", element: <Favorites /> },
          { path: "perfil", element: <ManageProfilePage /> },
          { path: "carrito/datos-entrega", element: <DatosEntrega /> },
          { path: "carrito/datos-pago", element: <DatosPago /> },
        ],
      },
    ],
  },

  /* ── 404 ── */
  { path: "*", element: <NotFoundPage /> },
]);
