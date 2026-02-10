// components/common/CommonComponents.jsx
import { useState } from "react";

// Modal Component
export const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-xl p-6 w-full mx-4 ${sizeClasses[size]} animate-fade-in`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

// Filter Tag Component
export const FilterTag = ({ filter, onRemove }) => {
  const iconMap = {
    name: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    location: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    building: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
      </svg>
    ),
    briefcase: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    education: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    contact: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    experience: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  };

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 rounded text-sm">
      <span className="text-gray-900">{iconMap[filter.icon] || iconMap.name}</span>
      <span>{filter.value}</span>
      <button
        onClick={() => onRemove(filter.id)}
        className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
};

// Checkbox Component
export const Checkbox = ({ checked, onChange, label, indeterminate = false }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative w-5 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className={`absolute inset-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 bg-white"
            }`}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
};

// Pagination Component
// Updated Pagination Component for CommonComponents.jsx

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 9;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page, last page, and pages around current
      if (currentPage <= 5) {
        for (let i = 1; i <= 7; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex bg-white items-center justify-between mt-0 pt-4">
      {/* Items per page dropdown */}
      <div className="flex items-center gap-2 ml-5 relative">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="
                appearance-none
                px-3 py-2 pr-8
                border border-gray-300
                rounded-lg
                text-sm
                
                bg-white
              "
                >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        {/* Custom arrow */}
        {/* <span className="pointer-events-none absolute right-3 text-gray-500">
    ▼
  </span> */}
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous arrow */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-[24px] h-[24px] rounded text-[14px] font-medium transition-colors ${currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          )
        ))}

        {/* Next arrow */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Empty div for spacing balance */}
      <div className="w-20"></div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-3 gap-1">
    <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

// Success Icon
export const SuccessIcon = () => (
  <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  </div>
);

// LinkedIn Icon
export const LinkedInIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);