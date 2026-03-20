import React from 'react'

// Array de categorias que se llenaran en el menu de categorias que esta debajo del navbar
const categories = [
  "Equipamiento",
  "Material de vidrio y plástico",
  "Reactivos y productos químicos",
  "Seguridad y protección",
  "Mobiliario especializado",
];

function CategoriesBar() {
  return (
    
      <div className="bg-blue-500 px-6 py-2.5 flex items-center justify-around flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className="text-white text-sm font-medium hover:underline transition whitespace-nowrap cursor-pointer"
          >
            {cat}
          </button>
        ))}
      </div>
  )
}

export default CategoriesBar