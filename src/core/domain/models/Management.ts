export interface MenuRecord {
  id: string;
  upline: string;
  urut: number;
  nama: string;
  tipe: string;
  level: number;
  link: string;
  icon: string;
  aktif: number;
}

export interface MenuNode {
  id: string;
  nama: string;
  link: string | null;
  icon?: string | null;
  tipe: string;
  submenus?: MenuNode[];
}

export type MenuWriteData = Omit<MenuRecord, 'id' | 'upline'> & {
  id?: string;
  upline: string | null;
  aktif: number;
};

export interface RoleRecord {
  id: string;
  nama: string;
  aktif: number;
}

export interface MenuAclRecord {
  id: string;
  upline: string;
  urut: number;
  nama: string;
  level: number;
  tipe: string;
  acl: {
    enable: number;
    level: number;
    c: number;
    r: number;
    u: number;
    d: number;
  };
}

export interface RoleWriteData {
  id: string;
  nama: string;
  aktif: number;
}

export interface RoleAclWriteData {
  menuId: string;
  enable: number;
  level: number;
}

export interface ManagedUserRole {
  id: string;
  nama: string;
  aktif: number;
}

export interface ManagedUser {
  id: string;
  username: string;
  aktif: number;
  tgl1: string;
  tgl2: string;
  jenis: string;
  idRelasi: string;
  roles: ManagedUserRole[];
}

export interface ManagedUserWriteData {
  id?: string;
  username?: string;
  password?: string;
  aktif?: number;
  tgl1?: string;
  tgl2?: string;
  jenis?: string;
  idRelasi?: string;
  roleIds?: string[];
}
