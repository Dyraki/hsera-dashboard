import { ManagedUser, ManagedUserWriteData } from '../models/Management';

export interface IManagedUserRepository {
  list(): Promise<ManagedUser[]>;
  create(data: ManagedUserWriteData): Promise<void>;
  update(id: string, data: ManagedUserWriteData): Promise<void>;
  updateRoles(id: string, roleIds: string[]): Promise<void>;
  delete(id: string): Promise<void>;
}