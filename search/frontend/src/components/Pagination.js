import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to determine which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Calculate the start and end page
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    // Ensure the endPage doesn't exceed totalPages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Ensure the page numbers range always includes 5 pages when possible
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <BootstrapPagination className="mt-3 justify-content-center">
      <BootstrapPagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <BootstrapPagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />

      {/* Render Page Numbers */}
      {getPageNumbers().map((pageNum) => (
        <BootstrapPagination.Item
          key={pageNum}
          active={pageNum === currentPage}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </BootstrapPagination.Item>
      ))}

      <BootstrapPagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <BootstrapPagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
    </BootstrapPagination>
  );
};

export default Pagination;
