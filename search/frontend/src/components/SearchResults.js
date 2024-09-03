import React from 'react';
import ResultsBox from './ResultsBox'; 

const SearchResults = ({ results, hasSearched, query, selectedFilters }) => {
  if (!hasSearched) {
    return <div>Please enter a search query to see results.</div>;
  }

  if (!results.length) {
    return <div>No results found</div>;
  }

  // Combine query and selected filters to form highlights array
  const highlightFields = [query, ...Object.values(selectedFilters).flat()].filter(Boolean);

  return (
    <div>
      {results.map((result, index) => (
        <ResultsBox
          key={index}
          title={result._source.name}
          url={result._source.url}
          authors={result._source.authors}
          description={result._source.description}
          license={result._source.license}
          type={result._source.type}
          tags={result._source.tags}
          highlights={highlightFields}
        />
      ))}
    </div>
  );
};

export default SearchResults;
