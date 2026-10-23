import React from 'react';
import type { WeeklyDistrictNotationAnalysis } from '@/core/domain/models/ReportWeeklyDistrict';

interface WeeklyNotationAnalysisProps {
  notationAnalysis?: WeeklyDistrictNotationAnalysis;
  totalKunjungan?: number;
}

export const WeeklyNotationAnalysis: React.FC<WeeklyNotationAnalysisProps> = ({
  notationAnalysis,
  totalKunjungan = 0,
}) => {
  if (!notationAnalysis) {
    return null;
  }

  const { stockLevel, tradeProgram, penetration } = notationAnalysis;
  const visitCount = notationAnalysis.totalKunjungan || totalKunjungan;

  // 1. Level Stok Widths
  const stockSum = stockLevel.sl + stockLevel.sk + stockLevel.oos;
  const slWidth = stockSum > 0 ? (stockLevel.sl / stockSum) * 100 : 0;
  const skWidth = stockSum > 0 ? (stockLevel.sk / stockSum) * 100 : 0;
  const oosWidth = stockSum > 0 ? (stockLevel.oos / stockSum) * 100 : 0;

  // 2. Trade Program Widths (Proporsi perbandingan SD vs TL)
  const tradeSum = tradeProgram.sd + tradeProgram.tl;
  const sdWidth = tradeSum > 0 ? (tradeProgram.sd / tradeSum) * 100 : 0;
  const tlWidth = tradeSum > 0 ? (tradeProgram.tl / tradeSum) * 100 : 0;

  // 3. Penetrasi & Perilaku Toko Widths
  // BD takes its proportion, remaining is distributed between BPJ and SB
  const bdWidth = Math.min(100, Math.max(0, penetration.bdPercent));
  const remainingWidth = Math.max(0, 100 - bdWidth);
  const nonBdTotal = (penetration.bpj > 0 ? penetration.bpj : 1) + (penetration.sb > 0 ? penetration.sb : 0);
  const bpjWidth = remainingWidth > 0 ? (penetration.bpj / nonBdTotal) * remainingWidth : 0;
  const sbWidth = remainingWidth - bpjWidth;

  const formatSbPercent = (count: number, percent: number) => {
    if (count === 0) return '0%';
    if (percent < 2) return '< 2%';
    return `${percent}%`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">Analisis notasi</h3>
        <span className="text-xs sm:text-sm font-medium text-gray-500">
          Total {visitCount} kunjungan efektif tervalidasi
        </span>
      </div>

      {/* 3 Horizontal Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Level Stok (outlet) */}
        <div className="border border-gray-200/80 rounded-xl p-3.5 bg-white flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs sm:text-sm font-bold text-gray-800">Level stok (outlet)</span>
              <span className="text-xs font-semibold text-gray-500">
                {stockLevel.totalOutlet} outlet
              </span>
            </div>

            {/* Multi-segment Bar */}
            <div className="h-3 sm:h-3.5 w-full bg-gray-100 rounded-full flex overflow-hidden">
              {stockSum > 0 ? (
                <>
                  <div
                    className="bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${slWidth}%` }}
                    title={`SL: ${stockLevel.sl} (${stockLevel.slPercent}%)`}
                  />
                  <div
                    className="bg-amber-500 transition-all duration-500 ease-out"
                    style={{ width: `${skWidth}%` }}
                    title={`SK: ${stockLevel.sk} (${stockLevel.skPercent}%)`}
                  />
                  <div
                    className="bg-red-500 transition-all duration-500 ease-out"
                    style={{ width: `${oosWidth}%` }}
                    title={`OOS: ${stockLevel.oos} (${stockLevel.oosPercent}%)`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-200" />
              )}
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between text-xs mt-3 text-gray-500 font-medium pt-1">
            <span>
              SL <strong className="text-blue-600 font-bold">{stockLevel.sl}</strong>{' '}
              <span className="text-gray-400">({stockLevel.slPercent}%)</span>
            </span>
            <span>
              SK <strong className="text-amber-500 font-bold">{stockLevel.sk}</strong>{' '}
              <span className="text-gray-400">({stockLevel.skPercent}%)</span>
            </span>
            <span>
              OOS <strong className="text-red-500 font-bold">{stockLevel.oos}</strong>{' '}
              <span className="text-gray-400">({stockLevel.oosPercent}%)</span>
            </span>
          </div>
        </div>

        {/* Card 2: Trade Program & Display Ambalan */}
        <div className="border border-gray-200/80 rounded-xl p-3.5 bg-white flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                Trade program & display ambalan
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {tradeProgram.sd} SD OK
              </span>
            </div>

            {/* Multi-segment Bar (Proporsi perbandingan SD vs TL - 100% Penuh) */}
            <div className="h-3 sm:h-3.5 w-full bg-gray-100 rounded-full flex overflow-hidden">
              {tradeSum > 0 ? (
                <>
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${sdWidth}%` }}
                    title={`SD: ${tradeProgram.sd} (${tradeProgram.sdPercent}%) - ${Math.round(sdWidth)}% dari total SD+TL`}
                  />
                  <div
                    className="bg-red-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${tlWidth}%` }}
                    title={`TL: ${tradeProgram.tl} (${tradeProgram.tlPercent}%) - ${Math.round(tlWidth)}% dari total SD+TL`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-200" title="Belum ada data SD & TL" />
              )}
            </div>
          </div>

          {/* Footer Legend: Notasi SD & TL */}
          <div className="flex items-center justify-between text-xs mt-3 text-gray-500 font-medium pt-1">
            <span>
              SD <strong className="text-emerald-600 font-bold">{tradeProgram.sd}</strong>{' '}
              <span className="text-gray-400">({tradeProgram.sdPercent}%)</span>
            </span>
            <span>
              TL <strong className="text-red-500 font-bold">{tradeProgram.tl}</strong>{' '}
              <span className="text-gray-400">({tradeProgram.tlPercent}%)</span>
            </span>
          </div>
        </div>

        {/* Card 3: Penetrasi & Perilaku Toko */}
        <div className="border border-gray-200/80 rounded-xl p-3.5 bg-white flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                Penetrasi & perilaku toko
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                BD {penetration.bdPercent}%
              </span>
            </div>

            {/* Multi-segment Bar */}
            <div className="h-3 sm:h-3.5 w-full bg-gray-100 rounded-full flex overflow-hidden">
              {visitCount > 0 ? (
                <>
                  <div
                    className="bg-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${bdWidth}%` }}
                    title={`BD: ${penetration.bd} (${penetration.bdPercent}%)`}
                  />
                  <div
                    className="bg-amber-800 transition-all duration-500 ease-out"
                    style={{ width: `${bpjWidth}%` }}
                    title={`BPJ: ${penetration.bpj} (${penetration.bpjPercent}%)`}
                  />
                  <div
                    className="bg-rose-600 transition-all duration-500 ease-out"
                    style={{ width: `${sbWidth}%` }}
                    title={`SB: ${penetration.sb} (${penetration.sbPercent}%)`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-200" />
              )}
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between text-xs mt-3 text-gray-500 font-medium pt-1">
            <span>
              BD <strong className="text-indigo-600 font-bold">{penetration.bd}</strong>{' '}
              <span className="text-gray-400">({penetration.bdPercent}%)</span>
            </span>
            <span>
              BPJ <strong className="text-amber-800 font-bold">{penetration.bpj}</strong>
            </span>
            <span>
              SB <strong className="text-rose-600 font-bold">{penetration.sb}</strong>{' '}
              <span className="text-gray-400">
                ({formatSbPercent(penetration.sb, penetration.sbPercent)})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
