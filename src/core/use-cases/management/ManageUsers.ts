import { ManagedUser, ManagedUserWriteData } from '../../domain/models/Management';
import { IManagedUserRepository } from '../../domain/repositories/IManagedUserRepository';

export class ManageUsers {
  constructor(private readonly repository: IManagedUserRepository) {}

  list(): Promise<ManagedUser[]> { return this.repository.list(); }
  create(data: ManagedUserWriteData): Promise<void> { return this.repository.create(data); }
  update(id: string, data: ManagedUserWriteData): Promise<void> { return this.repository.update(id, data); }
  updateRoles(id: string, roleIds: string[]): Promise<void> { return this.repository.updateRoles(id, roleIds); }
  delete(id: string): Promise<void> { return this.repository.delete(id); }
}