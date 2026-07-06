import { useNavigate } from "react-router";
import { useCategoriesBar } from "../hooks/useCategoriesBar";

function CategoriesBar() {
  const navigate = useNavigate();
  const { categories } = useCategoriesBar();

  return (
    <div className="bg-blue-500 px-6 py-2.5 flex items-center justify-around flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat._id}
          className="text-white text-sm font-medium hover:underline transition whitespace-nowrap cursor-pointer"
          onClick={() => navigate(`/productos?categoria=${cat._id}`)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoriesBar;
