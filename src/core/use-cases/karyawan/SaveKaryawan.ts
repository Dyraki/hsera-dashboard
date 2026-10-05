import { KaryawanWriteData } from '../../domain/models/Karyawan';
import { IKaryawanRepository } from '../../domain/repositories/IKaryawanRepository';

export class SaveKaryawan {
  constructor(private readonly repository: IKaryawanRepository) {}

  create(data: KaryawanWriteData): Promise<void> {
    return this.repository.create(data);
  }

  update(id: string, data: KaryawanWriteData): Promise<void> {
    return this.repository.update(id, data);
  }
}