import React, { useState } from 'react'; 
import SearchBar from './components/SearchBar'; 
import AdvancedSearchBar from './components/AdvancedSearchBar'; 
import SearchResults from './components/SearchResults'; 
import axios from 'axios'; 

const App = () => {
  // State to hold search results
  const [results, setResults] = useState([]); 
  // Elasticsearch username and password
  const username = 'admin'; 
  const password = 'admin123';

  // Function to handle basic search
  const handleSearch = async (query) => {
    try {
      const response = await axios.post(
        // Elasticsearch endpoint
        'http://localhost:9200/bioimage-training/_search', 
        {
          query: {
            bool: {
              // Multi-search selection
              should: [ 
                { match: { title: query } },
                { match: { content: query } },
                { match: { tags: query } }
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
      // Check and log the response data
      if (response.data && response.data.hits && response.data.hits.hits) {
        // Updating state with search results
        setResults(response.data.hits.hits);
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]); // Clear results if response format is unexpected
      }
    } catch (error) {
      console.error('Error searching:', error); // Logging any errors
      setResults([]); // Clear results on error
    }            
    //   // Updating state with search results
    //   setResults(response.data.hits.hits);
    // } catch (error) {
    //   console.error('Error searching:', error); 
    // }
  };

  // Function to handle advanced search
  const handleAdvancedSearch = async ({ query, category, tags }) => {
    const mustQueries = [];
    // Adding content,category,tags match query if provided
    if (query) mustQueries.push({ match: { content: query } }); 
    if (category) mustQueries.push({ match: { category } }); 
    if (tags) mustQueries.push({ match: { tags } });

    try {
      const response = await axios.post(
        // Elasticsearch endpoint
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
      // Check and log the response data
      if (response.data && response.data.hits && response.data.hits.hits) {
        // Updating state with search results
        setResults(response.data.hits.hits);
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]); // Clear results if response format is unexpected
      }
    } catch (error) {
      console.error('Error searching:', error); // Logging any errors
      setResults([]); // Clear results on error
    }
    //   // Updating state with search results
    //   setResults(response.data.hits.hits); 
    // } catch (error) {
    //   console.error('Error searching:', error); 
    // }
  };

  return (
    <div className="App">
      {/* Rendering SearchBar, AdvancedSearchBar and SearchResults  */}
      <SearchBar onSearch={handleSearch} /> 
      <AdvancedSearchBar onSearch={handleAdvancedSearch} /> 
      <SearchResults results={results} /> 
    </div>
  );
};

export default App;
