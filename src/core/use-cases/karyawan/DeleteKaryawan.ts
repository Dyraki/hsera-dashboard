import { IKaryawanRepository } from '../../domain/repositories/IKaryawanRepository';

export class DeleteKaryawan {
  constructor(private readonly repository: IKaryawanRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}