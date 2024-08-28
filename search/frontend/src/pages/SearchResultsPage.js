import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterCard from '../components/FilterCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';

const SearchResultsPage = ({ handleSearch, results, hasSearched, query, facets }) => {
  // Initialize selectedFilters state with useState
  const [selectedFilters, setSelectedFilters] = useState({});

  // Updated handleFilter function to support multiple selections
  const handleFilter = (field, key) => {
    setSelectedFilters(prevFilters => {
      const currentSelections = prevFilters[field] || [];

      if (currentSelections.includes(key)) {
        // If the key is already selected, remove it (uncheck)
        return {
          ...prevFilters,
          [field]: currentSelections.filter(item => item !== key),
        };
      } else {
        // If the key is not selected, add it (check)
        return {
          ...prevFilters,
          [field]: [...currentSelections, key],
        };
      }
    });
  };

  // Debugging: Log the current filters and data to debug
  console.log('Selected Filters:', selectedFilters);
  console.log('Results:', results);

  // Correct field names in the data
  const correctFieldName = (field) => {
    switch (field) {
      case 'publicationTitles':
        return 'name'; // Assuming 'Publication Titles' is mapped to 'name'
      case 'types':
        return 'type'; // Correct field name to 'type'
      case 'licenses':
        return 'license'; // Correct field name to 'license'
      default:
        return field; // Return the field as is for others
    }
  };

  // Filter results based on selected filters
  const filteredResults = results.filter(result => {
    return Object.keys(selectedFilters).every(field => {
      // No filters selected for this field
      if (!selectedFilters[field].length) return true;

      const actualField = correctFieldName(field);
      const resultField = result[actualField] || result._source?.[actualField];

      console.log(`Filtering on field: ${actualField}, resultField:`, resultField);

      // If the field doesn't exist, exclude the result
      if (!resultField) return false;

      if (Array.isArray(resultField)) {
        // Field is an array, check if any filter matches
        return selectedFilters[field].some(filter => resultField.includes(filter));
      } else if (typeof resultField === 'string') {
        // Field is a string, check for a direct match
        return selectedFilters[field].includes(resultField);
      } else {
        return false; // Handle other data types (e.g., null)
      }
    });
  });

  // Debugging: Log the filtered results to debug
  console.log('Filtered Results:', filteredResults);

  return (
    <div>
      {/* SearchBar Section Start */}
      <div className="container-fluid py-5 mb-5 searchbar-header" style={{ position: 'relative', backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
        <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">Search Results</h1>
              <div className="position-relative w-75 mx-auto animated slideInDown">
                <SearchBar onSearch={(query) => { handleSearch(query); }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* SearchBar Section End */}

      <div className="container my-5">
        <div className="row">
          {/* Faceted Search Sidebar Start */}
          <div className="col-md-3">
            <h3>Filter by</h3>
            <FilterCard title="Authors" items={facets.authors} field="authors" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Publication Titles" items={facets.publicationTitles} field="publicationTitles" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Types" items={facets.types} field="types" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Tags" items={facets.tags} field="tags" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Licenses" items={facets.licenses} field="licenses" selectedFilters={selectedFilters} handleFilter={handleFilter} />
          </div>
          {/* Faceted Search Sidebar End */}

          {/* Search Results Section Start */}
          <div className="col-md-9">
            <SearchResults results={filteredResults} hasSearched={hasSearched} query={query} selectedFilters={selectedFilters} />
          </div>
          {/* Search Results Section End */}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
