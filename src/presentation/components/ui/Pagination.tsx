import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = '',
  itemLabel = 'data'
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate sliding window page numbers
  const getPageNumbers = (): (number | string)[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      return [
        1,
        '...',
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages
      ];
    }

    return [
      1,
      '...',
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      '...',
      safeTotalPages
    ];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50/70 text-body-sm text-gray-600 ${className}`}
    >
      {/* Left: Info and Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="text-caption text-gray-600">
          Menampilkan{' '}
          <span className="font-semibold text-gray-950 font-mono">{startItem}</span> -{' '}
          <span className="font-semibold text-gray-950 font-mono">{endItem}</span> dari{' '}
          <span className="font-semibold text-gray-950 font-mono">{totalItems}</span> {itemLabel}
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-caption text-gray-600">
            <span>Tampilkan:</span>
            <select
              aria-label="Pilih jumlah data per halaman"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-900 text-caption font-semibold rounded-md px-2 py-1 outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 shadow-2xs cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="hidden md:inline">per halaman</span>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
        {/* First Page */}
        <button
          type="button"
          aria-label="Halaman Pertama"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(1)}
          className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          title="Halaman Pertama"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          aria-label="Halaman Sebelumnya"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors text-caption font-medium flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span className="hidden md:inline">Sebelumnya</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-7 px-1.5 rounded-md text-caption font-semibold transition-colors ${
                  p === safeCurrentPage
                    ? 'bg-primary-600 text-white border border-primary-600 shadow-2xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={`dots-${idx}`} className="px-1 text-gray-400 select-none text-caption">
                ...
              </span>
            )
          )}
        </div>

        {/* Next Page */}
        <button
          type="button"
          aria-label="Halaman Berikutnya"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors text-caption font-medium flex items-center gap-1"
        >
          <span className="hidden md:inline">Berikutnya</span>
          <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          aria-label="Halaman Terakhir"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(safeTotalPages)}
          className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          title="Halaman Terakhir"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};
