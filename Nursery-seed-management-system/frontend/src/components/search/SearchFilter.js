import React, { useState } from "react";

const SearchFilter = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search plants..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchFilter;