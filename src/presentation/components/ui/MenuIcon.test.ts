import { describe, it, expect } from 'vitest';
import { getMenuIconComponent, AVAILABLE_MENU_ICONS } from './MenuIcon';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Briefcase,
  Target,
  ClipboardList,
  Activity,
  Settings,
  ListTree,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const getIconName = (component: any) => component?.displayName || component?.render?.name || component?.name;

describe('MenuIcon Resolver', () => {
  it('resolves direct Lucide icon names correctly', () => {
    expect(getIconName(getMenuIconComponent('LayoutDashboard'))).toBe(getIconName(LayoutDashboard));
    expect(getIconName(getMenuIconComponent('Building2'))).toBe(getIconName(Building2));
    expect(getIconName(getMenuIconComponent('Users'))).toBe(getIconName(Users));
    expect(getIconName(getMenuIconComponent('MapPin'))).toBe(getIconName(MapPin));
    expect(getIconName(getMenuIconComponent('Briefcase'))).toBe(getIconName(Briefcase));
    expect(getIconName(getMenuIconComponent('Target'))).toBe(getIconName(Target));
    expect(getIconName(getMenuIconComponent('Settings'))).toBe(getIconName(Settings));
    expect(getIconName(getMenuIconComponent('ShieldCheck'))).toBe(getIconName(ShieldCheck));
  });

  it('resolves legacy fontawesome and glyphicon strings correctly', () => {
    expect(getIconName(getMenuIconComponent('fa fa-dashboard'))).toBe(getIconName(LayoutDashboard));
    expect(getIconName(getMenuIconComponent('fa fa-users'))).toBe(getIconName(Users));
    expect(getIconName(getMenuIconComponent('fa fa-test'))).toBe(getIconName(UserCheck));
  });

  it('resolves icons based on menu name when icon is generic glyphicon-file or empty', () => {
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Dashboard'))).toBe(getIconName(LayoutDashboard));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Operation Unit'))).toBe(getIconName(Building2));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Karyawan'))).toBe(getIconName(Users));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Teritory Management'))).toBe(getIconName(MapPin));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Salesmanship'))).toBe(getIconName(Briefcase));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Setup Target'))).toBe(getIconName(Target));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Form Callsheet'))).toBe(getIconName(ClipboardList));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Monitoring Callsheet'))).toBe(getIconName(Activity));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Setup Menu'))).toBe(getIconName(ListTree));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Role Management'))).toBe(getIconName(ShieldCheck));
    expect(getIconName(getMenuIconComponent('glyphicon glyphicon-file', 'Role User'))).toBe(getIconName(UserCheck));
    expect(getIconName(getMenuIconComponent('', 'Pengaturan'))).toBe(getIconName(Settings));
  });

  it('provides a rich list of available menu icons for selection', () => {
    expect(AVAILABLE_MENU_ICONS.length).toBeGreaterThan(15);
    expect(AVAILABLE_MENU_ICONS.some(i => i.key === 'LayoutDashboard')).toBe(true);
    expect(AVAILABLE_MENU_ICONS.some(i => i.key === 'Building2')).toBe(true);
    expect(AVAILABLE_MENU_ICONS.some(i => i.key === 'Users')).toBe(true);
    expect(AVAILABLE_MENU_ICONS.some(i => i.key === 'MapPin')).toBe(true);
  });
});
