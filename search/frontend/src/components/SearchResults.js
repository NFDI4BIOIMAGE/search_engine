import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results.map((result) => (
        <div key={result._id} className="result-item">
          <h2>{result._source.title}</h2>
          <p>{result._source.abstract}</p>
          <p><strong>Category:</strong> {result._source.category}</p>
          <p><strong>Tags:</strong> {result._source.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;