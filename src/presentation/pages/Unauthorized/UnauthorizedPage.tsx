import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F1F5F9] text-slate-700 p-6 text-center font-sans">
      <div className="rounded-full bg-rose-100 border border-rose-200 p-4 text-rose-500 mb-6">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-2xl font-bold mb-2 tracking-tight text-slate-800">Akses Ditolak</h1>
      <p className="text-slate-500 max-w-md mb-8 text-sm">
        Anda tidak memiliki izin (ACL) yang cukup untuk mengakses halaman ini. Hubungi administrator sistem jika Anda merasa ini adalah kesalahan.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 rounded-md text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150"
      >
        KEMBALI KE BERANDA
      </Link>
    </div>
  );
};
