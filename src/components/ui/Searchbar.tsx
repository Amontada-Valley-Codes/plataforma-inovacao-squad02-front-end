"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");

  // 🔹 Busca automática com debounce
  useEffect(() => {
    if (!onSearch) return;

    // Debounce para não fazer muitas chamadas
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms de delay

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // 🔹 Busca imediata (opcional - sem debounce)
    // if (onSearch) {
    //   onSearch(newQuery);
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mantém o submit caso queira alguma ação adicional
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-[350px] justify-center md:w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow p-2"
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Pesquisar um desafio"
        className="flex-grow bg-transparent outline-none px-3 text-gray-800 dark:text-gray-200"
      />
      <button
        type="submit"
        className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition"
      >
        <Search size={18} />
      </button>
    </form>
  );
}