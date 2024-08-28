import React from 'react';

const SearchResults = ({ results, hasSearched, query, selectedFilters }) => {
  if (!hasSearched) {
    return <div>Please enter a search query to see results.</div>;
  }

  if (!results.length) {
    return <div>No results found</div>;
  }

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
  };

  const highlightField = (field, highlights) => {
    if (!field) return 'N/A';
    if (!Array.isArray(field)) field = [field];
    return field.map((item, i) => (
      <span key={i}>
        {highlights.some(highlight => item.toLowerCase().includes(highlight.toLowerCase())) ? (
          highlightText(item, highlights.find(highlight => item.toLowerCase().includes(highlight.toLowerCase())))
        ) : (
          item
        )}
        {i < field.length - 1 && ', '}
      </span>
    ));
  };

  // Highlight based on selected filters or search query
  const highlightFields = Object.values(selectedFilters).flat().length > 0 ? Object.values(selectedFilters).flat() : [query];

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div>
      {results.map(result => (
        <div key={result._id}>
          <h2>{highlightField(result._source.name, highlightFields)}</h2>
          <p>
            <strong>Authors:</strong> {highlightField(result._source.authors, highlightFields)}
          </p>
          <p>
            <strong>Type:</strong> {highlightField(result._source.type, highlightFields)}
          </p>
          <p>
            <strong>Tags:</strong> {highlightField(result._source.tags, highlightFields)}
          </p>
          <p>
            <strong>License:</strong> {highlightField(result._source.license, highlightFields)}
          </p>
          {result._source.description && (
            <p>
              <strong>Abstract:</strong> {truncateText(result._source.description, 200)}
            </p>
          )}
          <p>
            <strong>URL:</strong> <a href={result._source.url}>{result._source.url}</a>
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
