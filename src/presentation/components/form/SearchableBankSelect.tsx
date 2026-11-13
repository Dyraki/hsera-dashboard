import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X, Check, Building } from 'lucide-react';
import { INDONESIA_BANKS, findBankByIdOrCode } from '@/core/constants/banks';
import { Bank, BankCategory } from '@/core/domain/models/Bank';

export interface SearchableBankSelectProps {
  label?: string;
  value?: string | null;
  onChange: (bankId: string) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

const CATEGORIES: Array<{ key: BankCategory | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'Semua' },
  { key: 'BUMN', label: 'BUMN' },
  { key: 'SWASTA', label: 'Swasta' },
  { key: 'BPD', label: 'BPD' },
  { key: 'DIGITAL', label: 'Digital' },
  { key: 'SYARIAH', label: 'Syariah' },
];

export const SearchableBankSelect: React.FC<SearchableBankSelectProps> = ({
  label = 'Nama Bank',
  value,
  onChange,
  required = false,
  disabled = false,
  helperText,
  placeholder = 'Pilih / Cari Nama Bank...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BankCategory | 'ALL'>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cari bank terpilih saat ini
  const currentBank = useMemo(() => findBankByIdOrCode(value), [value]);

  // Filter daftar bank berdasarkan kata kunci & kategori
  const filteredBanks = useMemo(() => {
    let list = INDONESIA_BANKS;

    if (selectedCategory !== 'ALL') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (!searchQuery.trim()) {
      return list;
    }

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.includes(q) ||
        b.alias.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  // Tutup dropdown saat klik di luar kontainer
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Auto focus search input saat dropdown terbuka
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (bank: Bank) => {
    onChange(bank.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const getCategoryBadgeClass = (category: BankCategory) => {
    switch (category) {
      case 'BUMN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SWASTA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DIGITAL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'BPD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SYARIAH':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full space-y-1 ${className}`}>
      {label && (
        <label className="block text-body-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-600 font-bold ml-1">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full bg-white border border-gray-300 rounded-md px-3.5 py-2 text-body-sm flex items-center justify-between transition-colors cursor-pointer select-none ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : isOpen
            ? 'border-primary-600 ring-2 ring-primary-100'
            : 'hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <Building size={16} className="text-gray-400 shrink-0" />
          {currentBank ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-bold shrink-0">
                {currentBank.code}
              </span>
              <span className="font-medium text-gray-900 truncate">
                {currentBank.name}
              </span>
              {currentBank.alias && (
                <span className="text-caption text-primary-700 font-semibold shrink-0">
                  ({currentBank.alias})
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {currentBank && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Hapus Pilihan Bank"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary-600' : ''
            }`}
          />
        </div>
      </div>

      {helperText && <p className="text-[11px] text-gray-500 leading-tight">{helperText}</p>}

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Search Input Bar */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/70">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama bank, kode (014), atau singkatan (BCA)..."
                className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-8 py-1.5 text-body-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 text-[11px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat.key
                      ? 'bg-primary-600 text-white font-semibold shadow-2xs'
                      : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Banks */}
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto divide-y divide-gray-50 py-1"
          >
            {filteredBanks.length === 0 ? (
              <li className="px-4 py-6 text-center text-body-sm text-gray-500">
                <p className="font-medium text-gray-700">Bank tidak ditemukan</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Coba gunakan kata kunci atau kode transfer lain.
                </p>
              </li>
            ) : (
              filteredBanks.map((bank) => {
                const isSelected =
                  currentBank?.id === bank.id || currentBank?.code === bank.code;

                return (
                  <li
                    key={bank.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(bank)}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors text-body-sm ${
                      isSelected
                        ? 'bg-primary-50/70 text-primary-900 font-semibold'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold shrink-0">
                        {bank.code}
                      </span>
                      <div className="truncate">
                        <span className="truncate block leading-tight">{bank.name}</span>
                        {bank.alias && (
                          <span className="text-[11px] text-gray-500 font-normal block mt-0.5">
                            Singkatan: <strong className="text-gray-700">{bank.alias}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                          bank.category
                        )}`}
                      >
                        {bank.category}
                      </span>
                      {isSelected && <Check size={16} className="text-primary-600" />}
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Daftar Resmi Sandi Bank Indonesia</span>
            <span>{filteredBanks.length} Bank</span>
          </div>
        </div>
      )}
    </div>
  );
};

