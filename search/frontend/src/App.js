import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import SearchResults from './components/SearchResults';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import EventsPage from './pages/EventsPage';
import PapersPage from './pages/PapersPage';
import WorkflowToolsPage from './pages/WorkflowToolsPage';
import YouTubeChannelsPage from './pages/YouTubeChannelsPage';
import MaterialPage from './pages/MaterialPage';
import axios from 'axios';

const SearchPage = ({ handleSearch, handleAdvancedSearch, results, hasSearched }) => (
  <div>
    <SearchBar onSearch={handleSearch} />
    <AdvancedSearchBar onSearch={handleAdvancedSearch} />
    <SearchResults results={results} hasSearched={hasSearched} />
  </div>
);

const App = () => {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const username = 'admin';
  const password = 'admin123';

  useEffect(() => {
    // Retrieve search results and query from localStorage
    const savedResults = localStorage.getItem('searchResults');
    const savedHasSearched = localStorage.getItem('hasSearched');

    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    if (savedHasSearched) {
      setHasSearched(JSON.parse(savedHasSearched));
    }
  }, []);

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
        // Save search results and query to localStorage
        localStorage.setItem('searchResults', JSON.stringify(response.data.hits.hits));
        localStorage.setItem('hasSearched', JSON.stringify(true));
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
  };

  const handleAdvancedSearch = async ({ query, type, tags }) => {
    setHasSearched(true);
    const mustQueries = [];
    if (query) mustQueries.push({ match: { content: query } });
    if (type) mustQueries.push({ match: { type } });
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
        // Save advanced search results and query to localStorage
        localStorage.setItem('searchResults', JSON.stringify(response.data.hits.hits));
        localStorage.setItem('hasSearched', JSON.stringify(true));
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
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HomePage handleSearch={handleSearch} handleAdvancedSearch={handleAdvancedSearch} />}
        />
        <Route
          path="/search"
          element={<SearchPage
            handleSearch={handleSearch}
            handleAdvancedSearch={handleAdvancedSearch}
            results={results}
            hasSearched={hasSearched}
          />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/workflow-tools" element={<WorkflowToolsPage />} />
        <Route path="/youtube-channels" element={<YouTubeChannelsPage />} />
        <Route path="/materials" element={<MaterialPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
