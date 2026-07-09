import React from "react";
import { useProviderCarts } from "../hooks/useProviderCarts";

interface Provider {
  id: string;
  name: string;
  img: string;
}

const ProviderCard: React.FC<Provider> = ({ name, img }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-4 hover:shadow-md transition">
    <img src={img} alt={name} className="w-full h-16 object-contain" />
  </div>
);

function ProviderCarts() {
  const { providers } = useProviderCarts();

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Nuestros proveedores
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} {...provider} />
        ))}
      </div>
    </section>
  );
}

export default ProviderCarts;
