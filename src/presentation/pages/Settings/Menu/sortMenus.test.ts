import { describe, expect, it } from 'vitest';
import { MenuRecord } from '@/core/domain/models/Management';
import { sortMenusByHierarchy } from './sortMenus';

const menu = (id: string, nama: string, upline: string, urut: number, level: number): MenuRecord => ({
  id,
  nama,
  upline,
  urut,
  level,
  tipe: 'Menu',
  link: '',
  icon: '',
  aktif: 1
});

describe('sortMenusByHierarchy', () => {
  it('keeps every child below its parent and orders siblings by urut', () => {
    const result = sortMenusByHierarchy([
      menu('master-child-2', 'Karyawan', 'master', 2, 2),
      menu('settings-child', 'Setup Menu', 'settings', 1, 2),
      menu('dashboard', 'Dashboard', '', 1, 1),
      menu('master', 'Master', '', 2, 1),
      menu('master-child-1', 'Operation Unit', 'master', 1, 2),
      menu('settings', 'Pengaturan', '', 10, 1)
    ]);

    expect(result.map(({ id }) => id)).toEqual([
      'dashboard',
      'master',
      'master-child-1',
      'master-child-2',
      'settings',
      'settings-child'
    ]);
  });

  it('keeps orphaned/cyclic records visible without looping', () => {
    const result = sortMenusByHierarchy([
      menu('a', 'A', 'b', 1, 2),
      menu('b', 'B', 'a', 1, 2),
      menu('orphan', 'Orphan', 'missing', 3, 2)
    ]);

    expect(result).toHaveLength(3);
    expect(new Set(result.map(({ id }) => id)).size).toBe(3);
  });

  it('orders ACL rows by their upline and urut fields', () => {
    const aclRows = sortMenusByHierarchy([
      { id: 'child-b', upline: 'master', urut: 2, acl: { enable: 1 } },
      { id: 'settings', upline: '', urut: 3, acl: { enable: 0 } },
      { id: 'master', upline: '', urut: 2, acl: { enable: 1 } },
      { id: 'child-a', upline: 'master', urut: 1, acl: { enable: 0 } }
    ]);

    expect(aclRows.map(({ id }) => id)).toEqual(['master', 'child-a', 'child-b', 'settings']);
    expect(aclRows[1].acl.enable).toBe(0);
  });
});
