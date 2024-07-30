import React from 'react';
import SearchBar from '../components/SearchBar';
import AdvancedSearchBar from '../components/AdvancedSearchBar';

const HomePage = ({ handleSearch, handleAdvancedSearch }) => (
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>Use the search bar below to find resources.</p>
    <SearchBar onSearch={handleSearch} />
    <AdvancedSearchBar onSearch={handleAdvancedSearch} />
  </div>
);

export default HomePage;
