// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SearchableBankSelect } from './SearchableBankSelect';
import { INDONESIA_BANKS } from '@/core/constants/banks';

describe('SearchableBankSelect Component', () => {
  afterEach(() => {
    cleanup();
  });

  const bca = INDONESIA_BANKS.find((b) => b.code === '014')!;
  const mandiri = INDONESIA_BANKS.find((b) => b.code === '008')!;

  it('renders with placeholder when no bank is selected', () => {
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Nama Bank')).toBeDefined();
    expect(screen.getByText('Pilih / Cari Nama Bank...')).toBeDefined();
  });

  it('displays the selected bank name, code, and alias when value is provided', () => {
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value={bca.id}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('014')).toBeDefined();
    expect(screen.getByText('Bank Central Asia')).toBeDefined();
    expect(screen.getByText('(BCA)')).toBeDefined();
  });

  it('opens dropdown when clicked and lists bank options', () => {
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value=""
        onChange={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /Pilih \/ Cari Nama Bank/i });
    fireEvent.click(trigger);

    // Search input should be visible
    expect(screen.getByPlaceholderText(/Cari nama bank, kode/i)).toBeDefined();

    // Check category filter chips
    expect(screen.getByRole('button', { name: /^Semua/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^BUMN/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^Swasta/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^BPD/i })).toBeDefined();
  });

  it('filters banks by search query (name or code)', () => {
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value=""
        onChange={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /Pilih \/ Cari Nama Bank/i });
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText(/Cari nama bank, kode/i);
    fireEvent.change(searchInput, { target: { value: 'Mandiri' } });

    // Mandiri should be visible in search results
    expect(screen.getByText('Bank Mandiri')).toBeDefined();
    expect(screen.getByText('008')).toBeDefined();

    // BCA should be filtered out
    expect(screen.queryByText('Bank Central Asia')).toBeNull();
  });

  it('filters banks by category chips', () => {
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value=""
        onChange={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /Pilih \/ Cari Nama Bank/i });
    fireEvent.click(trigger);

    const bumnChip = screen.getByRole('button', { name: /^BUMN/i });
    fireEvent.click(bumnChip);

    // Bank Rakyat Indonesia (BRI) is BUMN, should be visible
    expect(screen.getByText('Bank Rakyat Indonesia')).toBeDefined();

    // BCA is Swasta, should not be visible when BUMN filter is active
    expect(screen.queryByText('Bank Central Asia')).toBeNull();
  });

  it('calls onChange with bank id when option is selected', () => {
    const handleChange = vi.fn();
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value=""
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('button', { name: /Pilih \/ Cari Nama Bank/i });
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText(/Cari nama bank, kode/i);
    fireEvent.change(searchInput, { target: { value: '008' } });

    const mandiriOption = screen.getByText('Bank Mandiri');
    fireEvent.click(mandiriOption);

    expect(handleChange).toHaveBeenCalledWith(mandiri.id);
  });

  it('allows clearing the selection via clear button', () => {
    const handleChange = vi.fn();
    render(
      <SearchableBankSelect
        label="Nama Bank"
        value={bca.id}
        onChange={handleChange}
      />
    );

    const clearButton = screen.getByTitle(/Hapus Pilihan Bank/i);
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
