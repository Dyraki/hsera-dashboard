import { MenuAclRecord, RoleAclWriteData, RoleRecord, RoleWriteData } from '../../domain/models/Management';
import { IRoleRepository } from '../../domain/repositories/IManagementRepository';

export class ManageRoles {
  constructor(private readonly repository: IRoleRepository) {}

  list(): Promise<RoleRecord[]> { return this.repository.list(); }
  getAcls(roleId?: string): Promise<MenuAclRecord[]> { return this.repository.getAcls(roleId); }
  create(data: RoleWriteData): Promise<void> { return this.repository.create(data); }
  update(id: string, data: RoleWriteData): Promise<void> { return this.repository.update(id, data); }
  saveAcls(roleId: string, data: RoleAclWriteData[]): Promise<void> { return this.repository.saveAcls(roleId, data); }
  delete(id: string): Promise<void> { return this.repository.delete(id); }
}