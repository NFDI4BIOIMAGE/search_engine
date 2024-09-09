import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterCard from '../components/FilterCard';
import Pagination from '../components/Pagination';  // Import Pagination
import PagesSelection from '../components/PagesSelection';  // Import PagesSelection
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';

const SearchResultsPage = ({ handleSearch, results, hasSearched, query, facets }) => {
  // Initialize selectedFilters state with useState
  const [selectedFilters, setSelectedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);  // Add currentPage state
  const [itemsPerPage, setItemsPerPage] = useState(10);  // Add itemsPerPage state

  // Handle filter logic as before
  const handleFilter = (field, key) => {
    setSelectedFilters(prevFilters => {
      const currentSelections = prevFilters[field] || [];

      if (currentSelections.includes(key)) {
        return {
          ...prevFilters,
          [field]: currentSelections.filter(item => item !== key),
        };
      } else {
        return {
          ...prevFilters,
          [field]: [...currentSelections, key],
        };
      }
    });
  };

  // Correct field names in the data
  const correctFieldName = (field) => {
    switch (field) {
      case 'publicationTitles':
        return 'name';
      case 'types':
        return 'type';
      case 'licenses':
        return 'license';
      default:
        return field;
    }
  };

  // Filter results based on selected filters
  const filteredResults = results.filter(result => {
    return Object.keys(selectedFilters).every(field => {
      if (!selectedFilters[field].length) return true;

      const actualField = correctFieldName(field);
      const resultField = result[actualField] || result._source?.[actualField];

      if (!resultField) return false;

      if (Array.isArray(resultField)) {
        return selectedFilters[field].some(filter => resultField.includes(filter));
      } else if (typeof resultField === 'string') {
        return selectedFilters[field].includes(resultField);
      } else {
        return false;
      }
    });
  });

  // Pagination Logic
  const indexOfLastResult = currentPage * itemsPerPage;
  const indexOfFirstResult = indexOfLastResult - itemsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (numItems) => {
    setItemsPerPage(numItems);
    setCurrentPage(1);  // Reset to first page when items per page changes
  };

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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p>Showing {indexOfFirstResult + 1} to {indexOfLastResult > filteredResults.length ? filteredResults.length : indexOfLastResult} of {filteredResults.length} results</p>
              <PagesSelection
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>

            {/* Search Results */}
            <SearchResults results={currentResults} hasSearched={hasSearched} query={query} selectedFilters={selectedFilters} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          {/* Search Results Section End */}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
