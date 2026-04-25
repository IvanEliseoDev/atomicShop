import React from "react";
import Navbar from "../../Home/Components/Navbar";
import Footer from "../../Home/Components/Footer";
import { ProfileHeader } from "../Components/ProfileHeader";
import { PurchaseHistory } from "../Components/PurchaseHistory";

export const ManageProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6]">

      <main className="flex-grow py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-gray-800 text-lg font-medium mb-6 ml-2">
            Administrar perfil
          </h1>

          {/* Tarjeta de Información Personal */}
          <div className="mb-10">
            <ProfileHeader />
          </div>

          {/* Tabla de Historial de Compras */}
          <div className="mb-20">
            <PurchaseHistory />
          </div>
        </div>
      </main>
    </div>
  );
};
