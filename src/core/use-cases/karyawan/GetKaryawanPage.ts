import { KaryawanListQuery, KaryawanPage } from '../../domain/models/Karyawan';
import { IKaryawanRepository } from '../../domain/repositories/IKaryawanRepository';

export class GetKaryawanPage {
  constructor(private readonly repository: IKaryawanRepository) {}

  execute(query: KaryawanListQuery): Promise<KaryawanPage> {
    return this.repository.list(query);
  }
}