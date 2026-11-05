import React from 'react';
import { Table as TableIcon } from 'lucide-react';
import { KpiWeeklyDataPoint, KpiSummaryMetric } from '@/core/domain/models/ReportKpi';

interface KpiReportWeeklyTableProps {
  weeks: KpiWeeklyDataPoint[];
  summary: {
    kunjungan: KpiSummaryMetric;
    ec: KpiSummaryMetric;
    bd: KpiSummaryMetric;
    volume: KpiSummaryMetric;
  };
  selectedWeek: number | 'all';
  onSelectWeek: (w: number) => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

export const KpiReportWeeklyTable: React.FC<KpiReportWeeklyTableProps> = ({
  weeks,
  summary,
  selectedWeek,
  onSelectWeek,
}) => {
  const getBadge = (percent: number) => {
    if (percent >= 100) {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          {percent}%
        </span>
      );
    }
    if (percent >= 85) {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
          {percent}%
        </span>
      );
    }
    if (percent >= 70) {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {percent}%
        </span>
      );
    }
    return (
      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
        {percent}%
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Matriks Tracking Mingguan (Target vs Realisasi)
          </h3>
        </div>
        <div className="text-xs text-gray-500">
          Total data: <span className="font-semibold text-gray-800">{weeks.length} Minggu</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {/* Top header row */}
            <tr className="bg-gray-100/75 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 text-center border-r border-gray-200" rowSpan={2}>
                Minggu
              </th>
              <th className="py-2.5 px-3 text-center border-r border-gray-200" rowSpan={2}>
                Periode Tanggal
              </th>
              <th className="py-1.5 px-3 text-center border-r border-gray-200 bg-indigo-50/50" colSpan={4}>
                Kunjungan (Toko)
              </th>
              <th className="py-1.5 px-3 text-center border-r border-gray-200 bg-emerald-50/50" colSpan={4}>
                Effective Call / EC (Toko)
              </th>
              <th className="py-1.5 px-3 text-center border-r border-gray-200 bg-purple-50/50" colSpan={4}>
                Brand Distribution / BD (Outlet)
              </th>
              <th className="py-1.5 px-3 text-center bg-amber-50/50" colSpan={4}>
                Volume (Pack)
              </th>
            </tr>
            {/* Sub-header row */}
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[10px] text-right">
              {/* Kunjungan */}
              <th className="py-1.5 px-2">Target</th>
              <th className="py-1.5 px-2">Real</th>
              <th className="py-1.5 px-2">Gap</th>
              <th className="py-1.5 px-2 text-center border-r border-gray-200">%</th>
              {/* EC */}
              <th className="py-1.5 px-2">Target</th>
              <th className="py-1.5 px-2">Real</th>
              <th className="py-1.5 px-2">Gap</th>
              <th className="py-1.5 px-2 text-center border-r border-gray-200">%</th>
              {/* BD */}
              <th className="py-1.5 px-2">Target</th>
              <th className="py-1.5 px-2">Real</th>
              <th className="py-1.5 px-2">Gap</th>
              <th className="py-1.5 px-2 text-center border-r border-gray-200">%</th>
              {/* Volume */}
              <th className="py-1.5 px-2">Target</th>
              <th className="py-1.5 px-2">Real</th>
              <th className="py-1.5 px-2">Gap</th>
              <th className="py-1.5 px-2 text-center">%</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {weeks.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-8 text-center text-gray-400 text-xs">
                  Tidak ada data untuk filter yang dipilih.
                </td>
              </tr>
            ) : (
              weeks.map((w, idx) => {
                const isSelected = selectedWeek === w.kodeMinggu;
                return (
                  <tr
                    key={w.kodeMinggu}
                    onClick={() => onSelectWeek(w.kodeMinggu)}
                    className={`transition-colors cursor-pointer hover:bg-indigo-50/40 text-right ${isSelected
                        ? 'bg-indigo-50/80 font-medium'
                        : w.isCurrent
                          ? 'bg-amber-50/30'
                          : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50/30'
                      }`}
                  >
                    {/* Minggu Label */}
                    <td className="py-2 px-3 text-center font-bold text-gray-900 border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <span>W{w.weekNumber}</span>
                        {w.isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" title="Minggu Berjalan" />
                        )}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="py-2 px-3 text-center text-[11px] text-gray-500 border-r border-gray-200 whitespace-nowrap">
                      {w.startDate} - {w.endDate}
                    </td>

                    {/* Kunjungan: Target | Real | Gap | % */}
                    <td className="py-2 px-2 text-gray-500">{formatNumber(w.kunjungan.target)}</td>
                    <td className="py-2 px-2 font-bold text-gray-900">{formatNumber(w.kunjungan.realisasi)}</td>
                    <td className={`py-2 px-2 text-[11px] ${w.kunjungan.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {w.kunjungan.gap >= 0 ? `+${formatNumber(w.kunjungan.gap)}` : formatNumber(w.kunjungan.gap)}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-gray-200">
                      {getBadge(w.kunjungan.achievementPercent)}
                    </td>

                    {/* EC: Target | Real | Gap | % */}
                    <td className="py-2 px-2 text-gray-500">{formatNumber(w.ec.target)}</td>
                    <td className="py-2 px-2 font-bold text-gray-900">{formatNumber(w.ec.realisasi)}</td>
                    <td className={`py-2 px-2 text-[11px] ${w.ec.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {w.ec.gap >= 0 ? `+${formatNumber(w.ec.gap)}` : formatNumber(w.ec.gap)}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-gray-200">
                      {getBadge(w.ec.achievementPercent)}
                    </td>

                    {/* BD: Target | Real | Gap | % */}
                    <td className="py-2 px-2 text-gray-500">{formatNumber(w.bd.target)}</td>
                    <td className="py-2 px-2 font-bold text-gray-900">{formatNumber(w.bd.realisasi)}</td>
                    <td className={`py-2 px-2 text-[11px] ${w.bd.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {w.bd.gap >= 0 ? `+${formatNumber(w.bd.gap)}` : formatNumber(w.bd.gap)}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-gray-200">
                      {getBadge(w.bd.achievementPercent)}
                    </td>

                    {/* Volume: Target | Real | Gap | % */}
                    <td className="py-2 px-2 text-gray-500">{formatNumber(w.volume.target)}</td>
                    <td className="py-2 px-2 font-bold text-gray-900">{formatNumber(w.volume.realisasi)}</td>
                    <td className={`py-2 px-2 text-[11px] ${w.volume.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {w.volume.gap >= 0 ? `+${formatNumber(w.volume.gap)}` : formatNumber(w.volume.gap)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {getBadge(w.volume.achievementPercent)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer Totals */}
          {weeks.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold text-gray-900 border-t-2 border-gray-300 text-right">
                <td className="py-2.5 px-3 text-center border-r border-gray-200" colSpan={2}>
                  TOTAL KUARAL
                </td>
                {/* Kunjungan */}
                <td className="py-2.5 px-2">{formatNumber(summary.kunjungan.target)}</td>
                <td className="py-2.5 px-2 text-indigo-700">{formatNumber(summary.kunjungan.realisasi)}</td>
                <td className={`py-2.5 px-2 ${summary.kunjungan.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {summary.kunjungan.gap >= 0 ? `+${formatNumber(summary.kunjungan.gap)}` : formatNumber(summary.kunjungan.gap)}
                </td>
                <td className="py-2.5 px-2 text-center border-r border-gray-200">
                  {getBadge(summary.kunjungan.achievementPercent)}
                </td>

                {/* EC */}
                <td className="py-2.5 px-2">{formatNumber(summary.ec.target)}</td>
                <td className="py-2.5 px-2 text-emerald-700">{formatNumber(summary.ec.realisasi)}</td>
                <td className={`py-2.5 px-2 ${summary.ec.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {summary.ec.gap >= 0 ? `+${formatNumber(summary.ec.gap)}` : formatNumber(summary.ec.gap)}
                </td>
                <td className="py-2.5 px-2 text-center border-r border-gray-200">
                  {getBadge(summary.ec.achievementPercent)}
                </td>

                {/* BD */}
                <td className="py-2.5 px-2">{formatNumber(summary.bd.target)}</td>
                <td className="py-2.5 px-2 text-purple-700">{formatNumber(summary.bd.realisasi)}</td>
                <td className={`py-2.5 px-2 ${summary.bd.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {summary.bd.gap >= 0 ? `+${formatNumber(summary.bd.gap)}` : formatNumber(summary.bd.gap)}
                </td>
                <td className="py-2.5 px-2 text-center border-r border-gray-200">
                  {getBadge(summary.bd.achievementPercent)}
                </td>

                {/* Volume */}
                <td className="py-2.5 px-2">{formatNumber(summary.volume.target)}</td>
                <td className="py-2.5 px-2 text-amber-700">{formatNumber(summary.volume.realisasi)}</td>
                <td className={`py-2.5 px-2 ${summary.volume.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {summary.volume.gap >= 0 ? `+${formatNumber(summary.volume.gap)}` : formatNumber(summary.volume.gap)}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {getBadge(summary.volume.achievementPercent)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
