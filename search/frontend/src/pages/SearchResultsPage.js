import React from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';

const SearchResultsPage = ({ handleSearch, results, hasSearched, query, facets, selectedFilters, handleFilter }) => (
  <div>
    {/* SearchBar Section Start */}
    <div className="container-fluid py-5 mb-5 searchbar-header" style={{ position: 'relative', backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div> {/* Semi-transparent overlay */}
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
          <div>
            <h4>Authors</h4>
            <ul className="list-unstyled">
              {facets.authors.map(author => (
                <li key={author.key}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.authors.includes(author.key)}
                    onChange={() => handleFilter('authors', author.key)}
                  />
                  <label className="ms-2">{author.key} ({author.doc_count})</label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Publication Titles</h4>
            <ul className="list-unstyled">
              {facets.publicationTitles.map(title => (
                <li key={title.key}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.publicationTitles.includes(title.key)}
                    onChange={() => handleFilter('publicationTitles', title.key)}
                  />
                  <label className="ms-2">{title.key} ({title.doc_count})</label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Type</h4> {/* Added types */}
            <ul className="list-unstyled">
              {facets.types.map(type => (
                <li key={type.key}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.types.includes(type.key)}
                    onChange={() => handleFilter('types', type.key)}
                  />
                  <label className="ms-2">{type.key} ({type.doc_count})</label>
                </li>
              ))}
            </ul>
          </div>
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
