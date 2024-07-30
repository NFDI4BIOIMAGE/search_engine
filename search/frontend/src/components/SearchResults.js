import React from 'react';

const SearchResults = ({ results, hasSearched }) => {
  if (!hasSearched) {
    return <div>Please enter a search query to see results.</div>;
  }

  if (!results.length) {
    return <div>No results found</div>;
  }

  return (
    <div>
      {results.map(result => (
        <div key={result._id}>
          <h2>{result._source.name}</h2>
          <p><strong>Authors:</strong> {result._source.authors ? result._source.authors.join(', ') : 'N/A'}</p>
          <p><strong>Type:</strong> {result._source.type ? result._source.type.join(', ') : 'N/A'}</p>
          <p><strong>Tags:</strong> {result._source.tags ? result._source.tags.join(', ') : 'N/A'}</p>
          <p><strong>License:</strong> {result._source.license ? (Array.isArray(result._source.license) ? result._source.license.join(', ') : result._source.license) : 'N/A'}</p>
          <p><strong>URL:</strong> <a href={result._source.url}>{result._source.url}</a></p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
