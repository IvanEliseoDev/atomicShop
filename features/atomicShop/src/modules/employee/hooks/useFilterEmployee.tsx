import { useState } from "react";

export const useFilterEmployee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return {
    //Props
    searchQuery,



    //Metodos
    setSearchQuery
  }
}
