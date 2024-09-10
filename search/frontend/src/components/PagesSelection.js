import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const PagesSelection = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={`Per page: ${itemsPerPage}`}
      variant="outline-secondary"
    >
      <Dropdown.Item onClick={() => onItemsPerPageChange(10)}>10</Dropdown.Item>
      <Dropdown.Item onClick={() => onItemsPerPageChange(20)}>20</Dropdown.Item>
      <Dropdown.Item onClick={() => onItemsPerPageChange(50)}>50</Dropdown.Item>
    </DropdownButton>
  );
};

export default PagesSelection;
