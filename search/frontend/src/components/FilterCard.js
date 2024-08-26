import React, { useState, useRef, useEffect } from 'react';

const FilterCard = ({ title, items = [], field, selectedFilters = {}, handleFilter }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  const displayedItems = showAll ? items : items.slice(0, 5);

  useEffect(() => {
    if (collapsed) {
      containerRef.current.style.maxHeight = '0';
    } else {
      containerRef.current.style.maxHeight = containerRef.current.scrollHeight + 'px';
    }
  }, [collapsed, showAll]);

  return (
    <div className="faceted-search">
      <div
        className={`faceted-search-header ${collapsed ? 'collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {title}
        <span className="filter-arrow">▶</span>
      </div>
      <div ref={containerRef} className={`faceted-search-body ${collapsed ? '' : 'show'}`}>
        <ul>
          {displayedItems.map(item => (
            <li key={item.key}>
              <input
                type="checkbox"
                checked={selectedFilters[field]?.includes(item.key) || false} // Ensure `checked` is always a boolean
                onChange={() => handleFilter(field, item.key)} // Toggle filter on change
              />
              <label
                className={selectedFilters[field]?.includes(item.key) ? 'highlighted' : ''} // Apply highlighted class if selected
              >
                {item.key} ({item.doc_count})
              </label>
            </li>
          ))}
        </ul>
        {items.length > 5 && (
          <div className="show-more" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : `Show More (${items.length - 5})`}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
