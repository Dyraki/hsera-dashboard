import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpSecurityRepository } from '../../../../core/infrastructure/repositories/HttpSecurityRepository';
import { AxiosHttpClient } from '../../../../core/infrastructure/api/AxiosHttpClient';
import { SYSTEM_MENU_IDS } from '../../../../core/constants/MenuConstants';
import { routePaths } from '../../../../routes/routePaths';

vi.mock('../../../../core/infrastructure/api/AxiosHttpClient', () => ({
  AxiosHttpClient: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Security Module Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus memiliki Menu ID dan Route Path yang sesuai dengan konfigurasi keamanan', () => {
    expect(SYSTEM_MENU_IDS.SECURITY).toBe('5cb43017-0e79-4f4f-a197-8c70c7487160');
    expect(routePaths.security).toBe('/settings/security');
  });

  it('HttpSecurityRepository.changePassword harus memanggil endpoint pergantian sandi mandiri', async () => {
    (AxiosHttpClient.put as any).mockResolvedValue({
      data: { message: 'Kata sandi berhasil diperbarui dengan aman.' },
    });

    const repo = new HttpSecurityRepository();
    const result = await repo.changePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'SecurePassword88#@',
    });

    expect(AxiosHttpClient.put).toHaveBeenCalledWith('/api/auth/security/password', {
      currentPassword: 'OldPassword123!',
      newPassword: 'SecurePassword88#@',
    });
    expect(result.message).toContain('berhasil diperbarui');
  });

  it('HttpSecurityRepository.getActiveSessions harus mengambil daftar sesi perangkat', async () => {
    const mockSessions = [
      {
        id: 'sess-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 Chrome/120.0',
        createdAt: '2026-11-10T10:00:00Z',
        updatedAt: '2026-11-10T12:00:00Z',
        expiresAt: '2026-11-17T10:00:00Z',
        isCurrent: true,
      },
    ];

    (AxiosHttpClient.get as any).mockResolvedValue({ data: mockSessions });

    const repo = new HttpSecurityRepository();
    const result = await repo.getActiveSessions();

    expect(AxiosHttpClient.get).toHaveBeenCalledWith('/api/auth/sessions');
    expect(result).toHaveLength(1);
    expect(result[0].isCurrent).toBe(true);
  });

  it('HttpSecurityRepository.revokeSession harus memanggil DELETE pada sesi tertentu', async () => {
    (AxiosHttpClient.delete as any).mockResolvedValue({
      data: { message: 'Sesi berhasil dinonaktifkan.' },
    });

    const repo = new HttpSecurityRepository();
    const result = await repo.revokeSession('sess-target-id');

    expect(AxiosHttpClient.delete).toHaveBeenCalledWith('/api/auth/sessions/sess-target-id');
    expect(result.message).toContain('berhasil dinonaktifkan');
  });

  it('HttpSecurityRepository.revokeAllSessions harus memanggil POST /api/auth/logout-all', async () => {
    (AxiosHttpClient.post as any).mockResolvedValue({
      data: { message: 'Seluruh sesi perangkat berhasil dicabut.' },
    });

    const repo = new HttpSecurityRepository();
    const result = await repo.revokeAllSessions();

    expect(AxiosHttpClient.post).toHaveBeenCalledWith('/api/auth/logout-all');
    expect(result.message).toContain('berhasil dicabut');
  });
});
