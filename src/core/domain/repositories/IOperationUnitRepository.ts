import { OperationUnit, OperationUnitWriteData } from '../models/OperationUnit';

export interface OperationUnitFilterParams {
  scope?: boolean;
  onlyBranches?: boolean;
  type?: string;
  status?: boolean;
  search?: string;
}

export interface IOperationUnitRepository {
  getTree(): Promise<OperationUnit[]>;
  list(params?: OperationUnitFilterParams): Promise<OperationUnit[]>;
  getById(id: string): Promise<OperationUnit>;
  create(data: OperationUnitWriteData): Promise<void>;
  update(id: string, data: OperationUnitWriteData): Promise<void>;
  delete(id: string): Promise<void>;
}
