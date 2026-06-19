import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ecommerceService } from "../../../services/ecommerceService";

interface Category {
  _id: string;
  name: string;
}

function CategoriesBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías al montar
  useEffect(() => {
    ecommerceService.getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  // Sincronizar categoryId desde URL (opcional, si lo necesitas aquí)
  useEffect(() => {
    const categoriaId = searchParams.get("categoria");
    // Solo lectura; la navegación ya actualiza la URL
  }, [searchParams]);

  return (
    <div className="bg-blue-500 px-6 py-2.5 flex items-center justify-around flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat._id}
          className="text-white text-sm font-medium hover:underline transition whitespace-nowrap cursor-pointer"
          onClick={() =>
            navigate(`/productos?categoria=${cat._id}`)
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoriesBar;