import { OperationUnit } from '../../domain/models/OperationUnit';
import { IOperationUnitRepository, OperationUnitFilterParams } from '../../domain/repositories/IOperationUnitRepository';

export class GetOperationUnits {
  constructor(private readonly repository: IOperationUnitRepository) {}

  execute(params?: OperationUnitFilterParams): Promise<OperationUnit[]> {
    return this.repository.list(params);
  }
}
