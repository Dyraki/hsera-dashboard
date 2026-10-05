import { IAuthRepository } from '../domain/repositories/IAuthRepository';

export class AuthenticateUser {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(username: string, password: string): Promise<string> {
    if (!username.trim() || !password) {
      throw new Error('Username dan password wajib diisi.');
    }
    return await this.authRepository.login(username.trim(), password);
  }
}
