import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Package, Minus } from 'lucide-react';
import { SkuSalesRow, SkuSalesWeekColumn, SkuSalesReportResponse } from '@/core/domain/models/ReportSkuSales';

interface SkuSalesMatrixTableProps {
  skuRows: SkuSalesRow[];
  weeks: SkuSalesWeekColumn[];
  summaryRow: SkuSalesReportResponse['summaryRow'];
  prevCycleWeekNumber: number;
  currentWeekNumber: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const SkuSalesMatrixTable: React.FC<SkuSalesMatrixTableProps> = ({
  skuRows,
  weeks,
  summaryRow,
  prevCycleWeekNumber,
  currentWeekNumber,
  sortField,
  sortDirection,
  onSort,
}) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600 shrink-0" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-primary-600 shrink-0" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary-600 shrink-0" />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Title Bar */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-gradient-to-r from-gray-50/80 to-white">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Matriks Penjualan Produk SKU per Minggu
          </h3>
          <span className="text-xs text-gray-500 font-mono">({skuRows.length} SKU)</span>
        </div>
        <p className="text-[11px] text-gray-500">
          *Growth membandingkan realisasi penjualan W{currentWeekNumber} vs W{prevCycleWeekNumber}.
        </p>
      </div>

      {/* Responsive Horizontal Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Header */}
          <thead className="bg-gray-50/90 text-gray-700 font-bold border-b border-gray-200 sticky top-0 z-20">
            <tr>
              <th className="py-3 px-3 w-10 text-center border-r border-gray-200">#</th>

              {/* Kode SKU (Sticky Left) */}
              <th
                onClick={() => onSort('kode')}
                className="py-3 px-3 w-28 border-r border-gray-200 cursor-pointer select-none group hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>Kode SKU</span>
                  {renderSortIcon('kode')}
                </div>
              </th>

              {/* Nama SKU (Sticky Left) */}
              <th
                onClick={() => onSort('nama')}
                className="py-3 px-4 min-w-[180px] border-r border-gray-200 cursor-pointer select-none group hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>Nama Brand / SKU</span>
                  {renderSortIcon('nama')}
                </div>
              </th>

