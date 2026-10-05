import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AppError } from '../../domain/errors/AppError';
import { AxiosHttpClient } from '../api/AxiosHttpClient';

export class HttpAuthRepository implements IAuthRepository {
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await AxiosHttpClient.post<{ accessToken: string }>('/api/auth/login', {
        username,
        password
      });
      return response.data.accessToken;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(error instanceof Error ? error.message : 'Gagal menghubungi server. Silakan periksa koneksi Anda.');
    }
  }
}
