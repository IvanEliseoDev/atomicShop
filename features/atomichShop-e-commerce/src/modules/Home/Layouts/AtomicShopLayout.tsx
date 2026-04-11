import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";
import ButtonWhatsapp from "../Components/ButtonWhatsapp";

export const AtomicShopLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <>
        <Outlet />
      </>
      <Footer />
      <ButtonWhatsapp />
    </div>
  );
};
