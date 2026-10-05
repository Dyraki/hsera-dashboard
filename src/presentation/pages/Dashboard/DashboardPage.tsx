import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../../core/di/container';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import {
  Shield,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, permissions } = useAuth();
  
  // Data State dari API
  const [aclMessage, setAclMessage] = useState('Memverifikasi...');
  const [isAclOk, setIsAclOk] = useState<boolean | null>(null);

  useEffect(() => {
    useCases.getDashboardStatus.execute()
      .then((message) => {
        setAclMessage(message);
        setIsAclOk(true);
      })
      .catch((err: unknown) => {
        setAclMessage(err instanceof Error ? err.message : 'Gagal verifikasi API.');
        setIsAclOk(false);
      });
  }, []);

  return (
    <AdminLayout>
      {/* TailAdmin Style Banner Alert */}
      <div className="flex items-center justify-between p-6 bg-indigo-600 rounded-sm text-white shadow-md">
        <div>
          <h2 className="text-xl font-bold mb-1">Selamat Datang Kembali, {user?.username}!</h2>
          <p className="text-xs opacity-90">Sesi otorisasi Anda aktif dan hak akses menu berhasil dimuat secara dinamis.</p>
        </div>
        <ShieldCheckComponent status={isAclOk} />
      </div>

      {/* Quick Metrics Grid (TailAdmin Style: White backgrounds, slate borders, circular icons) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Users */}
        <div className="bg-white border border-slate-200/80 rounded-sm p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pengguna</span>
            <span className="text-2xl font-bold text-slate-800 leading-none">1</span>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1 mt-2">
              <TrendingUp size={14} /> +0% dari bulan lalu
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-slate-100 text-indigo-600 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        {/* Card 2: API Connection */}
        <div className="bg-white border border-slate-200/80 rounded-sm p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status Server API</span>
            <span className="text-lg font-bold text-emerald-500 leading-none block">TERHUBUNG</span>
            <span className="text-xs text-slate-400 font-semibold block mt-2">
              Menerima koneksi lokal
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-slate-100 text-emerald-500 flex items-center justify-center">
            <Activity size={18} />
          </div>
        </div>

        {/* Card 3: Logins */}
        <div className="bg-white border border-slate-200/80 rounded-sm p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tingkat Izin ACL</span>
            <span className="text-2xl font-bold text-slate-800 leading-none">LEVEL 4</span>
            <span className="text-xs text-indigo-600 font-semibold block mt-2">
              Izin Super Admin aktif
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-slate-100 text-indigo-500 flex items-center justify-center">
            <Shield size={18} />
          </div>
        </div>

      </div>

      {/* Detailed Status Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Info API Card */}
        <div className="bg-white border border-slate-200/80 rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Activity size={16} className="text-indigo-600" />
            Respon Otorisasi Rute Backend
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 font-mono text-xs text-slate-600">
            {aclMessage}
          </div>
        </div>

        {/* List ACL Permissions Card */}
        <div className="bg-white border border-slate-200/80 rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield size={16} className="text-indigo-600" />
            Izin Akses Menu Pengguna (Database)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {permissions.map((p) => (
              <div
                key={p.menuId}
                className="border border-slate-200 bg-slate-50 rounded-md p-4 hover:border-indigo-500/30 transition-colors duration-150"
              >
                <span className="font-bold text-xs text-slate-700 block mb-1 uppercase">
                  {p.menuId}
                </span>
                <div className="flex gap-3 text-[10px] text-slate-400 font-bold">
                  <span>Enable: {p.enable ? 'Aktif' : 'Nonaktif'}</span>
                  <span>•</span>
                  <span>Level: {p.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

// Sub-komponen visual verifikasi ACL
const ShieldCheckComponent: React.FC<{ status: boolean | null }> = ({ status }) => {
  if (status === true) {
    return (
      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white" title="API ACL Terverifikasi">
        <Shield size={20} />
      </div>
    );
  }
  if (status === false) {
    return (
      <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-200" title="API ACL Gagal">
        <Shield size={20} />
      </div>
    );
  }
  return (
    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    </div>
  );
};
