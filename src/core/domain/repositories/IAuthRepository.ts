export interface IAuthRepository {
  login(username: string, password: string): Promise<string>; // Mengembalikan token JWT string
}
