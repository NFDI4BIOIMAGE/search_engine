// src/components/AdvancedSearchBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch({ query, type, tags });
    navigate('/search');
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Type"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AdvancedSearchBar;
