import React from "react";

interface Provider {
  id: number;
  name: string;
  img: string;
}

const mocksProvider: Provider[] = [
  { id: 1,  name: "DLAB",             img: "https://www.dlabsci.com/static/assets/images/home/Logo.svg" },
  { id: 2,  name: "So-Low",           img: "https://www.scisolinc.com/wp-content/uploads/2021/07/So-Low-Logo-Transparent-PNG-300x79-1.png" },
  { id: 3,  name: "Hettich",          img: "https://www.hettichlab.com/_assets/8e3f2035b889bea3b860ea4072202867/images/logo.svg" },
  { id: 4,  name: "Kugel Medical",    img: "https://kugel-medical.de/wp-content/uploads/2025/02/logo-2.png" },
  { id: 5,  name: "Jasco",            img: "https://i0.wp.com/jasco-spain.com/wp-content/uploads/2023/07/NEW-LOGO-JASCO_-002.png.png?fit=2640%2C737&ssl=1" },
  { id: 6,  name: "Interscience",     img: "https://www.interscience.com/local/cache-vignettes/L350xH35/siteon0-e5814.png?1771927445" },
  { id: 7,  name: "Thomas Scientific",img: "https://cdn.thomassci.com/_resources/www/thomsci/images/layout/logo.png" },
  { id: 8,  name: "Aczel",            img: "https://aczet.com/webtheme/images/logo.png" },
  { id: 9,  name: "Slee Medical",     img: "https://www.slee.de/wp-content/themes/SLEE/images/slee-logo-blue.svg" },
  { id: 10, name: "Controls Group",   img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw_IQHO7E8ZQ3wduoN7e3hkttwLyNm9lFHxg&s" },
  { id: 11, name: "Raypa",            img: "https://raypawebtest.b-cdn.net/files/logo-raypa-2025-300x120.webp" },
  { id: 12, name: "Motic",            img: "https://www.motic.com/images/LOGO.jpg" },
];

// Carta individual de proveedor
const ProviderCard: React.FC<Provider> = ({ name, img }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-4 hover:shadow-md transition">
    <img
      src={img}
      alt={name}
      className="w-full h-16 object-contain"
    />
  </div>
);

function ProviderCarts() {
  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">

      {/* Título */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Nuestros proveedores
      </h2>

      {/* Grid de proveedores — 4 columnas como el mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mocksProvider.map((provider) => (
          <ProviderCard key={provider.id} {...provider} />
        ))}
      </div>

    </section>
  );
}

export default ProviderCarts;