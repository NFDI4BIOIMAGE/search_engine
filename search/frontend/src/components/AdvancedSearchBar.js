import React, { useState } from 'react';

const AdvancedSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSearch = () => {
    onSearch({ query, category, tags });
  };

  return (
    <div className="advanced-search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
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

