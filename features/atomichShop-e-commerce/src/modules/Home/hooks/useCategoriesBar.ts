import { useState, useEffect } from "react";
import { ecommerceService } from "@/services/ecommerceService";

interface Category {
  _id: string;
  name: string;
}

export function useCategoriesBar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    ecommerceService.getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  return { categories };
}