              {/* Dynamic Week Columns */}
              {weeks.map((w) => {
                const isCurrent = w.isCurrent;
                const fieldKey = `week_${w.kodeMinggu}`;
                return (
                  <th
                    key={w.kodeMinggu}
                    onClick={() => onSort(fieldKey)}
                    className={`py-3 px-3 w-24 text-right border-r border-gray-200 cursor-pointer select-none group transition-colors ${isCurrent
                      ? 'bg-indigo-50/90 text-indigo-900 hover:bg-indigo-100/80'
                      : 'hover:bg-gray-100/80'
                      }`}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{w.weekLabel}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-white bg-indigo-600 px-1 py-0.2 rounded ml-1">
                          Aktif
                        </span>
                      )}
                      {renderSortIcon(fieldKey)}
                    </div>
                  </th>
                );
              })}

              {/* Total Kuartal */}
              <th
                onClick={() => onSort('totalQuarter')}
                className="py-3 px-3 w-28 text-right border-r border-gray-200 cursor-pointer select-none group bg-slate-50/80 hover:bg-slate-100 transition-colors text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Q (Pack)</span>
                  {renderSortIcon('totalQuarter')}
                </div>
              </th>

              {/* Rata-rata per Minggu */}
              <th
                onClick={() => onSort('avgWeekly')}
                className="py-3 px-3 w-24 text-right border-r border-gray-200 cursor-pointer select-none group hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Avg/Wk</span>
                  {renderSortIcon('avgWeekly')}
                </div>
              </th>

              {/* Rata-rata per Hari */}
              <th
                onClick={() => onSort('avgDaily')}
                className="py-3 px-3 w-24 text-right border-r border-gray-200 cursor-pointer select-none group hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Avg/Day</span>
                  {renderSortIcon('avgDaily')}
                </div>
              </th>

              {/* Growth WTD */}
              <th
                onClick={() => onSort('growthWtdPercent')}
                className="py-3 px-3 w-32 text-right cursor-pointer select-none group bg-amber-50/50 hover:bg-amber-100/60 transition-colors text-amber-950"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Growth (vs W{prevCycleWeekNumber})</span>
                  {renderSortIcon('growthWtdPercent')}
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {skuRows.length === 0 ? (
              <tr>
                <td colSpan={weeks.length + 7} className="py-12 text-center text-gray-400">
                  Tidak ada produk SKU yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              skuRows.map((row, idx) => {
                const isGrowthPos = row.growthWtdPercent !== null && row.growthWtdPercent > 0;
                const isGrowthNeg = row.growthWtdPercent !== null && row.growthWtdPercent < 0;

                return (
                  <tr
                    key={row.brandId}
                    className="hover:bg-indigo-50/20 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center text-gray-400 border-r border-gray-100 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* Kode SKU */}
                    <td className="py-2.5 px-3 border-r border-gray-100 font-mono font-bold text-gray-900 text-xs">
                      {row.kode}
                    </td>

                    {/* Nama SKU */}
                    <td className="py-2.5 px-4 border-r border-gray-100 font-semibold text-gray-800 text-xs whitespace-nowrap">
                      {row.nama}
                    </td>

                    {/* Week Volume Columns */}
                    {weeks.map((w) => {
                      const vol = row.volumesByWeek[w.kodeMinggu] || 0;
                      return (
                        <td
                          key={w.kodeMinggu}
                          className={`py-2.5 px-3 text-right border-r border-gray-100 font-mono text-xs ${w.isCurrent
                            ? 'bg-indigo-50/30 font-bold text-indigo-950'
                            : vol > 0
                              ? 'text-gray-800'
                              : 'text-gray-300'
                            }`}
                        >
                          {vol > 0 ? formatNumber(vol) : '-'}
                        </td>
                      );
                    })}

                    {/* Total Kuartal */}
                    <td className="py-2.5 px-3 text-right border-r border-gray-100 font-mono font-bold text-gray-900 bg-slate-50/40 text-xs">
                      {formatNumber(row.totalQuarter)}
                    </td>

                    {/* Avg Weekly */}
                    <td className="py-2.5 px-3 text-right border-r border-gray-100 font-mono text-gray-600 text-xs">
                      {row.avgWeekly > 0 ? formatNumber(row.avgWeekly) : '-'}
                    </td>

                    {/* Avg Daily */}
                    <td className="py-2.5 px-3 text-right border-r border-gray-100 font-mono text-gray-600 text-xs">
                      {row.avgDaily > 0 ? formatNumber(row.avgDaily) : '-'}
                    </td>

                    {/* Growth WTD */}
                    <td className="py-2 px-3 text-right font-mono text-xs bg-amber-50/20">
                      {row.growthWtdPercent !== null ? (
                        <div className="flex flex-col items-end leading-tight">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${isGrowthPos
                              ? 'text-emerald-700'
                              : isGrowthNeg
                                ? 'text-rose-700'
                                : 'text-gray-500'
                              }`}
                          >
                            {isGrowthPos ? (
                              <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : isGrowthNeg ? (
                              <TrendingDown className="w-3 h-3 text-rose-600 shrink-0" />
                            ) : (
                              <Minus className="w-3 h-3 text-gray-400 shrink-0" />
                            )}
                            <span>
                              {isGrowthPos ? '+' : ''}
                              {row.growthWtdPercent}%
                            </span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            ({row.deltaPack > 0 ? '+' : ''}{formatNumber(row.deltaPack)} pk)
                          </span>
                        </div>
                      ) : row.wtdCurrentVolume > 0 && row.wtdPrevVolume === 0 ? (
                        <div className="flex flex-col items-end leading-tight">
                          <span className="text-gray-400 font-medium">-</span>
                          <span className="text-[10px] text-gray-500 font-normal font-mono">
                            (+{formatNumber(row.wtdCurrentVolume)} pk)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Summary Total Row */}
          {skuRows.length > 0 && (
            <tfoot className="bg-gray-100/90 font-bold text-gray-900 border-t-2 border-gray-300 sticky bottom-0 z-10">
              <tr>
                <td className="py-3 px-3 text-center border-r border-gray-300 font-mono text-xs">
                  ∑
                </td>
                <td className="py-3 px-3 border-r border-gray-300 font-mono text-xs">
                  TOTAL
                </td>
                <td className="py-3 px-4 border-r border-gray-300 text-xs">
                  SELURUH SKU
                </td>

                {/* Week Totals */}
                {weeks.map((w) => {
                  const tot = summaryRow.totalByWeek[w.kodeMinggu] || 0;
                  return (
                    <td
                      key={w.kodeMinggu}
                      className={`py-3 px-3 text-right border-r border-gray-300 font-mono text-xs ${w.isCurrent ? 'bg-indigo-100/70 text-indigo-950 font-black' : ''
                        }`}
                    >
                      {formatNumber(tot)}
                    </td>
                  );
                })}

                {/* Grand Total Quarter */}
                <td className="py-3 px-3 text-right border-r border-gray-300 font-mono font-black text-indigo-900 bg-slate-200/50 text-xs">
                  {formatNumber(summaryRow.grandTotalQuarter)}
                </td>

                {/* Grand Avg Weekly */}
                <td className="py-3 px-3 text-right border-r border-gray-300 font-mono font-bold text-gray-800 text-xs">
                  {summaryRow.grandAvgWeekly > 0 ? formatNumber(summaryRow.grandAvgWeekly) : '-'}
                </td>

                {/* Grand Avg Daily */}
                <td className="py-3 px-3 text-right border-r border-gray-300 font-mono font-bold text-gray-800 text-xs">
                  {summaryRow.grandAvgDaily > 0 ? formatNumber(summaryRow.grandAvgDaily) : '-'}
                </td>

                {/* Grand Growth WTD */}
                <td className="py-3 px-3 text-right font-mono text-xs bg-amber-100/40">
                  {summaryRow.grandGrowthWtdPercent !== null ? (
                    <div className="flex flex-col items-end leading-tight">
                      <span
                        className={`inline-flex items-center gap-1 font-black ${summaryRow.grandGrowthWtdPercent > 0
                          ? 'text-emerald-800'
                          : summaryRow.grandGrowthWtdPercent < 0
                            ? 'text-rose-800'
                            : 'text-gray-600'
                          }`}
                      >
                        {summaryRow.grandGrowthWtdPercent > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : summaryRow.grandGrowthWtdPercent < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        )}
                        <span>
                          {summaryRow.grandGrowthWtdPercent > 0 ? '+' : ''}
                          {summaryRow.grandGrowthWtdPercent}%
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-600 font-semibold">
                        ({summaryRow.grandDeltaPack > 0 ? '+' : ''}{formatNumber(summaryRow.grandDeltaPack)} pk)
                      </span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
