import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SubmitMaterialsPage from './pages/SubmitMaterialsPage'; // Import SubmitMaterialsPage
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
  const [facets, setFacets] = useState({ authors: [], publicationTitles: [], types: [], tags: [], licenses: [] });
  const [selectedFilters, setSelectedFilters] = useState({ authors: [], publicationTitles: [], types: [], tags: [], licenses: [] });
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
      setInitialResults(parsedResults);

      if (savedSelectedFilters) {
        const parsedFilters = JSON.parse(savedSelectedFilters);
        setSelectedFilters(parsedFilters);
        const filteredResults = applyFilters(parsedFilters, parsedResults);
        const newFacets = calculateFacets(filteredResults);
        setFacets(newFacets);
      } else {
        setFacets(calculateFacets(parsedResults));
      }
    }

    if (savedHasSearched) {
      setHasSearched(JSON.parse(savedHasSearched));
    }

    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const handleSearch = async (query) => {
    resetFilters();
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
        setInitialResults(uniqueResults);
        localStorage.setItem('searchResults', JSON.stringify(uniqueResults));
        localStorage.setItem('hasSearched', JSON.stringify(true));
        localStorage.setItem('searchQuery', query);
        
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
    const typeCounts = {};
    const tagCounts = {};
    const licenseCounts = {};

    results.forEach(result => {
      result._source.authors?.forEach(author => {
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      });

      const publicationTitle = result._source.name;
      if (publicationTitle) {
        publicationTitleCounts[publicationTitle] = (publicationTitleCounts[publicationTitle] || 0) + 1;
      }

      const types = Array.isArray(result._source.type) ? result._source.type : [];
      types.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const tags = Array.isArray(result._source.tags) ? result._source.tags : [];
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      const licenses = Array.isArray(result._source.license) ? result._source.license : [result._source.license];
      licenses.forEach(license => {
        licenseCounts[license] = (licenseCounts[license] || 0) + 1;
      });
    });

    return {
      authors: Object.entries(authorCounts).map(([key, count]) => ({ key, doc_count: count })),
      publicationTitles: Object.entries(publicationTitleCounts).map(([key, count]) => ({ key, doc_count: count })),
      types: Object.entries(typeCounts).map(([key, count]) => ({ key, doc_count: count })),
      tags: Object.entries(tagCounts).map(([key, count]) => ({ key, doc_count: count })),
      licenses: Object.entries(licenseCounts).map(([key, count]) => ({ key, doc_count: count }))
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
    const filteredResults = applyFilters(newSelectedFilters, initialResults);
    const newFacets = calculateFacets(filteredResults);
    setFacets(newFacets);
  };

  const applyFilters = (filters, resultsToFilter) => {
    let filteredResults = [...resultsToFilter];

    if (filters.authors.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const authors = result._source.authors || [];
        return filters.authors.some(filter => authors.includes(filter));
      });
    }

    if (filters.publicationTitles.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const publicationTitle = result._source.name || '';
        return filters.publicationTitles.includes(publicationTitle);
      });
    }

    if (filters.types.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const types = Array.isArray(result._source.type) ? result._source.type : [];
        return filters.types.some(filter => types.includes(filter));
      });
    }

    if (filters.tags.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const tags = Array.isArray(result._source.tags) ? result._source.tags : [];
        return filters.tags.some(filter => tags.includes(filter));
      });
    }

    if (filters.licenses.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const licenses = Array.isArray(result._source.license) ? result._source.license : [result._source.license];
        return filters.licenses.some(filter => licenses.includes(filter));
      });
    }

    setResults(filteredResults);
    return filteredResults;
  };

  const resetFilters = () => {
    setSelectedFilters({ authors: [], publicationTitles: [], types: [], tags: [], licenses: [] });
    localStorage.setItem('selectedFilters', JSON.stringify({ authors: [], publicationTitles: [], types: [], tags: [], licenses: [] }));
    setResults(initialResults);
    const newFacets = calculateFacets(initialResults);
    setFacets(newFacets);
  };

  return (
    <Router>
      <Navbar resetFilters={resetFilters} />
      <Routes>
        <Route path="/" element={<HomePage handleSearch={handleSearch} />} />
        <Route path="/search" element={<SearchResultsPage handleSearch={handleSearch} results={results} hasSearched={hasSearched} query={query} facets={facets} selectedFilters={selectedFilters} handleFilter={handleFilter} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/submit-materials" element={<SubmitMaterialsPage />} /> {/* Correct Route */}
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
