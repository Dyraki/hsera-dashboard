import { MenuNode, MenuRecord, MenuWriteData } from '../../domain/models/Management';
import { IMenuRepository } from '../../domain/repositories/IManagementRepository';

export class ManageMenus {
  constructor(private readonly repository: IMenuRepository) {}

  list(): Promise<MenuRecord[]> { return this.repository.list(); }
  navigationTree(): Promise<MenuNode[]> { return this.repository.getNavigationTree(); }
  create(data: MenuWriteData): Promise<void> { return this.repository.create(data); }
  update(id: string, data: MenuWriteData): Promise<void> { return this.repository.update(id, data); }
  delete(id: string): Promise<void> { return this.repository.delete(id); }
}