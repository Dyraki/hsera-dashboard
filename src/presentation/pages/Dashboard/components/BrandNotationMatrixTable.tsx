import React from 'react';
import { Tag } from 'lucide-react';
import { DashboardBrandMatrixRow } from '@/core/domain/models/Dashboard';

interface BrandNotationMatrixTableProps {
  brandMatrix?: DashboardBrandMatrixRow[];
  consolidation?: DashboardBrandMatrixRow;
  sessionWeekDisplay?: string;
  loading?: boolean;
}

export const BrandNotationMatrixTable: React.FC<BrandNotationMatrixTableProps> = ({
  brandMatrix = [],
  consolidation,
  sessionWeekDisplay,
  loading,
}) => {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getNotationColor = (percent: number) => {
    if (percent > 50) return 'text-rose-600 font-bold';
    if (percent >= 25) return 'text-amber-600 font-bold';
    return 'text-emerald-700 font-bold';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table Header Strip */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Tag size={17} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Matriks Rekap Notasi Per Brand {sessionWeekDisplay ? `(${sessionWeekDisplay})` : ''}
          </h2>
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
            Master Brand Aktif
          </span>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Tinggi (&gt; 50%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Sedang (25% - 50%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Rendah (&lt; 25%)
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-xs border-collapse">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">No</th>
              <th className="py-2.5 px-3 w-20">Kode</th>
              <th className="py-2.5 px-4 min-w-[170px]">Nama Brand</th>
              <th className="py-2.5 px-3 text-right bg-slate-200/40">BD %</th>
              <th className="py-2.5 px-2.5 text-right">Avg Stok</th>
              <th className="py-2.5 px-2.5 text-right">Avg Beli</th>
              <th className="py-2.5 px-3 text-right bg-indigo-50/50 text-indigo-900">Total Vol</th>
              <th className="py-2.5 px-2.5 text-right">SK %</th>
              <th className="py-2.5 px-2.5 text-right">SL %</th>
              <th className="py-2.5 px-2.5 text-right">SD %</th>
              <th className="py-2.5 px-2.5 text-right">OOS %</th>
              <th className="py-2.5 px-2.5 text-right">SB %</th>
              <th className="py-2.5 px-2.5 text-right">TL %</th>
              <th className="py-2.5 px-3 text-right">BPJ %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={14} className="py-8 text-center text-slate-400">
                  Memuat matriks brand...
                </td>
              </tr>
            ) : brandMatrix.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-8 text-center text-slate-400">
                  Belum ada rekaman notasi brand pada sesi ini.
                </td>
              </tr>
            ) : (
              brandMatrix.map((b) => (
                <tr key={b.kodeBrand} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">{b.urutan}</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 text-[11px]">{b.kodeBrand}</td>
                  <td className="py-2 px-4 font-semibold text-slate-900">{b.namaBrand}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-slate-50/60">
                    {b.bdPercent}%
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono text-slate-600">{b.avgStokPack}</td>
                  <td className="py-2 px-2.5 text-right font-mono text-slate-600">{b.avgBeliPack}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-indigo-700 bg-indigo-50/30">
                    {formatNumber(b.totalVolPack)}
                  </td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.skPercent)}`}>{b.skPercent}%</td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.slPercent)}`}>{b.slPercent}%</td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.sdPercent)}`}>{b.sdPercent}%</td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.oosPercent)}`}>{b.oosPercent}%</td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.sbPercent)}`}>{b.sbPercent}%</td>
                  <td className={`py-2 px-2.5 text-right font-mono ${getNotationColor(b.tlPercent)}`}>{b.tlPercent}%</td>
                  <td className={`py-2 px-3 text-right font-mono font-semibold ${getNotationColor(b.bpjPercent)}`}>{b.bpjPercent}%</td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Footer: Consolidation */}
          {consolidation && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={3} className="py-2.5 px-4 uppercase text-[11px] tracking-wide text-indigo-900">
                  {consolidation.namaBrand}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900 bg-slate-200/50">
                  {consolidation.bdPercent}%
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono">{consolidation.avgStokPack}</td>
                <td className="py-2.5 px-2.5 text-right font-mono">{consolidation.avgBeliPack}</td>
                <td className="py-2.5 px-3 text-right font-mono text-indigo-800 bg-indigo-100/50">
                  {formatNumber(consolidation.totalVolPack)}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.skPercent)}`}>{consolidation.skPercent}%</td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.slPercent)}`}>{consolidation.slPercent}%</td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.sdPercent)}`}>{consolidation.sdPercent}%</td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.oosPercent)}`}>{consolidation.oosPercent}%</td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.sbPercent)}`}>{consolidation.sbPercent}%</td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${getNotationColor(consolidation.tlPercent)}`}>{consolidation.tlPercent}%</td>
                <td className={`py-2.5 px-3 text-right font-mono ${getNotationColor(consolidation.bpjPercent)}`}>{consolidation.bpjPercent}%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
