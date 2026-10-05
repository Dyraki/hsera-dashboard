export interface MenuDto {
  id: string;
  upline?: string | null;
  urut: number;
  nama: string;
  tipe: string;
  level: number;
  link?: string | null;
  icon?: string | null;
  aktif: number;
}

export interface MenuNodeDto {
  id: string;
  nama: string;
  link: string | null;
  icon?: string | null;
  tipe: string;
  submenus?: MenuNodeDto[];
}

export interface RoleDto {
  id: string;
  nama: string;
  aktif: number;
}

export interface MenuAclDto {
  id: string;
  upline?: string | null;
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

export interface ManagedUserRoleDto {
  id: string;
  nama: string;
  aktif: number;
}

export interface ManagedUserDto {
  id: string;
  username: string;
  aktif: number;
  tgl1: string;
  tgl2: string;
  jenis: string;
  idRelasi: string;
  roles: ManagedUserRoleDto[];
}

export interface MenuWriteDto {
  id?: string;
  upline: string | null;
  urut: number;
  nama: string;
  tipe: string;
  level: number;
  link: string;
  icon: string;
  aktif: number;
}

export interface RoleWriteDto {
  id: string;
  nama: string;
  aktif: number;
}

export interface RoleAclWriteDto {
  menuId: string;
  enable: number;
  level: number;
}

export interface ManagedUserWriteDto {
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
