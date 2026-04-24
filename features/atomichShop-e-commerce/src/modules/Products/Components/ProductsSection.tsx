// src/modules/Home/Components/ProductsSection.tsx
import { ProductCard } from "../../../components/ui/ProductCard";
import type { Product } from "../../../lib/ProductDetailContext";

// Productos mock — reemplaza con tu fetch real cuando lo tengas
const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Báscula para pesar cajas petri",
    sku: "000001",
    brand: "Accel",
    category: "Báscula",
    price: 80.0,
    originalPrice: 110.0,
    isOffer: true,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+1",
  },
  {
    id: 2,
    name: "Báscula para microbios",
    sku: "000002",
    brand: "Accel",
    category: "Báscula",
    price: 95.0,
    isOffer: false,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+2",
  },
  {
    id: 3,
    name: "Báscula normal científica",
    sku: "000003",
    brand: "Accel",
    category: "Báscula",
    price: 80.0,
    originalPrice: 90.6,
    isOffer: true,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+3",
  },
  {
    id: 4,
    name: "Báscula para agua",
    sku: "000004",
    brand: "Accel",
    category: "Báscula",
    price: 120.99,
    isOffer: false,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+4",
  },
  {
    id: 5,
    name: "Microscopio óptico profesional",
    sku: "000005",
    brand: "Motic",
    category: "Microscopio",
    price: 450.0,
    originalPrice: 520.0,
    isOffer: true,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Microscopio",
  },
  {
    id: 6,
    name: "Agitador magnético con calefacción",
    sku: "000006",
    brand: "JASCO",
    category: "Agitadores",
    price: 210.0,
    isOffer: false,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Agitador",
  },
];

export function ProductsSection() {
  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Productos destacados
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}