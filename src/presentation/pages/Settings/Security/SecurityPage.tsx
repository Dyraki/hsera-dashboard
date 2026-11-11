import React from 'react';
import { useAccountSecurity } from './hooks/useAccountSecurity';
import { SecurityAccountInfoCard } from './components/SecurityAccountInfoCard';
import { ChangePasswordCard } from './components/ChangePasswordCard';
import { ActiveSessionsCard } from './components/ActiveSessionsCard';
import { 
  Home, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';

export const SecurityPage: React.FC = () => {
  const {
    sessions,
    loadingSessions,
    changingPassword,
    revokingSessionId,
    revokingAll,
    fetchSessions,
    changePassword,
    revokeSession,
    revokeAllSessions,
  } = useAccountSecurity();

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to={routePaths.dashboard} className="hover:text-primary-600 flex items-center gap-1 transition">
          <Home size={13} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-400">Pengaturan</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-800 font-semibold">Keamanan Akun</span>
      </div>

      {/* Hero Banner Header */}
      <SecurityAccountInfoCard />

      {/* Main Grid: Form Ganti Sandi & Sesi Aktif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Form Ganti Sandi (Lebar 7 dari 12) */}
        <div className="lg:col-span-7 space-y-6">
          <ChangePasswordCard
            changing={changingPassword}
            onChangePassword={changePassword}
          />
        </div>

        {/* Kolom Kanan: Sesi Aktif & Panduan Keamanan (Lebar 5 dari 12) */}
        <div className="lg:col-span-5 space-y-6">
          <ActiveSessionsCard
            sessions={sessions}
            loading={loadingSessions}
            revokingSessionId={revokingSessionId}
            revokingAll={revokingAll}
            onRefresh={fetchSessions}
            onRevokeSession={revokeSession}
            onRevokeAllSessions={revokeAllSessions}
          />

          {/* Panduan Keamanan NIST SP 800-63B */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-primary-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Panduan Keamanan Kata Sandi
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Gunakan minimal 8-14 karakter acak untuk mempersulit serangan brute-force.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Hindari menggunakan nama lengkap, tanggal lahir, atau pola berurutan (misal: 1234, abcd).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Segera cabut sesi perangkat yang tidak Anda kenali atau perangkat umum setelah selesai bekerja.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);
};

export default SecurityPage;
