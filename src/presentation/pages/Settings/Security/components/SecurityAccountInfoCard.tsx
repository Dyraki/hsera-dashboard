import React from 'react';
import { ShieldCheck, UserCheck, KeyRound, Calendar } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';

export const SecurityAccountInfoCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl p-6 sm:p-7 text-white">
      {/* Decorative Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Pusat Keamanan & Kredensial Akun
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                NIST & OWASP Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Kelola kata sandi mandiri, standarisasi enkripsi, serta pantau sesi login perangkat aktif Anda.
            </p>
          </div>
        </div>

        {/* Quick Account Info Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200">
            <UserCheck size={14} className="text-indigo-400" />
            <span>Akun: <strong className="text-white font-mono">{user?.username || '-'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200">
            <KeyRound size={14} className="text-amber-400" />
            <span>Role: <strong className="text-white">{user?.roleName || user?.jenis || 'USER'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200">
            <Calendar size={14} className="text-emerald-400" />
            <span>Proteksi: <strong className="text-white">Bcrypt 12 Rounds</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
