import React from 'react';
import { Building } from 'lucide-react';
import { DashboardBranchRow, DashboardBranchTotal } from '@/core/domain/models/Dashboard';

interface BranchComparisonTableProps {
  branches?: DashboardBranchRow[];
  total?: DashboardBranchTotal;
  sessionWeekDisplay?: string;
  loading?: boolean;
}

export const BranchComparisonTable: React.FC<BranchComparisonTableProps> = ({
  branches = [],
  total,
  sessionWeekDisplay,
  loading,
}) => {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table Header Strip */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Building size={17} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Evaluasi Kinerja Cabang / Operation Unit {sessionWeekDisplay ? `(${sessionWeekDisplay})` : ''}
          </h2>
          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
            {branches.length} Cabang Aktif
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Dihitung dinamis dari realisasi callsheet mingguan (Tanpa kolom skor terbobot)
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <th className="py-2.5 px-4 w-24">Kode</th>
              <th className="py-2.5 px-4">Nama Cabang</th>
              <th className="py-2.5 px-3 text-right">Target Call</th>
              <th className="py-2.5 px-3 text-right">Real Call</th>
              <th className="py-2.5 px-3 text-right">Kunjungan %</th>
              <th className="py-2.5 px-3 text-right">EC %</th>
              <th className="py-2.5 px-3 text-right">BD %</th>
              <th className="py-2.5 px-3 text-right">Vol (Pack)</th>
              <th className="py-2.5 px-3 text-right">Vol (Karton)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Memuat data cabang...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Tidak ada cabang dengan transaksi callsheet pada kuartal ini.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.kode} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.kode}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{b.namaCabang}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">{formatNumber(b.targetCall)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatNumber(b.realCall)}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`font-bold ${
                        b.kunjunganPercent >= 90
                          ? 'text-emerald-600'
                          : b.kunjunganPercent >= 80
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {b.kunjunganPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">{b.ecPercent}%</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">{b.bdPercent}%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700">
                    {formatNumber(b.volumePack)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 bg-slate-50/50">
                    {b.volumeKarton}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Footer: Total / Consolidation */}
          {total && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-4 uppercase text-[11px] tracking-wide text-slate-800">
                  {total.label}
                </td>
                <td className="py-3 px-3 text-right font-mono">{formatNumber(total.targetCall)}</td>
                <td className="py-3 px-3 text-right font-mono text-indigo-900">{formatNumber(total.realCall)}</td>
                <td className="py-3 px-3 text-right font-mono text-blue-700">{total.kunjunganPercent}%</td>
                <td className="py-3 px-3 text-right font-mono text-slate-800">{total.ecPercent}%</td>
                <td className="py-3 px-3 text-right font-mono text-slate-800">{total.bdPercent}%</td>
                <td className="py-3 px-3 text-right font-mono text-indigo-800">{formatNumber(total.volumePack)}</td>
                <td className="py-3 px-3 text-right font-mono text-indigo-900 bg-slate-200/50">
                  {total.volumeKarton}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
