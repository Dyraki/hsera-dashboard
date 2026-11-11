import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User } from '@/core/domain/models/User';
import { routePaths } from '@/routes/routePaths';
import {
  Bell,
  ChevronDown,
  LogOut,
  Building2,
  Menu,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const formatRoleName = (role?: string | null): string => {
  if (!role) return '';
  return role
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getRoleManagementDisplay = (user: User | null): string => {
  if (!user) return '';

  // 1. Ambil dari nama role utama di user.roleName
  if (user.roleName) {
    return formatRoleName(user.roleName);
  }

  // 2. Ambil dari relasi daftar roles (login_grp)
  if (user.roles && user.roles.length > 0) {
    const activeRole = user.roles.find((r) => r.aktif === 1) || user.roles[0];
    if (activeRole?.nama) {
      return formatRoleName(activeRole.nama);
    }
  }

  // 3. Fallback jika user adalah Super Admin
  if (user.jenis === 'SA' || user.username === 'admin' || user.scope?.isSuperAdmin) {
    return 'Super Admin';
  }

  // 4. Fallback hirarki teritori Operation Unit (unitType)
  const unitType = user.scope?.unitType || user.karyawan?.unitType;
  if (unitType === 'REGIONAL') return 'Regional Manager';
  if (unitType === 'AREA_OFFICE') return 'Area Manager';
  if (unitType === 'OPERATION_UNIT') return 'Supervisor';
  if (unitType === 'HEAD_OFFICE') return 'Head Office';

  // 5. Fallback jenis akun
  if (user.jenis === 'pegawai') return 'Admin Staff';
  return formatRoleName(user.jenis);
};

export const Header: React.FC<HeaderProps> = ({ sidebarOpen = false, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const roleDisplay = getRoleManagementDisplay(user);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
      
      {/* Header Left (Sidebar Toggle Button & App Context) */}
      <div className="flex items-center gap-3">
        {setSidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -ml-1 sm:ml-0 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            title={sidebarOpen ? "Perkecil / Tutup menu navigasi" : "Perluas / Buka menu navigasi"}
            aria-label="Toggle menu navigasi"
          >
            <Menu size={22} className="stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Header Right (Actions & Avatar) */}
      <div className="flex items-center gap-4">
        
        {user?.karyawan?.unitName && (
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
            <Building2 size={14} className="text-primary-600 shrink-0" />
            <span className="truncate max-w-[180px] font-semibold">{user.karyawan.unitName}</span>
            <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-mono font-bold">
              {user.karyawan.unitType === 'HEAD_OFFICE' ? 'HO' : user.karyawan.unitType === 'REGIONAL' ? 'REG' : user.karyawan.unitType === 'AREA_OFFICE' ? 'AREA' : 'OU'}
            </span>
          </div>
        )}

        {/* Notification Bell */}
        <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200/80 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500 border border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Name & Role (Left) */}
            <div className="text-right hidden md:block">
              <span className="font-bold text-body-sm text-gray-900 block leading-tight">
                {user?.karyawan?.legalName || user?.username}
              </span>
              <span className="text-caption text-gray-500 font-semibold tracking-wide block">
                {roleDisplay}
              </span>
            </div>

            {/* Avatar Circle (Middle) */}
            <div className="h-9 w-9 rounded-full bg-primary-600 text-white font-bold text-caption flex items-center justify-center shadow-xs">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
            </div>

            {/* Chevron Icon (Right) */}
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/60 rounded-lg mb-1">
                <span className="font-semibold text-xs text-gray-900 block leading-tight">
                  {user?.karyawan?.legalName || user?.username}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                    {roleDisplay}
                  </span>
                  {user?.karyawan?.employeeNumber && (
                    <span className="text-[11px] text-gray-500 font-mono">
                      {user.karyawan.employeeNumber}
                    </span>
                  )}
                </div>
                {user?.karyawan?.breadcrumb && (
                  <span className="text-[10px] text-primary-600 block mt-1 leading-snug">
                    {user.karyawan.breadcrumb}
                  </span>
                )}
              </div>

              <div className="py-1 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(routePaths.profile);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                >
                  <UserIcon size={15} className="text-gray-400 group-hover:text-indigo-600" /> Profil Saya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(routePaths.security);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                >
                  <ShieldCheck size={15} className="text-gray-400 group-hover:text-indigo-600" /> Keamanan Akun
                </button>
              </div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-body-sm font-semibold text-error-600 hover:bg-error-50 transition-colors mt-1"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
