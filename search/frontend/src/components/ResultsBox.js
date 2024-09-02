import React from 'react';
import { Card } from 'react-bootstrap'; // Import Card component from react-bootstrap

const ResultsBox = ({ title, url, authors, description, license, type, tags, highlights }) => {
  // Function to highlight search terms or selected filters in the text
  const highlightText = (text, highlights) => {
    if (!text) return text;
    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    return text.split(regex).map((part, i) =>
      highlights.some(highlight => part.toLowerCase() === highlight.toLowerCase()) ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  // Helper function to handle missing data
  const displayField = (field, highlights) => {
    return field ? highlightText(field, highlights) : 'N/A';
  };

  // Formatting authors and tags as comma-separated strings
  const formattedAuthors = authors ? authors.join(', ') : 'N/A';
  const formattedTags = tags ? tags.join(', ') : 'N/A';

  return (
    <Card className="mb-3 shadow-lg" style={{ borderRadius: '8px', overflow: 'hidden', border: '0.3px solid #ddd' }}>
      <Card.Body>
        {/* Clickable title integrated with the URL */}
        <Card.Title>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: '#1a0dab', fontSize: '1.25rem', fontWeight: 'bold' }}>
            {highlightText(title, highlights)}
          </a>
        </Card.Title>
        
        <Card.Text style={{ color: '#333', marginBottom: '10px' }}>
          <strong>Authors:</strong> {displayField(formattedAuthors, highlights)}
        </Card.Text>

        <Card.Text style={{ color: '#333', marginBottom: '10px' }}>
          <strong>License:</strong> {displayField(Array.isArray(license) ? license.join(', ') : license, highlights)}
        </Card.Text>

        <Card.Text style={{ color: '#333', marginBottom: '10px' }}>
          <strong>Type:</strong> {displayField(Array.isArray(type) ? type.join(', ') : type, highlights)}
        </Card.Text>

        <Card.Text style={{ color: '#333', marginBottom: '10px' }}>
          <strong>Tags:</strong> {displayField(formattedTags, highlights)}
        </Card.Text>

        <Card.Text style={{ color: '#333', fontSize: '0.9rem', marginBottom: '0' }}>
          <strong>Abstract:</strong> {description ? (description.length > 200 ? `${description.substring(0, 200)}...` : description) : 'N/A'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ResultsBox;
