import { describe, expect, it } from 'vitest';
import { toManagedUser, toMenuNode, toMenuRecord, toMenuWriteDto } from './ManagementMapper';

describe('ManagementMapper', () => {
  it('normalizes nullable menu fields and maps nested navigation nodes', () => {
    expect(toMenuRecord({
      id: 'dashboard', upline: null, urut: 1, nama: 'Dashboard', tipe: 'Menu', level: 1,
      link: null, icon: null, aktif: 1
    })).toMatchObject({ id: 'dashboard', upline: '', link: '', icon: '' });

    expect(toMenuNode({
      id: 'root', nama: 'Master', link: null, tipe: 'Header',
      submenus: [{ id: 'child', nama: 'Employees', link: '/master/karyawan', tipe: 'Menu' }]
    }).submenus?.[0].link).toBe('/master/karyawan');
  });

  it('maps domain menu write values into an explicit API payload', () => {
    expect(toMenuWriteDto({
      id: 'menu-1', upline: null, urut: 2, nama: 'Menu', tipe: 'Menu', level: 1,
      link: 'master/menu', icon: 'grid', aktif: 1
    })).toEqual({
      id: 'menu-1', upline: null, urut: 2, nama: 'Menu', tipe: 'Menu', level: 1,
      link: 'master/menu', icon: 'grid', aktif: 1
    });
  });

  it('maps managed user role relations into domain models', () => {
    expect(toManagedUser({
      id: 'u-1', username: 'worker', aktif: 1, tgl1: '2026-01-01', tgl2: '2030-01-01',
      jenis: 'pegawai', idRelasi: 'emp-1', roles: [{ id: 'r-1', nama: 'Staff', aktif: 1 }]
    }).roles[0].nama).toBe('Staff');
  });
});
