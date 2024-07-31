import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query);
      navigate('/search');
    }
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Eg: Machine Learning, Data Science, etc."
        style={{ paddingRight: '120px' }} // Add padding to ensure text doesn't overlap with button
      />
      <button
        type="button"
        className="btn btn-primary rounded-pill py-2 px-4 position-absolute top-0 end-0 me-2"
        style={{ marginTop: '7px', right: '10px' }} // Adjust the position of the button
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
