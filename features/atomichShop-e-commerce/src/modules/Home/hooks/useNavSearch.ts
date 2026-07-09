import React, { useState, useEffect, useRef } from "react";
import { ecommerceService } from "@/services/ecommerceService";

export function useNavSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length >= 3) {
      const data = await ecommerceService.searchProducts(value);
      setSearchResults(data.slice(0, 3));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return { searchQuery, searchResults, showDropdown, wrapperRef, handleSearchChange, handleClear };
}
