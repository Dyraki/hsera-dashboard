// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with basic props and shows correct range info', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={45}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Menampilkan/i)).toBeDefined();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('45')).toBeDefined();
  });

  it('renders page size selector with 10, 50, 100 options', () => {
    const handleSizeChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        totalItems={100}
        pageSize={10}
        pageSizeOptions={[10, 50, 100]}
        onPageChange={vi.fn()}
        onPageSizeChange={handleSizeChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();

    fireEvent.change(select, { target: { value: '50' } });
    expect(handleSizeChange).toHaveBeenCalledWith(50);
  });

  it('calls onPageChange when clicking next button', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalItems={45}
        pageSize={10}
        onPageChange={handlePageChange}
      />
    );

    const nextBtn = screen.getByLabelText('Halaman Berikutnya');
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={45}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );

    expect((screen.getByLabelText('Halaman Sebelumnya') as HTMLButtonElement).disabled).toBe(true);

    rerender(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalItems={45}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );

    expect((screen.getByLabelText('Halaman Berikutnya') as HTMLButtonElement).disabled).toBe(true);
  });
});
