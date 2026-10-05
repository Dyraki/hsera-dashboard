import { OperationUnit, OperationUnitWriteData } from '../models/OperationUnit';

export interface IOperationUnitRepository {
  getTree(): Promise<OperationUnit[]>;
  list(): Promise<OperationUnit[]>;
  getById(id: string): Promise<OperationUnit>;
  create(data: OperationUnitWriteData): Promise<void>;
  update(id: string, data: OperationUnitWriteData): Promise<void>;
  delete(id: string): Promise<void>;
}