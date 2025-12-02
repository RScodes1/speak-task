import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if(onSearch){
      onSearch(e.target.value);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search tasks..."
      value={searchTerm}
      onChange={handleChange}
      className="border p-2 rounded flex-1"
    />
  );
}