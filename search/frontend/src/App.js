import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import EventsPage from './pages/EventsPage';
import PapersPage from './pages/PapersPage';
import WorkflowToolsPage from './pages/WorkflowToolsPage';
import YouTubeChannelsPage from './pages/YouTubeChannelsPage';
import MaterialPage from './pages/MaterialPage';
import SearchResultsPage from './pages/SearchResultsPage';
import axios from 'axios';

const App = () => {
  const [results, setResults] = useState([]);
  const [initialResults, setInitialResults] = useState([]); // Save initial results
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [facets, setFacets] = useState({ authors: [], publicationTitles: [], types: [], tags: [] }); // Added tags
  const [selectedFilters, setSelectedFilters] = useState({ authors: [], publicationTitles: [], types: [], tags: [] }); // Added tags
  const username = 'admin';
  const password = 'admin123';

  useEffect(() => {
    const savedResults = localStorage.getItem('searchResults');
    const savedHasSearched = localStorage.getItem('hasSearched');
    const savedQuery = localStorage.getItem('searchQuery');
    const savedSelectedFilters = localStorage.getItem('selectedFilters');
    const savedFacets = localStorage.getItem('facets');

    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);
      setInitialResults(parsedResults); // Set initial results from localStorage
    }

    if (savedHasSearched) {
      setHasSearched(JSON.parse(savedHasSearched));
    }

    if (savedQuery) {
      setQuery(savedQuery);
    }

    if (savedSelectedFilters) {
      const parsedFilters = JSON.parse(savedSelectedFilters);
      setSelectedFilters(parsedFilters);
      applyFilters(parsedFilters, JSON.parse(savedResults)); // Apply filters on mount
    }

    if (savedFacets) {
      setFacets(JSON.parse(savedFacets));
    }
  }, []);

  const handleSearch = async (query) => {
    resetFilters(); // Reset filters on new search
    setHasSearched(true);
    setQuery(query);
    try {
      const response = await axios.post(
        'http://localhost:9200/bioimage-training/_search',
        {
          query: {
            query_string: {
              query: `*${query}*`,
              fields: ['name', 'content', 'tags', 'authors', 'type', 'license', 'url'],
              default_operator: 'AND'
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
        console.log('Search results:', response.data.hits.hits);
        const uniqueResults = Array.from(new Map(response.data.hits.hits.map(item => [item._source.url, item])).values());
        setResults(uniqueResults);
        setInitialResults(uniqueResults); // Save initial results
        localStorage.setItem('searchResults', JSON.stringify(uniqueResults));
        localStorage.setItem('hasSearched', JSON.stringify(true));
        localStorage.setItem('searchQuery', query);
        
        // Calculate facets from results
        const newFacets = calculateFacets(uniqueResults);
        setFacets(newFacets);
        localStorage.setItem('facets', JSON.stringify(newFacets));
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
  };

  const calculateFacets = (results) => {
    const authorCounts = {};
    const publicationTitleCounts = {};
    const typeCounts = {}; // Added type counts
    const tagCounts = {}; // Added tag counts

    results.forEach(result => {
      result._source.authors?.forEach(author => {
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      });

      const publicationTitle = result._source.name; // Updated to use 'name'
      if (publicationTitle) {
        publicationTitleCounts[publicationTitle] = (publicationTitleCounts[publicationTitle] || 0) + 1;
      }

      const types = Array.isArray(result._source.type) ? result._source.type : []; // Handle types as array
      types.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const tags = Array.isArray(result._source.tags) ? result._source.tags : []; // Handle tags as array
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      authors: Object.entries(authorCounts).map(([key, count]) => ({ key, doc_count: count })),
      publicationTitles: Object.entries(publicationTitleCounts).map(([key, count]) => ({ key, doc_count: count })), // Updated to use 'name'
      types: Object.entries(typeCounts).map(([key, count]) => ({ key, doc_count: count })), // Added types
      tags: Object.entries(tagCounts).map(([key, count]) => ({ key, doc_count: count })) // Added tags
    };
  };

  const handleFilter = (field, value) => {
    const newSelectedFilters = { ...selectedFilters };
    if (newSelectedFilters[field].includes(value)) {
      newSelectedFilters[field] = newSelectedFilters[field].filter(item => item !== value);
    } else {
      newSelectedFilters[field].push(value);
    }
    setSelectedFilters(newSelectedFilters);
    localStorage.setItem('selectedFilters', JSON.stringify(newSelectedFilters));
    applyFilters(newSelectedFilters, initialResults);
  };

  const applyFilters = (filters, resultsToFilter) => {
    let filteredResults = [...resultsToFilter];

    if (filters.authors?.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const authors = result._source.authors || [];
        return filters.authors.some(filter => authors.includes(filter)); // OR logic
      });
    }

    if (filters.publicationTitles?.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const publicationTitle = result._source.name || ''; // Updated to use 'name'
        return filters.publicationTitles.includes(publicationTitle);
      });
    }

    if (filters.types?.length > 0) { // Added types filter
      filteredResults = filteredResults.filter(result => {
        const types = Array.isArray(result._source.type) ? result._source.type : [];
        return filters.types.some(filter => types.includes(filter));
      });
    }

    if (filters.tags?.length > 0) { // Added tags filter
      filteredResults = filteredResults.filter(result => {
        const tags = Array.isArray(result._source.tags) ? result._source.tags : [];
        return filters.tags.some(filter => tags.includes(filter));
      });
    }

    setResults(filteredResults);
  };

  const resetFilters = () => {
    setSelectedFilters({ authors: [], publicationTitles: [], types: [], tags: [] }); // Added tags
    localStorage.setItem('selectedFilters', JSON.stringify({ authors: [], publicationTitles: [], types: [], tags: [] })); // Added tags
    setResults(initialResults);
  };

  return (
    <Router>
      <Navbar resetFilters={resetFilters} />
      <Routes>
        <Route path="/" element={<HomePage handleSearch={handleSearch} />} />
        <Route path="/search" element={<SearchResultsPage handleSearch={handleSearch} results={results} hasSearched={hasSearched} query={query} facets={facets} selectedFilters={selectedFilters} handleFilter={handleFilter} />} />
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
