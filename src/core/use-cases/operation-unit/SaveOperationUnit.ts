import { OperationUnitWriteData } from '../../domain/models/OperationUnit';
import { IOperationUnitRepository } from '../../domain/repositories/IOperationUnitRepository';

export class SaveOperationUnit {
  constructor(private readonly repository: IOperationUnitRepository) {}

  create(data: OperationUnitWriteData): Promise<void> {
    return this.repository.create(data);
  }

  update(id: string, data: OperationUnitWriteData): Promise<void> {
    return this.repository.update(id, data);
  }
}