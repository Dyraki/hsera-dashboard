import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeData, UpdateContactPayload } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Save, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { routePaths } from '@/routes/routePaths';

interface ProfileContactEditTabProps {
  karyawan: EmployeeData | null;
  saving: boolean;
  onSave: (payload: UpdateContactPayload) => Promise<boolean>;
}

export const ProfileContactEditTab: React.FC<ProfileContactEditTabProps> = ({
  karyawan,
  saving,
  onSave,
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Sinkronisasi data saat data karyawan termuat/berubah
  useEffect(() => {
    if (karyawan) {
      setEmail(karyawan.email || '');
      setPhone(karyawan.phone || '');
      setAddress(karyawan.address || '');
      setPostalCode(karyawan.postalCode || '');
    }
  }, [karyawan]);

  if (!karyawan) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Info size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Tidak Ada Data Kontak Pegawai</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Akun ini tidak terhubung dengan profil data karyawan, sehingga pembaruan data kontak tidak tersedia.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      email: email.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
      postalCode: postalCode.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Kontak Mandiri */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Perbarui Kontak & Domisili Mandiri
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Dapat diperbarui secara mandiri oleh pengguna
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email Pribadi / Kerja
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: nama@perusahaan.co.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Digunakan untuk notifikasi sistem dan korespondensi resmi.
              </p>
            </div>

            {/* Nomor Telepon / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Handphone / WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="contoh: 081234567890"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Pastikan nomor aktif untuk keperluan kontak darurat dan operasional.
              </p>
            </div>
          </div>

          {/* Alamat Domisili */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Alamat Lengkap Domisili Saat Ini
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <MapPin size={16} />
              </div>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tuliskan nama jalan, RT/RW, nomor rumah, kelurahan, dan kecamatan tempat tinggal..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          {/* Kode Pos */}
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kode Pos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText size={16} />
              </div>
              <input
                type="text"
                maxLength={6}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="contoh: 40162"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              disabled={saving}
              leftIcon={<Save size={16} />}
              className="shadow-xs hover:shadow"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan Kontak'}
            </Button>
          </div>
        </form>
      </div>

      {/* Shortcut Card Menuju Fitur Keamanan */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ingin Mengganti Kata Sandi Akun?</h4>
            <p className="text-xs text-slate-300">
              Pengelolaan sandi mandiri dan kontrol sesi login perangkat dipusatkan pada menu Keamanan Akun.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(routePaths.security)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition whitespace-nowrap self-start sm:self-auto"
        >
          <span>Buka Keamanan Akun</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
