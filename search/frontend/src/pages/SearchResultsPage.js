import React from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg'; // Adjust the path as necessary

const SearchResultsPage = ({ handleSearch, results, hasSearched }) => (
  <div>
    {/* SearchBar Section Start */}
    <div className="container-fluid py-5 mb-5 searchbar-header" style={{ position: 'relative', backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div> {/* Semi-transparent overlay */}
      <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center py-5">
          <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
            <h1 className="display-3 text-white mb-3 animated slideInDown">Search Results</h1>
            <div className="position-relative w-75 mx-auto animated slideInDown">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* SearchBar Section End */}

    {/* Search Results Section Start */}
    <div className="container my-5">
      <SearchResults results={results} hasSearched={hasSearched} />
    </div>
    {/* Search Results Section End */}
  </div>
);

export default SearchResultsPage;
