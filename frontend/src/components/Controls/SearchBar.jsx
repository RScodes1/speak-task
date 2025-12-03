import React, { useState } from "react";
import { Search } from "lucide-react";
import useTasks from "../../hooks/useTasks";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const setSearch = useTasks((s) => s.setSearchTerm);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearch(value); 
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl shadow-md w-72">
      <Search className="w-5 h-5 text-white/60" />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full bg-transparent text-white/80 placeholder:text-white/50 outline-none"
      />
    </div>
  );
}
