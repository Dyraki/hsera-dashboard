// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Select } from './Select';

describe('Select Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders disabled placeholder when options do not contain empty value', () => {
    render(
      <Select
        label="Test Select"
        options={[
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
        ]}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.options.length).toBe(3);
    expect(select.options[0].value).toBe('');
    expect(select.options[0].disabled).toBe(true);
    expect(select.options[0].text).toBe('Pilih opsi...');
  });

  it('does NOT render disabled placeholder when options include an empty value option', () => {
    render(
      <Select
        label="Cakupan District"
        options={[
          { value: '', label: 'Semua District di Unit BDG' },
          { value: 'dist-1', label: 'D1 - John' },
        ]}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.options.length).toBe(2);
    expect(select.options[0].value).toBe('');
    expect(select.options[0].disabled).toBe(false);
    expect(select.options[0].text).toBe('Semua District di Unit BDG');
  });

  it('allows selecting empty value option without getting stuck on disabled placeholder', () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Cakupan District"
        value="dist-1"
        onChange={handleChange}
        options={[
          { value: '', label: 'Semua District di Unit BDG' },
          { value: 'dist-1', label: 'D1 - John' },
        ]}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('dist-1');

    fireEvent.change(select, { target: { value: '' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('does not render placeholder if placeholder="" is explicitly passed', () => {
    render(
      <Select
        label="Test Select"
        placeholder=""
        options={[
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
        ]}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.options.length).toBe(2);
    expect(select.options[0].value).toBe('opt1');
  });
});

