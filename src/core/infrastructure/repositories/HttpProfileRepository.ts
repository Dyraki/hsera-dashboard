import { IProfileRepository, UserProfileResponse, UpdateContactPayload } from '../../domain/repositories/IProfileRepository';
import { AppError } from '../../domain/errors/AppError';
import { AxiosHttpClient } from '../api/AxiosHttpClient';

export class HttpProfileRepository implements IProfileRepository {
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await AxiosHttpClient.get<UserProfileResponse>('/api/auth/profile');
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal memuat data profil.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }

  async updateContact(payload: UpdateContactPayload): Promise<{ message: string }> {
    try {
      const response = await AxiosHttpClient.put<{ message: string }>('/api/auth/profile', payload);
      return response.data;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      const msg = error.response?.data?.message || error.message || 'Gagal memperbarui data kontak.';
      throw new AppError(msg, error.response?.status || 500);
    }
  }
}
