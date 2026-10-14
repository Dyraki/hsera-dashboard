import React from "react";
import { District } from "@/core/domain/models/District";
import { CallsheetFormResponse, JenisRekap, StatusRekap } from "@/core/domain/models/Callsheet";
import {
  Calendar,
  MapPin,
  User,
  Building2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock
} from "lucide-react";

interface CallsheetHeaderFilterProps {
  districts: District[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  formSkeleton: CallsheetFormResponse | null;
  jenisRekap: JenisRekap;
  onChangeJenisRekap: (mode: JenisRekap) => void;
  alasan: string;
  onChangeAlasan: (alasan: string) => void;
  statusRekap: StatusRekap;
  rekapId?: string;
  disabled?: boolean;
}

export const CallsheetHeaderFilter: React.FC<CallsheetHeaderFilterProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  selectedDate,
  onSelectDate,
  formSkeleton,
  jenisRekap,
  onChangeJenisRekap,
  alasan,
  onChangeAlasan,
  statusRekap,
  rekapId,
  disabled = false,
}) => {
  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);

  return (
    <div className="space-y-4">
      {/* 1. Mode Edit Banner (Jika ada existing rekap di sistem) */}
      {rekapId && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-sm shadow-xs">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white rounded">
              MODE EDIT AKTIF
            </span>
            <span>
              Rekap tanggal ini untuk <strong>{selectedDistrict?.kode || "District"}</strong> sudah ada dalam sistem (ID: <code className="text-indigo-700 font-mono font-bold">{rekapId.substring(0, 8)}</code>)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Status: <strong className="uppercase">{statusRekap}</strong></span>
          </div>
        </div>
      )}

      {/* 2. Audit Lock Warning Banner (Jika Minggu Terkunci) */}
      {formSkeleton?.isLocked && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-sm shadow-xs">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="font-semibold text-amber-950">Minggu W-{formSkeleton.kodeMingguDisplay} Terkunci untuk Audit.</strong>
            <p className="text-xs text-amber-800 mt-0.5">
              Seluruh data Callsheet pada minggu ini bersifat Read-Only dan tidak dapat diubah.
            </p>
          </div>
        </div>
      )}

      {/* 3. Non-Workday (Hari Minggu) Warning */}
      {formSkeleton && !formSkeleton.isWorkday && (
        <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-sm shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="font-semibold text-rose-950">Hari Minggu Tidak Beroperasi.</strong>
            <p className="text-xs text-rose-800 mt-0.5">
              Sistem salesmanship hanya mencatat kunjungan operasional Senin sampai Sabtu.
            </p>
          </div>
        </div>
      )}

      {/* 4. Filter Panel Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Kolom 1: District / Rute Distribusi */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              District / Rute Distribusi
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedDistrictId}
                onChange={(e) => onSelectDistrict(e.target.value)}
                disabled={disabled}
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm transition-colors shadow-xs"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    District {d.kode} ({d.ouKode})
                  </option>
                ))}
              </select>
            </div>
            {/* Salesman & OU Meta Info */}
            {selectedDistrict && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-900 font-medium">{selectedDistrict.karyawanName || selectedDistrict.karyawanId}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                  <Building2 className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-700">OU: {selectedDistrict.ouKode}</span>
                </span>
              </div>
            )}
          </div>

          {/* Kolom 2: Tanggal Rekap (Senin-Sabtu) */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-600" />
              Tanggal Rekap (Senin - Sabtu)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                disabled={disabled}
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm transition-colors font-mono shadow-xs"
              />
              {/* Badge Hari & Kode Minggu ISO */}
              {formSkeleton && (
                <div className="shrink-0 bg-primary-50 border border-primary-200 text-primary-700 px-3 py-2.5 rounded-lg text-xs font-semibold text-center whitespace-nowrap">
                  <span>{formSkeleton.namaHari} · W-{formSkeleton.kodeMingguDisplay}</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Hari Minggu tidak beroperasi / terkunci sistem otomatis.
            </p>
          </div>

          {/* Kolom 3: Mode Pelaporan & Status Rekap */}
          <div className="lg:col-span-3 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mode Pelaporan
                </label>
                {/* Status Rekap Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${
                    statusRekap === "FINAL"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {statusRekap === "FINAL" ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <FileText className="w-3 h-3 text-amber-600" />
                  )}
                  {statusRekap}
                </span>
              </div>

              {/* Toggle Buttons: Normal vs Tidak Ada Kunjungan */}
              <div className="grid grid-cols-2 gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChangeJenisRekap("NORMAL")}
                  className={`py-2 text-xs font-semibold rounded-md transition-all ${
                    jenisRekap === "NORMAL"
                      ? "bg-primary-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Normal Berjalan
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChangeJenisRekap("TIDAK_ADA_KUNJUNGAN")}
                  className={`py-2 text-xs font-semibold rounded-md transition-all ${
                    jenisRekap === "TIDAK_ADA_KUNJUNGAN"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Tidak Ada Kunjungan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Alasan jika Tidak Ada Kunjungan */}
        {jenisRekap === "TIDAK_ADA_KUNJUNGAN" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
              Alasan Tidak Ada Kunjungan <span className="text-rose-600">* (Wajib Diisi)</span>
            </label>
            <textarea
              rows={2}
              value={alasan}
              onChange={(e) => onChangeAlasan(e.target.value)}
              disabled={disabled}
              placeholder="Contoh: Libur nasional, Salesman izin sakit dengan surat dokter, Cuaca banjir ekstrem..."
              className="w-full bg-white border border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg p-3 text-gray-900 text-sm placeholder-gray-400 transition-colors shadow-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
