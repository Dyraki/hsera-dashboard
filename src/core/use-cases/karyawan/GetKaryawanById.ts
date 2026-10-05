import { Karyawan } from '../../domain/models/Karyawan';
import { IKaryawanRepository } from '../../domain/repositories/IKaryawanRepository';

export class GetKaryawanById {
  constructor(private readonly repository: IKaryawanRepository) {}

  execute(id: string): Promise<Karyawan> {
    return this.repository.getById(id);
  }
}