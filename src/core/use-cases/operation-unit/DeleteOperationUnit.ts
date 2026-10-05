import { IOperationUnitRepository } from '../../domain/repositories/IOperationUnitRepository';

export class DeleteOperationUnit {
  constructor(private readonly repository: IOperationUnitRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}