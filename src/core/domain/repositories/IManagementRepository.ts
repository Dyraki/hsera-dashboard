import {
  MenuAclRecord,
  MenuNode,
  MenuRecord,
  MenuWriteData,
  RoleAclWriteData,
  RoleRecord,
  RoleWriteData
} from '../models/Management';

export interface IMenuRepository {
  list(): Promise<MenuRecord[]>;
  getNavigationTree(): Promise<MenuNode[]>;
  create(data: MenuWriteData): Promise<void>;
  update(id: string, data: MenuWriteData): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IRoleRepository {
  list(): Promise<RoleRecord[]>;
  getAcls(roleId?: string): Promise<MenuAclRecord[]>;
  create(data: RoleWriteData): Promise<void>;
  update(id: string, data: RoleWriteData): Promise<void>;
  saveAcls(roleId: string, data: RoleAclWriteData[]): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IDashboardRepository {
  getStatus(): Promise<string>;
}