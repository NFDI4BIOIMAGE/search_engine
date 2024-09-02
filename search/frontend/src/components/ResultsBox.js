import React from 'react';
import { Card } from 'react-bootstrap';

/**
 * ResultsBox component to display material information in a styled card.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - Title of the material.
 * @param {Array} props.authors - List of authors for the material.
 * @param {string} props.description - Description or abstract of the material.
 * @param {string} props.license - License information of the material.
 * @param {string} props.type - Type of the material (e.g., article, blog).
 * @param {Array} props.tags - List of tags associated with the material.
 * @param {string} props.url - URL to access the material.
 * @param {Array} props.selectedFilters - Currently selected filters for highlighting.
 */
const ResultsBox = ({ title, authors, description, license, type, tags, url, selectedFilters = {} }) => {
  const highlightText = (text, highlights) => {
    if (!text) return text;
    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    return text.split(regex).map((part, index) =>
      highlights.some(highlight => part.toLowerCase() === highlight.toLowerCase()) ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="mb-3 shadow-lg" style={{ borderRadius: '8px', overflow: 'hidden', border: '0.5px solid #ddd' }}>
      <Card.Body>
        <Card.Title>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: '#1a0dab', fontSize: '1.25rem', fontWeight: 'bold' }}>
            {highlightText(title, selectedFilters.publicationTitles || [])}
          </a>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {authors && (
            <span><strong>Authors:</strong> {highlightText(authors.join(', '), selectedFilters.authors || [])}</span>
          )}
        </Card.Subtitle>
        {description && (
          <Card.Text className="text-secondary" style={{ fontSize: '0.9rem' }}>
            <strong>Abstract:</strong> {description.length > 200 ? `${description.substring(0, 200)}...` : description}
          </Card.Text>
        )}
        <Card.Text>
          <strong>License:</strong> {highlightText(license || 'N/A', selectedFilters.licenses || [])}
        </Card.Text>
        <Card.Text>
          <strong>Type:</strong> {highlightText(type || 'N/A', selectedFilters.types || [])}
        </Card.Text>
        <Card.Text>
          <strong>Tags:</strong> {highlightText(tags?.join(', ') || 'N/A', selectedFilters.tags || [])}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ResultsBox;
