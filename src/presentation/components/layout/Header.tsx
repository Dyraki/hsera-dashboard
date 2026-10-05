import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Menu as MenuIcon,
  ChevronDown,
  LogOut,
  Building2
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-45 flex items-center justify-between px-6 lg:px-8 shadow-xs">
      
      {/* Header Left (Sidebar Toggle) */}
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Button for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 lg:hidden"
        >
          <MenuIcon size={18} />
        </button>

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
              <span className="text-caption text-gray-400 font-semibold uppercase tracking-wider block">
                {user?.jenis === 'pegawai' ? 'Admin' : user?.jenis}
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
              {user?.karyawan && (
                <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/60 rounded-lg mb-1">
                  <span className="font-semibold text-xs text-gray-900 block leading-tight">{user.karyawan.legalName}</span>
                  <span className="text-[11px] text-gray-500 font-mono block mt-0.5">{user.karyawan.employeeNumber}</span>
                  {user.karyawan.breadcrumb && (
                    <span className="text-[10px] text-primary-600 block mt-1 leading-snug">{user.karyawan.breadcrumb}</span>
                  )}
                </div>
              )}
              <button
                onClick={logout}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-body-sm font-semibold text-error-600 hover:bg-error-50 transition-colors"
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
