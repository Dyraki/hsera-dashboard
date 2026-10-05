import { OperationUnit } from '../../domain/models/OperationUnit';
import { IOperationUnitRepository } from '../../domain/repositories/IOperationUnitRepository';

export class GetOperationUnitTree {
  constructor(private readonly repository: IOperationUnitRepository) {}

  execute(): Promise<OperationUnit[]> {
    return this.repository.getTree();
  }
}