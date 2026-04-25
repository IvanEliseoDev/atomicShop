import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";
import ButtonWhatsapp from "../Components/ButtonWhatsapp";
import CartSidebar from "../Components/CartSidebar";

export const AtomicShopLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartSidebar />
      <>
        <Outlet />
      </>
      <Footer />
      <ButtonWhatsapp />
    </div>
  );
};
