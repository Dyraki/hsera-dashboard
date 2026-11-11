// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

// Komponen uji pembantu
const TestConsumer: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('success', 'Data berhasil disimpan.')}>
        Trigger Success
      </button>
      <button onClick={() => showToast('error', 'Terjadi kesalahan server.', { title: 'Gagal Simpan' })}>
        Trigger Error Custom
      </button>
      <button onClick={() => showToast('warning', 'Harap periksa isian Anda.')}>
        Trigger Warning
      </button>
      <button onClick={() => showToast('info', 'Pembaruan sistem tersedia.')}>
        Trigger Info
      </button>
    </div>
  );
};

describe('ToastContext & Center Positioning Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('harus merender notifikasi di posisi tengah atas (Top-Center)', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    // Trigger toast
    fireEvent.click(screen.getByText('Trigger Success'));

    // Verifikasi pesan muncul
    expect(screen.getByText('Data berhasil disimpan.')).toBeDefined();
    expect(screen.getByText('Berhasil')).toBeDefined();

    // Verifikasi kelas posisi top-center
    const toastContainer = screen.getByRole('status');
    expect(toastContainer.className).toContain('left-1/2');
    expect(toastContainer.className).toContain('-translate-x-1/2');
    expect(toastContainer.className).toContain('top-6');
  });

  it('harus merender judul kustom dan varian error', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Error Custom'));

    expect(screen.getByText('Gagal Simpan')).toBeDefined();
    expect(screen.getByText('Terjadi kesalahan server.')).toBeDefined();
  });

  it('harus merender varian warning dan info', () => {
    const { unmount } = render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Warning'));
    expect(screen.getByText('Perhatian')).toBeDefined();
    expect(screen.getByText('Harap periksa isian Anda.')).toBeDefined();

    unmount();

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Info'));
    expect(screen.getByText('Informasi')).toBeDefined();
    expect(screen.getByText('Pembaruan sistem tersedia.')).toBeDefined();
  });

  it('harus menutup notifikasi saat tombol tutup X diklik', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Data berhasil disimpan.')).toBeDefined();

    // Klik tombol tutup
    const closeBtn = screen.getByRole('button', { name: 'Tutup notifikasi' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Data berhasil disimpan.')).toBeNull();
  });

  it('harus menutup otomatis setelah durasi timer habis', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Data berhasil disimpan.')).toBeDefined();

    // Fast-forward 4000ms
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Data berhasil disimpan.')).toBeNull();
  });
});
