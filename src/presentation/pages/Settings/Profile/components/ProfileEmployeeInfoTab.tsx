import React from 'react';
import { findBankByIdOrCode } from '@/core/constants/banks';
import { EmployeeData, UserAccountData } from '../types';
import { 
  Building2, 
  UserCheck, 
  CreditCard, 
  Calendar, 
  GraduationCap, 
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface ProfileEmployeeInfoTabProps {
  user: UserAccountData;
  karyawan: EmployeeData | null;
}

export const ProfileEmployeeInfoTab: React.FC<ProfileEmployeeInfoTabProps> = ({ karyawan }) => {
  if (!karyawan) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Info size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Akun Sistem / Administrator</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Akun ini didaftarkan sebagai pengguna sistem mandiri dan tidak terhubung dengan master profil fisik karyawan perusahaan.
        </p>
      </div>
    );
  }

  // Format tanggal ke Bahasa Indonesia
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Hitung usia
  const calculateAge = (dobStr?: string | null): string => {
    if (!dobStr) return '';
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return '';
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return ` (${age} Tahun)`;
  };

  const getGenderLabel = (sex?: string | null): string => {
    if (sex === 'L') return 'Laki-Laki';
    if (sex === 'P') return 'Perempuan';
    return sex || '-';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Organisasi & Kepegawaian */}
        <div className="space-y-6">
          {/* Organisasi & Penempatan */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Building2 size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Organisasi & Penempatan
              </h3>
            </div>
            <div className="p-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Unit Kerja</span>
                <span className="text-slate-900 font-semibold text-right">
                  {karyawan.operationUnit?.name || '-'} ({karyawan.operationUnit?.code || '-'})
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Tipe Unit</span>
                <span className="text-slate-900 font-medium text-right capitalize">
                  {karyawan.operationUnit?.type?.replace('_', ' ') || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4 items-start">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                  <Layers size={14} className="text-indigo-500" />
                  Hirarki
                </span>
                <span className="text-slate-900 font-medium text-right font-mono text-xs max-w-xs">
                  {karyawan.operationUnit?.breadcrumb || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <UserCheck size={14} className="text-emerald-500" />
                  Atasan Langsung
                </span>
                <span className="text-slate-900 font-semibold text-right">
                  {karyawan.supervisor
                    ? `${karyawan.supervisor.legalName} (${karyawan.supervisor.employeeNumber})`
                    : 'Tidak ada (Top Level)'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Kepegawaian */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Status Kepegawaian
              </h3>
            </div>
            <div className="p-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Tanggal Masuk (Hire)</span>
                <span className="text-slate-900 font-medium text-right">
                  {formatDate(karyawan.originalDateOfHire)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Tanggal Karyawan Tetap</span>
                <span className="text-slate-900 font-medium text-right">
                  {formatDate(karyawan.permanentDate)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Status Pekerja</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {karyawan.status ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2: Identitas Resmi & Payroll */}
        <div className="space-y-6">
          {/* Identitas Resmi Pegawai */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Data Identitas Pegawai
              </h3>
            </div>
            <div className="p-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">NIK (KTP)</span>
                <span className="text-slate-900 font-mono font-semibold text-right">
                  {karyawan.nik || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Tempat, Tanggal Lahir</span>
                <span className="text-slate-900 font-medium text-right">
                  {karyawan.placeOfBirth || '-'}, {formatDate(karyawan.dateOfBirth)}
                  {calculateAge(karyawan.dateOfBirth)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                <span className="text-slate-900 font-medium text-right">
                  {getGenderLabel(karyawan.sex)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Agama</span>
                <span className="text-slate-900 font-medium text-right">
                  {karyawan.religion || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <HeartHandshake size={14} className="text-rose-500" />
                  Status Pernikahan
                </span>
                <span className="text-slate-900 font-medium text-right">
                  {karyawan.maritalStatus || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-blue-500" />
                  Pendidikan Terakhir
                </span>
                <span className="text-slate-900 font-medium text-right">
                  {karyawan.lastEducation || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Rekening Payroll */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Informasi Payroll Rekening
              </h3>
            </div>
            <div className="p-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between gap-4 items-baseline">
                <span className="text-slate-500 font-medium">Nama Bank</span>
                <span className="text-slate-900 font-semibold text-right">
                  {(() => {
                    const bankInfo = findBankByIdOrCode(karyawan.bankId);
                    if (bankInfo) {
                      return (
                        <span className="inline-flex items-center gap-1.5 justify-end">
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                            {bankInfo.code}
                          </span>
                          <span>{bankInfo.name}</span>
                          {bankInfo.alias && (
                            <span className="text-xs text-indigo-600 font-semibold">
                              ({bankInfo.alias})
                            </span>
                          )}
                        </span>
                      );
                    }
                    return karyawan.bankId || '-';
                  })()}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Nomor Rekening</span>
                <span className="text-slate-900 font-mono font-bold text-right tracking-wider">
                  {karyawan.accountNumber || '-'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Atas Nama Rekening</span>
                <span className="text-slate-900 font-medium text-right">
                  {karyawan.accountName || karyawan.legalName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner Catatan HRD */}
      <div className="rounded-xl bg-blue-50/80 border border-blue-200/80 p-4 flex items-start gap-3 text-blue-900 text-xs sm:text-sm">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Keterangan Resmi Tata Kelola Data:</strong> Seluruh data kepegawaian resmi, penempatan cabang, dan nomor rekening payroll dikelola secara terpusat oleh Divisi HRD. Jika terdapat ketidaksesuaian atau perubahan data resmi, silakan mengajukan permohonan melalui Human Resources.
        </div>
      </div>
    </div>
  );
};
