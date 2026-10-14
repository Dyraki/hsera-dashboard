import React from 'react';
import {
  LayoutDashboard,
  LayoutGrid,
  Database,
  Building2,
  Users,
  UserCheck,
  Briefcase,
  MapPin,
  Target,
  ClipboardList,
  Activity,
  Settings,
  ListTree,
  ShieldCheck,
  Receipt,
  Layers,
  Store,
  Megaphone,
  Lightbulb,
  HeartPulse,
  Timer,
  Clock,
  LifeBuoy,
  FileText,
  FolderKanban,
  FolderTree,
  FileSpreadsheet,
  Sparkles,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

export interface MenuIconOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const AVAILABLE_MENU_ICONS: MenuIconOption[] = [
  { key: 'LayoutDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Database', label: 'Master / Data', icon: Database },
  { key: 'Building2', label: 'Operation Unit / Kantor', icon: Building2 },
  { key: 'Users', label: 'Karyawan / Users / Customer', icon: Users },
  { key: 'UserCheck', label: 'Role User / Approval', icon: UserCheck },
  { key: 'ShieldCheck', label: 'Role Management / Security', icon: ShieldCheck },
  { key: 'Briefcase', label: 'Salesmanship / Bisnis', icon: Briefcase },
  { key: 'MapPin', label: 'Territory / Wilayah', icon: MapPin },
  { key: 'Target', label: 'Target / Goals', icon: Target },
  { key: 'ClipboardList', label: 'Callsheet / Formulir', icon: ClipboardList },
  { key: 'Activity', label: 'Monitoring / Aktivitas', icon: Activity },
  { key: 'Receipt', label: 'Tagihan / Invoice', icon: Receipt },
  { key: 'Layers', label: 'Paket / Layanan', icon: Layers },
  { key: 'Store', label: 'Outlet / Toko', icon: Store },
  { key: 'Megaphone', label: 'Broadcast / Pengumuman', icon: Megaphone },
  { key: 'Lightbulb', label: 'Usulan Fitur / Ide', icon: Lightbulb },
  { key: 'HeartPulse', label: 'Kesehatan Sistem', icon: HeartPulse },
  { key: 'Timer', label: 'Cron Jobs / Waktu', icon: Timer },
  { key: 'Settings', label: 'Pengaturan / Settings', icon: Settings },
  { key: 'ListTree', label: 'Setup Menu / Navigasi', icon: ListTree },
  { key: 'LifeBuoy', label: 'Support / Bantuan', icon: LifeBuoy },
  { key: 'FileText', label: 'Dokumen / Berkas', icon: FileText },
  { key: 'FileSpreadsheet', label: 'Sheet / Spreadsheet', icon: FileSpreadsheet },
  { key: 'Sparkles', label: 'Design System / AI', icon: Sparkles },
];

const ICON_MAP: Record<string, LucideIcon> = {
  layoutdashboard: LayoutDashboard,
  layoutgrid: LayoutGrid,
  database: Database,
  building2: Building2,
  building: Building2,
  users: Users,
  user: Users,
  usercheck: UserCheck,
  shieldcheck: ShieldCheck,
  shield: ShieldCheck,
  briefcase: Briefcase,
  mappin: MapPin,
  pin: MapPin,
  target: Target,
  clipboardlist: ClipboardList,
  clipboard: ClipboardList,
  activity: Activity,
  heartpulse: HeartPulse,
  receipt: Receipt,
  layers: Layers,
  store: Store,
  megaphone: Megaphone,
  lightbulb: Lightbulb,
  timer: Timer,
  clock: Clock,
  settings: Settings,
  listtree: ListTree,
  lifebuoy: LifeBuoy,
  filetext: FileText,
  folderkanban: FolderKanban,
  foldertree: FolderTree,
  filespreadsheet: FileSpreadsheet,
  sparkles: Sparkles,
  helpcircle: HelpCircle,
};

// Intelligently resolve icon component from icon string and menu name
export const getMenuIconComponent = (iconName?: string | null, menuName?: string | null): LucideIcon => {
  const raw = (iconName || '').trim();
  // Strip spaces, dashes, and underscores
  const lower = raw.toLowerCase().replace(/[\s\-_]/g, '');

  // 1. Check direct match in ICON_MAP
  if (lower && ICON_MAP[lower]) {
    return ICON_MAP[lower];
  }

  // 2. Check legacy FontAwesome / Glyphicon strings
  if (lower.includes('dashboard')) return LayoutDashboard;
  if (lower.includes('users') || lower.includes('user')) return Users;
  if (lower.includes('grid') || lower.includes('th')) return LayoutGrid;
  if (lower.includes('test')) return UserCheck;
  if (lower.includes('lock') || lower.includes('shield')) return ShieldCheck;
  if (lower.includes('cog') || lower.includes('gear') || lower.includes('settings')) return Settings;
  if (lower.includes('map') || lower.includes('pin')) return MapPin;
  if (lower.includes('building') || lower.includes('unit')) return Building2;

  // 3. Fallback / Smart keyword resolution from Menu Name (especially when icon is generic 'glyphicon glyphicon-file' or empty)
  const name = (menuName || '').toLowerCase();
  if (name.includes('dashboard')) return LayoutDashboard;
  if (name.includes('master')) return Database;
  if (name.includes('unit') || name.includes('cabang')) return Building2;
  if (name.includes('karyawan') || name.includes('pegawai') || name.includes('customer') || name.includes('pelanggan')) return Users;
  if (name.includes('territory') || name.includes('teritory') || name.includes('wilayah')) return MapPin;
  if (name.includes('sales')) return Briefcase;
  if (name.includes('target')) return Target;
  if (name.includes('monitoring')) return Activity;
  if (name.includes('callsheet') || name.includes('call sheet')) return ClipboardList;
  if (name.includes('pengaturan') || name.includes('settings') || name.includes('setting')) return Settings;
  if (name.includes('menu')) return ListTree;
  if (name.includes('role user') || name.includes('user role')) return UserCheck;
  if (name.includes('role')) return ShieldCheck;
  if (name.includes('tagihan') || name.includes('invoice') || name.includes('billing')) return Receipt;
  if (name.includes('paket') || name.includes('package')) return Layers;
  if (name.includes('outlet') || name.includes('toko') || name.includes('store')) return Store;
  if (name.includes('broadcast') || name.includes('pengumuman')) return Megaphone;
  if (name.includes('usulan') || name.includes('fitur') || name.includes('ide')) return Lightbulb;
  if (name.includes('kesehatan') || name.includes('health')) return HeartPulse;
  if (name.includes('cron') || name.includes('job') || name.includes('schedule')) return Timer;
  if (name.includes('support') || name.includes('bantuan') || name.includes('help')) return LifeBuoy;
  if (name.includes('design') || name.includes('ui')) return Sparkles;

  // 4. Default fallback
  return FileText;
};

interface MenuIconProps {
  icon?: string | null;
  name?: string | null;
  className?: string;
  size?: number;
}

export const MenuIcon: React.FC<MenuIconProps> = ({
  icon,
  name,
  className = '',
  size = 18,
}) => {
  const IconComponent = getMenuIconComponent(icon, name);
  return <IconComponent size={size} className={className} />;
};

export default MenuIcon;
