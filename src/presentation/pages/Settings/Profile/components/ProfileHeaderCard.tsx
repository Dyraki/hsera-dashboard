import React from 'react';
import { UserAccountData, EmployeeData } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface ProfileHeaderCardProps {
  user: UserAccountData;
  karyawan: EmployeeData | null;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user, karyawan }) => {
  // Hitung inisial nama
  const displayName = karyawan?.legalName || user.username;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  // Hitung masa kerja dari originalDateOfHire
  const calculateTenure = (hireDateStr?: string | null): string => {
    if (!hireDateStr) return '-';
    const hire = new Date(hireDateStr);
    if (isNaN(hire.getTime())) return '-';

    const now = new Date();
    let years = now.getFullYear() - hire.getFullYear();
    let months = now.getMonth() - hire.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0 && months > 0) return `${years} Tahun ${months} Bulan`;
    if (years > 0) return `${years} Tahun`;
    if (months > 0) return `${months} Bulan`;
    return 'Kurang dari 1 bulan';
  };

  const isUserActive = user.aktif === 1;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl p-6 sm:p-8 text-white">
      {/* Background Decorative Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar Inisial */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10 tracking-wider">
            {initials || 'U'}
          </div>
          <span 
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
              isUserActive ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            title={isUserActive ? 'Akun Aktif' : 'Akun Non-Aktif'}
          />
        </div>

        {/* Informasi Utama */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
              {displayName}
            </h1>

            {/* Badges */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isUserActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isUserActive ? (
                <CheckCircle2 size={12} className="text-emerald-400" />
              ) : (
                <AlertCircle size={12} className="text-rose-400" />
              )}
              {isUserActive ? 'AKTIF' : 'NON-AKTIF'}
            </span>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user.jenis.toUpperCase()}
            </span>

            {user.roleName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck size={12} className="text-amber-400" />
                {user.roleName}
              </span>
            )}

            {karyawan?.operationUnit?.code && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Building2 size={12} className="text-sky-400" />
                {karyawan.operationUnit.code}
              </span>
            )}
          </div>

          {/* Sub Informasi NIP, NIK, Username */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
            {karyawan ? (
              <>
                <span className="font-mono">
                  <strong className="text-slate-400 font-normal">NIP:</strong> {karyawan.employeeNumber}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="font-mono">
                  <strong className="text-slate-400 font-normal">NIK:</strong> {karyawan.nik}
                </span>
              </>
            ) : (
              <span>
                <strong className="text-slate-400 font-normal">Username:</strong> @{user.username}
              </span>
            )}
          </div>

          {/* Lokasi Unit & Masa Kerja */}
          <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300/90 pt-3 border-t border-slate-800/80">
            {karyawan?.operationUnit ? (
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-indigo-400 shrink-0" />
                <span className="truncate max-w-xs sm:max-w-md">
                  {karyawan.operationUnit.breadcrumb || karyawan.operationUnit.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 size={15} className="text-slate-500" />
                <span>Akun Sistem Kantor Pusat (HO)</span>
              </div>
            )}

            {karyawan?.originalDateOfHire && (
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <span>Masa Kerja: {calculateTenure(karyawan.originalDateOfHire)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
