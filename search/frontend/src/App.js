import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import SearchResults from './components/SearchResults';
import axios from 'axios';

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const response = await axios.post('http://localhost:9200/bioimage-training/_search', {
        query: {
          bool: {
            should: [
              { match: { title: query } },
              { match: { content: query } },
              { match: { tags: query } }
            ]
          }
        }
      });
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleAdvancedSearch = async ({ query, category, tags }) => {
    const mustQueries = [];
    if (query) mustQueries.push({ match: { content: query } });
    if (category) mustQueries.push({ match: { category } });
    if (tags) mustQueries.push({ match: { tags } });

    try {
      const response = await axios.post('http://localhost:9200/bioimage-training/_search', {
        query: {
          bool: {
            must: mustQueries
          }
        }
      });
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />
      <AdvancedSearchBar onSearch={handleAdvancedSearch} />
      <SearchResults results={results} />
    </div>
  );
};

export default App;
