import React from 'react';
import { UserCheck } from 'lucide-react';
import { DashboardSalesmanRow } from '@/core/domain/models/Dashboard';

interface SalesmanLeaderboardTableProps {
  salesmen?: DashboardSalesmanRow[];
  sessionWeekDisplay?: string;
  loading?: boolean;
}

export const SalesmanLeaderboardTable: React.FC<SalesmanLeaderboardTableProps> = ({
  salesmen = [],
  sessionWeekDisplay,
  loading,
}) => {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getKpiColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-600';
    if (pct >= 80) return 'text-blue-600';
    return 'text-rose-600';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table Header Strip */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <UserCheck size={17} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Evaluasi Performa Salesman Berbasis KPI {sessionWeekDisplay ? `(${sessionWeekDisplay})` : ''}
          </h2>
          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
            {salesmen.length} Sales Representative
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
            Diurutkan Sesuai District (D-01 s/d D-12)
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <th className="py-2.5 px-4 w-28">Rayon / District</th>
              <th className="py-2.5 px-4">Nama Salesman</th>
              <th className="py-2.5 px-3">Penempatan</th>
              <th className="py-2.5 px-3 text-right">Real / Target Call</th>
              <th className="py-2.5 px-3 text-right">Kunjungan %</th>
              <th className="py-2.5 px-3 text-right">EC % (Target)</th>
              <th className="py-2.5 px-3 text-right">BD % (Target)</th>
              <th className="py-2.5 px-3 text-right">Vol (Pack)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Memuat data salesman...
                </td>
              </tr>
            ) : salesmen.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Tidak ada data salesman pada sesi ini.
                </td>
              </tr>
            ) : (
              salesmen.map((s, idx) => (
                <tr key={`${s.districtKode}-${s.penempatanCabang}-${s.karyawanId || idx}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono">
                      {s.districtKode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {s.namaSalesman}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {s.penempatanCabang}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    <strong className="text-slate-900">{formatNumber(s.realCall)}</strong> / {s.targetCall}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className={`font-bold ${getKpiColor(s.kunjunganPercent)}`}>
                      {s.kunjunganPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono" title={s.targetEc ? `Realisasi EC: ${s.realEc || 0} / Target: ${s.targetEc}` : undefined}>
                    <span className={`font-bold ${getKpiColor(s.ecPercent)}`}>
                      {s.ecPercent}%
                    </span>
                    {s.targetEc !== undefined && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {s.realEc || 0}/{s.targetEc}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono" title={s.targetBd ? `Realisasi BD: ${s.realBd || 0} / Target: ${s.targetBd}` : undefined}>
                    <span className={`font-bold ${getKpiColor(s.bdPercent)}`}>
                      {s.bdPercent}%
                    </span>
                    {s.targetBd !== undefined && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {s.realBd || 0}/{s.targetBd}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono" title={s.targetVolumePack ? `Target: ${formatNumber(s.targetVolumePack)} pack` : undefined}>
                    <div className="font-bold text-indigo-700">
                      {formatNumber(s.volumePack)}
                    </div>
                    {s.volumePercent !== undefined && s.volumePercent > 0 && (
                      <span className={`block text-[10px] font-semibold ${getKpiColor(s.volumePercent)}`}>
                        {s.volumePercent}% target
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
