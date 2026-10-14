import React from "react";
import { CheckCircle2, Clock, AlertCircle, Package } from "lucide-react";
import { MonitoringKpiSummary } from "../types";

interface MonitoringKpiCardsProps {
  kpiSummary: MonitoringKpiSummary;
}

export const MonitoringKpiCards: React.FC<MonitoringKpiCardsProps> = ({ kpiSummary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Rekap Lengkap */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rekap Lengkap
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {kpiSummary.persentaseLengkap}%
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {kpiSummary.totalHariFinal}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              / {kpiSummary.totalSlotHari} hari kerja
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, kpiSummary.persentaseLengkap))}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
          Status FINAL atau Izin tervalidasi
        </p>
      </div>

      {/* Card 2: Menunggu Finalisasi (Draft) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              Menunggu Finalisasi
            </span>
            {kpiSummary.draftDistricts.length > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {kpiSummary.draftDistricts.length} Distrik
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 tracking-tight">
              {kpiSummary.totalHariDraft}
            </span>
            <span className="text-xs text-gray-500 font-medium">hari berstatus DRAFT</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
          Data tersimpan sementara, belum di-submit final
        </p>
      </div>

      {/* Card 3: Belum Direkap (Kosong) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Belum Direkap
            </span>
            {kpiSummary.urgentDistricts.length > 0 && (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {kpiSummary.urgentDistricts.length} Distrik
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 tracking-tight">
              {kpiSummary.totalHariKosong}
            </span>
            <span className="text-xs text-gray-500 font-medium">slot hari kosong</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
          Perlu segera diinput oleh salesman bersangkutan
        </p>
      </div>

      {/* Card 4: Akumulasi Transaksi & Volume */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-600" />
              Akumulasi Minggu Ini
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Total Volume
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {kpiSummary.totalVolume.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-semibold text-gray-500">Pack</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
            <div className="bg-gray-50 rounded p-1 text-center" title="Callmade (Kunjungan)">
              <div className="text-[10px] font-semibold text-gray-500">CM (Kunj)</div>
              <div className="text-xs font-bold text-gray-800">{kpiSummary.totalCm}</div>
            </div>
            <div className="bg-gray-50 rounded p-1 text-center" title="Brand Distribution Outlet">
              <div className="text-[10px] font-semibold text-gray-500">BD Outlet</div>
              <div className="text-xs font-bold text-gray-800">{kpiSummary.totalBd}</div>
            </div>
            <div className="bg-gray-50 rounded p-1 text-center" title="Effective Call">
              <div className="text-[10px] font-semibold text-gray-500">EC Total</div>
              <div className="text-xs font-bold text-gray-800">{kpiSummary.totalEc}</div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-2">
          CM = Callmade (Kunjungan) · BD = BD Outlet · EC = Effective Call
        </p>
      </div>
    </div>
  );
};
