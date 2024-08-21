import React from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterCard from '../components/FilterCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';

const SearchResultsPage = ({ handleSearch, results, hasSearched, query, facets, selectedFilters, handleFilter }) => (
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
          <SearchResults results={results} hasSearched={hasSearched} query={query} selectedFilters={selectedFilters} />
        </div>
        {/* Search Results Section End */}
      </div>
    </div>
  </div>
);

export default SearchResultsPage;
