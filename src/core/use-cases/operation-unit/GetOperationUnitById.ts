import { OperationUnit } from '../../domain/models/OperationUnit';
import { IOperationUnitRepository } from '../../domain/repositories/IOperationUnitRepository';

export class GetOperationUnitById {
  constructor(private readonly repository: IOperationUnitRepository) {}

  execute(id: string): Promise<OperationUnit> {
    return this.repository.getById(id);
  }
}