import { useState } from "react";

export const useFilterProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return {
    //Props
    searchQuery,

    //Metodos
    setSearchQuery
  }
}
