import React, { useState } from 'react';
import { useUserProfile } from './hooks/useUserProfile';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { ProfileEmployeeInfoTab } from './components/ProfileEmployeeInfoTab';
import { ProfileContactEditTab } from './components/ProfileContactEditTab';
import { 
  Building2, 
  Mail, 
  Loader2, 
  AlertCircle, 
  RotateCw,
  Home,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';

export const ProfilePage: React.FC = () => {
  const { profile, loading, saving, error, refreshProfile, updateContact } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'employee' | 'contact'>('employee');

  if (loading && !profile) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
          <Loader2 size={36} className="text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600">Memuat profil pengguna & data kepegawaian...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !profile) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Gagal Memuat Profil</h2>
          <p className="text-sm text-slate-500 mb-5 text-center max-w-md">{error}</p>
          <button
            onClick={refreshProfile}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            <RotateCw size={15} />
            <span>Coba Muat Ulang</span>
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) return null;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to={routePaths.dashboard} className="hover:text-indigo-600 flex items-center gap-1 transition">
          <Home size={13} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-400">Pengaturan</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-800 font-semibold">Profil Pengguna</span>
      </div>

      {/* Hero Header Card */}
      <ProfileHeaderCard user={profile.user} karyawan={profile.karyawan} />

      {/* Navigasi Tab */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-3 -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab('employee')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition ${
              activeTab === 'employee'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Building2 size={16} />
            <span>Informasi Kepegawaian & HR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition ${
              activeTab === 'contact'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Mail size={16} />
            <span>Kontak & Alamat Domisili</span>
          </button>
        </nav>
      </div>

      {/* Tab Konten */}
      <div className="pt-2">
        {activeTab === 'employee' ? (
          <ProfileEmployeeInfoTab user={profile.user} karyawan={profile.karyawan} />
        ) : (
          <ProfileContactEditTab
            karyawan={profile.karyawan}
            saving={saving}
            onSave={updateContact}
          />
        )}
      </div>
    </div>
  </AdminLayout>
);
};

export default ProfilePage;
