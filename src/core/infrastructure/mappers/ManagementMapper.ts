import {
  ManagedUser,
  ManagedUserRole,
  ManagedUserWriteData,
  MenuAclRecord,
  MenuNode,
  MenuRecord,
  MenuWriteData,
  RoleAclWriteData,
  RoleRecord,
  RoleWriteData
} from '../../domain/models/Management';
import {
  ManagedUserDto,
  ManagedUserRoleDto,
  ManagedUserWriteDto,
  MenuAclDto,
  MenuDto,
  MenuNodeDto,
  MenuWriteDto,
  RoleAclWriteDto,
  RoleDto,
  RoleWriteDto
} from '../dto/ManagementDto';

export const toMenuRecord = (dto: MenuDto): MenuRecord => ({
  id: dto.id,
  upline: dto.upline || '',
  urut: dto.urut,
  nama: dto.nama,
  tipe: dto.tipe,
  level: dto.level,
  link: dto.link || '',
  icon: dto.icon || '',
  aktif: dto.aktif
});

export const toMenuNode = (dto: MenuNodeDto): MenuNode => ({
  id: dto.id,
  nama: dto.nama,
  link: dto.link,
  icon: dto.icon,
  tipe: dto.tipe,
  submenus: dto.submenus?.map(toMenuNode)
});

export const toMenuWriteDto = (data: MenuWriteData): MenuWriteDto => ({
  id: data.id,
  upline: data.upline,
  urut: data.urut,
  nama: data.nama,
  tipe: data.tipe,
  level: data.level,
  link: data.link,
  icon: data.icon,
  aktif: data.aktif
});

export const toRoleRecord = (dto: RoleDto): RoleRecord => ({
  id: dto.id,
  nama: dto.nama,
  aktif: dto.aktif
});

export const toMenuAclRecord = (dto: MenuAclDto): MenuAclRecord => ({
  id: dto.id,
  upline: dto.upline || '',
  urut: dto.urut,
  nama: dto.nama,
  level: dto.level,
  tipe: dto.tipe,
  acl: { ...dto.acl }
});

export const toRoleWriteDto = (data: RoleWriteData): RoleWriteDto => ({
  id: data.id,
  nama: data.nama,
  aktif: data.aktif
});

export const toRoleAclWriteDto = (data: RoleAclWriteData): RoleAclWriteDto => ({
  menuId: data.menuId,
  enable: data.enable,
  level: data.level
});

const toManagedUserRole = (dto: ManagedUserRoleDto): ManagedUserRole => ({
  id: dto.id,
  nama: dto.nama,
  aktif: dto.aktif
});

export const toManagedUser = (dto: ManagedUserDto): ManagedUser => ({
  id: dto.id,
  username: dto.username,
  aktif: dto.aktif,
  tgl1: dto.tgl1,
  tgl2: dto.tgl2,
  jenis: dto.jenis,
  idRelasi: dto.idRelasi,
  roles: (dto.roles || []).map(toManagedUserRole)
});

export const toManagedUserWriteDto = (data: ManagedUserWriteData): ManagedUserWriteDto => ({
  id: data.id,
  username: data.username,
  password: data.password,
  aktif: data.aktif,
  tgl1: data.tgl1,
  tgl2: data.tgl2,
  jenis: data.jenis,
  idRelasi: data.idRelasi,
  roleIds: data.roleIds
});
