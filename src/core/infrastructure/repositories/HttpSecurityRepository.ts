import { ISecurityRepository, ActiveSession, ChangePasswordPayload } from '../../domain/repositories/ISecurityRepository';
import { AppError } from '../../domain/errors/AppError';
import { AxiosHttpClient } from '../api/AxiosHttpClient';

export class HttpSecurityRepository implements ISecurityRepository {
  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    try {
      const response = await AxiosHttpClient.put<{ message: string }>('/api/auth/security/password', payload);
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal memperbarui kata sandi.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    try {
      const response = await AxiosHttpClient.get<ActiveSession[]>('/api/auth/sessions');
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal memuat sesi aktif.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    try {
      const response = await AxiosHttpClient.delete<{ message: string }>(`/api/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal mencabut sesi perangkat.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    try {
      const response = await AxiosHttpClient.post<{ message: string }>('/api/auth/logout-all');
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal mencabut seluruh sesi perangkat.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }
}
