import React, { useState } from "react";
import { CallsheetTargets } from "@/core/domain/models/Callsheet";
import { Users, ShoppingCart, Store, Package, CornerDownLeft, Command } from "lucide-react";

interface CallsheetKpiCardsProps {
  targets: CallsheetTargets;
  jumlahKunjungan: number;
  onChangeJumlahKunjungan: (val: number) => void;
  bdOutlet?: number;
  onChangeBdOutlet?: (val: number) => void;
  totalEc: number;
  onChangeTotalEc: (val: number) => void;
  volumeGg: number | string;
  onChangeVolumeGg?: (val: string) => void;
  disabled?: boolean;
}

export const CallsheetKpiCards: React.FC<CallsheetKpiCardsProps> = ({
  targets,
  jumlahKunjungan,
  onChangeJumlahKunjungan,
  bdOutlet: propBdOutlet,
  onChangeBdOutlet,
  totalEc,
  onChangeTotalEc,
  volumeGg,
  disabled = false,
}) => {
  const [localBdOutlet, setLocalBdOutlet] = useState<number>(0);
  const bdOutlet = propBdOutlet !== undefined ? propBdOutlet : localBdOutlet;

  const handleBdOutletChange = (val: number) => {
    if (onChangeBdOutlet) {
      onChangeBdOutlet(val);
    } else {
      setLocalBdOutlet(val);
    }
  };

  const ecRate = jumlahKunjungan > 0 ? ((totalEc / jumlahKunjungan) * 100).toFixed(1) : "0.0";
  const bdRate = jumlahKunjungan > 0 ? ((bdOutlet / jumlahKunjungan) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Jumlah Kunjungan */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs relative overflow-hidden group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 min-h-[26px]">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary-600 shrink-0" />
              Jumlah Kunjungan
            </span>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200 shrink-0">
              Target: {targets.kunjungan || 40}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-3">
            <div className="w-28 sm:w-32 shrink-0">
              <input
                type="number"
                min={0}
                value={jumlahKunjungan === 0 ? "" : jumlahKunjungan}
                onChange={(e) => onChangeJumlahKunjungan(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={disabled}
                placeholder="0"
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg px-3 py-2 text-2xl font-bold text-gray-950 text-center font-mono transition-colors shadow-xs disabled:opacity-50"
              />
            </div>
            <span className="text-sm font-medium text-gray-600 truncate">
              Outlet Terkunjungi
            </span>
          </div>
        </div>

        {/* Card 2: Total Effective Calls (EC) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs relative overflow-hidden group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 min-h-[26px]">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-emerald-600 shrink-0" />
              Total EC
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                Target: {targets.ec || 30}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {ecRate}%
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-3 mt-3">
            <div className="w-28 sm:w-32 shrink-0">
              <input
                type="number"
                min={0}
                value={totalEc === 0 ? "" : totalEc}
                onChange={(e) => onChangeTotalEc(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={disabled}
                placeholder="0"
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-2xl font-bold text-gray-950 text-center font-mono transition-colors shadow-xs disabled:opacity-50"
              />
            </div>
            <span className="text-sm font-medium text-gray-600 truncate">
              Transaksi Beli
            </span>
          </div>
        </div>

        {/* Card 3: BD Outlet (Brand Distribution Outlet) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs relative overflow-hidden group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 min-h-[26px]">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-purple-600 shrink-0" />
              BD Outlet
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                Target: {targets.bd || 35}
              </span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {bdRate}%
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-3 mt-3">
            <div className="w-28 sm:w-32 shrink-0">
              <input
                type="number"
                min={0}
                value={bdOutlet === 0 ? "" : bdOutlet}
                onChange={(e) => handleBdOutletChange(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={disabled}
                placeholder="0"
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-2 text-2xl font-bold text-gray-950 text-center font-mono transition-colors shadow-xs disabled:opacity-50"
              />
            </div>
            <span
              className="text-sm font-medium text-gray-600 truncate cursor-help"
              title="Jika ada salah satu dari 15 brand ada di toko, maka dihitung 1 BD Outlet"
            >
              BD Outlet
            </span>
          </div>
        </div>

        {/* Card 4: Volume Total GG (Auto-sum dari Total BUY) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs relative overflow-hidden group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 min-h-[26px]">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-sky-600 shrink-0" />
              Volume Total (Pack)
            </span>
            <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
              Auto
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-3">
            <div className="w-28 sm:w-32 shrink-0">
              <input
                type="text"
                value={volumeGg}
                readOnly
                disabled={disabled}
                placeholder="0"
                className="w-full bg-sky-50/50 border border-sky-200 rounded-lg px-3 py-2 text-2xl font-bold text-sky-950 text-center font-mono shadow-xs cursor-default disabled:opacity-50"
              />
            </div>
            <span className="text-sm font-medium text-gray-600 truncate">
              Pack
            </span>
          </div>
        </div>
      </div>

      {/* Helper Bar: Shortcut navigasi */}
      <div className="flex items-center justify-end gap-3 text-xs text-gray-500 py-0.5">
        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
          <CornerDownLeft className="w-3 h-3 text-gray-400" />
          <strong className="text-gray-700">Tab / Enter</strong> Pindah Sel
        </span>
        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
          <Command className="w-3 h-3 text-gray-400" />
          <strong className="text-gray-700">Ctrl+S</strong> Draft
        </span>
        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
          <strong className="text-primary-600 font-bold">F8</strong> Finalkan Rekap
        </span>
      </div>
    </div>
  );
};
