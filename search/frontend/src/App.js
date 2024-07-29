import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import SearchResults from './components/SearchResults';
import axios from 'axios';

const App = () => {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const username = 'admin';
  const password = 'admin123';

  const handleSearch = async (query) => {
    setHasSearched(true);
    try {
      const response = await axios.post(
        'http://localhost:9200/bioimage-training/_search',
        {
          query: {
            bool: {
              should: [
                { match: { name: query } },
                { match: { content: query } },
                { match: { tags: query } },
                { match: { authors: query } }
              ]
            }
          }
        },
        {
          auth: {
            username: username,
            password: password
          }
        }
      );
      if (response.data && response.data.hits && response.data.hits.hits) {
        console.log('Search results:', response.data.hits.hits); // Log the results
        setResults(response.data.hits.hits);
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
  };

  const handleAdvancedSearch = async ({ query, category, tags }) => {
    setHasSearched(true);
    const mustQueries = [];
    if (query) mustQueries.push({ match: { content: query } });
    if (category) mustQueries.push({ match: { category } });
    if (tags) mustQueries.push({ match: { tags } });

    try {
      const response = await axios.post(
        'http://localhost:9200/bioimage-training/_search',
        {
          query: {
            bool: {
              must: mustQueries
            }
          }
        },
        {
          auth: {
            username: username,
            password: password
          }
        }
      );
      if (response.data && response.data.hits && response.data.hits.hits) {
        console.log('Advanced search results:', response.data.hits.hits); // Log the results
        setResults(response.data.hits.hits);
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />
      <AdvancedSearchBar onSearch={handleAdvancedSearch} />
      <SearchResults results={results} hasSearched={hasSearched} />
    </div>
  );
};

export default App;
