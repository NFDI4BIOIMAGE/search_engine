import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import SearchResults from './components/SearchResults';
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const { body } = await client.search({
      index: 'bioimage-training',
      body: {
        query: {
          bool: {
            should: [
              { match: { title: query } },
              { match: { content: query } },
              { match: { tags: query } }
            ]
          }
        }
      }
    });
    setResults(body.hits.hits);
  };

  const handleAdvancedSearch = async ({ query, category, tags }) => {
    const mustQueries = [];
    if (query) mustQueries.push({ match: { content: query } });
    if (category) mustQueries.push({ match: { category } });
    if (tags) mustQueries.push({ match: { tags } });

    const { body } = await client.search({
      index: 'bioimage-training',
      body: {
        query: {
          bool: {
            must: mustQueries
          }
        }
      }
    });
    setResults(body.hits.hits);
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

