import React, { useState } from 'react';
import { Tag, HelpCircle, BarChart2, Hash } from 'lucide-react';
import { DashboardBrandMatrixRow } from '@/core/domain/models/Dashboard';
import { BrandNotationAbsoluteItem } from '@/core/domain/models/ReportNotation';

export interface BrandNotationMatrixTableProps {
  brandMatrix?: (BrandNotationAbsoluteItem | DashboardBrandMatrixRow)[];
  consolidation?: BrandNotationAbsoluteItem | DashboardBrandMatrixRow;
  sessionWeekDisplay?: string;
  loading?: boolean;
  displayMode?: 'absolute' | 'percentage';
  onToggleDisplayMode?: (mode: 'absolute' | 'percentage') => void;
  callmadeTotal?: number;
  showCallmadeColumn?: boolean;
  title?: string;
}

export const BrandNotationMatrixTable: React.FC<BrandNotationMatrixTableProps> = ({
  brandMatrix = [],
  consolidation,
  sessionWeekDisplay,
  loading,
  displayMode = 'percentage',
  onToggleDisplayMode,
  callmadeTotal,
  showCallmadeColumn = true,
  title,
}) => {
  const [currentMode, setCurrentMode] = useState<'absolute' | 'percentage'>(displayMode);

  // Sync mode with prop change if prop changes
  React.useEffect(() => {
    setCurrentMode(displayMode);
  }, [displayMode]);

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getNotationColor = (percent: number) => {
    if (percent > 50) return 'text-rose-600 font-bold';
    if (percent >= 25) return 'text-amber-600 font-bold';
    return 'text-emerald-700 font-bold';
  };

  const isAbsolute = currentMode === 'absolute';

  // Derived effective callmade
  const effectiveCallmade =
    callmadeTotal !== undefined
      ? callmadeTotal
      : (consolidation as any)?.callmade || (brandMatrix[0] as any)?.callmade || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden transition-all">
      {/* Table Header Strip */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex flex-wrap items-center gap-2">
          <Tag size={17} className="text-primary-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {title || `Matriks Rekap Notasi Per Brand ${sessionWeekDisplay ? `(${sessionWeekDisplay})` : ''}`}
          </h2>
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
            Master Brand Aktif
          </span>
          {isAbsolute && effectiveCallmade > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary-50 text-primary-800 border border-primary-200 px-2.5 py-0.5 rounded-full shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" />
              Callmade: {formatNumber(effectiveCallmade)} Kunjungan
            </span>
          )}
        </div>

        {/* Legend & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Mode Switcher Toggle */}
          <div className="inline-flex items-center bg-slate-200/70 p-0.5 rounded-md text-[11px] font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setCurrentMode('percentage');
                onToggleDisplayMode?.('percentage');
              }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition ${!isAbsolute
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900 text-slate-500'
                }`}
              title="Tampilkan Rasio (%) terhadap Callmade"
            >
              <BarChart2 size={12} className={!isAbsolute ? 'text-primary-600' : ''} />
              <span>Rasio (%)</span>
            </button>


            <button
              type="button"
              onClick={() => {
                setCurrentMode('absolute');
                onToggleDisplayMode?.('absolute');
              }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition ${isAbsolute
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900 text-slate-500'
                }`}
              title="Tampilkan Angka Absolut (Toko & Pack)"
            >
              <Hash size={12} className={isAbsolute ? 'text-primary-600' : ''} />
              <span>Absolut</span>
            </button>
          </div>

          {!isAbsolute ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                &gt; 50%
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                25-50%
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                &lt; 25%
              </span>
            </div>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500">
              <HelpCircle size={13} className="text-slate-400" />
              Notasi = Jumlah Toko | Stok & Beli = Pack Fisik
            </span>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] text-left text-xs border-collapse">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">No</th>
              <th className="py-2.5 px-3 w-20">Kode</th>
              <th className="py-2.5 px-4 min-w-[170px]">Nama Brand</th>
              {isAbsolute && showCallmadeColumn && (
                <th className="py-2.5 px-3 text-right bg-slate-200/50 text-slate-900" title="Total Kunjungan dibuat oleh Salesman">
                  Callmade
                </th>
              )}
              <th className="py-2.5 px-3 text-right bg-slate-200/40">
                {isAbsolute ? 'BD (Toko)' : 'BD %'}
              </th>
              <th className="py-2.5 px-2.5 text-right">
                {isAbsolute ? 'Stok (Pack)' : 'Avg Stok'}
              </th>
              <th className="py-2.5 px-2.5 text-right">
                {isAbsolute ? 'Beli (Pack)' : 'Avg Beli'}
              </th>
              <th className="py-2.5 px-3 text-right bg-primary-50/50 text-primary-950 font-bold">
                Total Vol
              </th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'SK' : 'SK %'}</th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'SL' : 'SL %'}</th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'SD' : 'SD %'}</th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'OOS' : 'OOS %'}</th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'SB' : 'SB %'}</th>
              <th className="py-2.5 px-2.5 text-right">{isAbsolute ? 'TL' : 'TL %'}</th>
              <th className="py-2.5 px-3 text-right">{isAbsolute ? 'BPJ' : 'BPJ %'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={isAbsolute && showCallmadeColumn ? 15 : 14} className="py-8 text-center text-slate-400">
                  Memuat matriks brand...
                </td>
              </tr>
            ) : brandMatrix.length === 0 ? (
              <tr>
                <td colSpan={isAbsolute && showCallmadeColumn ? 15 : 14} className="py-8 text-center text-slate-400">
                  Belum ada rekaman notasi brand pada sesi ini.
                </td>
              </tr>
            ) : (
              brandMatrix.map((b: any) => {
                const callmadeVal = b.callmade || effectiveCallmade;
                const bdDisplay = isAbsolute ? formatNumber(b.bd) : `${b.bdPercent ?? 0}%`;
                const avgStockVal = b.avgStockPack ?? b.avgStokPack ?? 0;
                const avgBuyVal = b.avgBuyPack ?? b.avgBeliPack ?? 0;
                const stokDisplay = isAbsolute
                  ? formatNumber(b.totalStockPack ?? avgStockVal)
                  : avgStockVal;
                const beliDisplay = isAbsolute
                  ? formatNumber(b.totalBuyPack ?? avgBuyVal)
                  : avgBuyVal;
                const volDisplay = formatNumber(b.totalVolPack ?? b.totalBuyPack ?? 0);

                const skDisplay = isAbsolute ? formatNumber(b.sk) : `${b.skPercent ?? 0}%`;
                const slDisplay = isAbsolute ? formatNumber(b.sl) : `${b.slPercent ?? 0}%`;
                const sdDisplay = isAbsolute ? formatNumber(b.sd) : `${b.sdPercent ?? 0}%`;
                const oosDisplay = isAbsolute ? formatNumber(b.oos) : `${b.oosPercent ?? 0}%`;
                const sbDisplay = isAbsolute ? formatNumber(b.sb) : `${b.sbPercent ?? 0}%`;
                const tlDisplay = isAbsolute ? formatNumber(b.tl) : `${b.tlPercent ?? 0}%`;
                const bpjDisplay = isAbsolute ? formatNumber(b.bpj) : `${b.bpjPercent ?? 0}%`;

                return (
                  <tr key={b.kodeBrand || b.brandId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">{b.urutan}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800 text-[11px]">{b.kodeBrand}</td>
                    <td className="py-2 px-4 font-semibold text-slate-900">{b.namaBrand}</td>
                    {isAbsolute && showCallmadeColumn && (
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-slate-50/70">
                        {formatNumber(callmadeVal)}
                      </td>
                    )}
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-slate-50/60">
                      {bdDisplay}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-slate-700">{stokDisplay}</td>
                    <td className="py-2 px-2.5 text-right font-mono text-slate-700">{beliDisplay}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-primary-700 bg-primary-50/30">
                      {volDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.skPercent) : 'text-slate-800'}`}>
                      {skDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.slPercent) : 'text-emerald-700 font-semibold'}`}>
                      {slDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.sdPercent) : 'text-slate-800'}`}>
                      {sdDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.oosPercent) : 'text-rose-600 font-semibold'}`}>
                      {oosDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.sbPercent) : 'text-slate-800'}`}>
                      {sbDisplay}
                    </td>
                    <td className={`py-2 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor(b.tlPercent) : 'text-amber-700 font-semibold'}`}>
                      {tlDisplay}
                    </td>
                    <td className={`py-2 px-3 text-right font-mono font-semibold ${!isAbsolute ? getNotationColor(b.bpjPercent) : 'text-slate-700'}`}>
                      {bpjDisplay}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Consolidation */}
          {consolidation && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={3} className="py-2.5 px-4 uppercase text-[11px] tracking-wide text-slate-900">
                  {consolidation.namaBrand}
                </td>
                {isAbsolute && showCallmadeColumn && (
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 bg-slate-200/70">
                    {formatNumber((consolidation as any).callmade || effectiveCallmade)}
                  </td>
                )}
                <td className="py-2.5 px-3 text-right font-mono text-slate-900 bg-slate-200/50">
                  {isAbsolute ? formatNumber((consolidation as any).bd) : `${(consolidation as any).bdPercent ?? 0}%`}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono">
                  {isAbsolute
                    ? formatNumber((consolidation as any).totalStockPack ?? (consolidation as any).avgStockPack ?? (consolidation as any).avgStokPack)
                    : ((consolidation as any).avgStockPack ?? (consolidation as any).avgStokPack ?? 0)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono">
                  {isAbsolute
                    ? formatNumber((consolidation as any).totalBuyPack ?? (consolidation as any).avgBuyPack ?? (consolidation as any).avgBeliPack)
                    : ((consolidation as any).avgBuyPack ?? (consolidation as any).avgBeliPack ?? 0)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-primary-800 bg-primary-100/50">
                  {formatNumber(consolidation.totalVolPack ?? (consolidation as any).totalBuyPack ?? 0)}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).skPercent) : ''}`}>
                  {isAbsolute ? formatNumber((consolidation as any).sk) : `${(consolidation as any).skPercent}%`}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).slPercent) : 'text-emerald-800'}`}>
                  {isAbsolute ? formatNumber((consolidation as any).sl) : `${(consolidation as any).slPercent}%`}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).sdPercent) : ''}`}>
                  {isAbsolute ? formatNumber((consolidation as any).sd) : `${(consolidation as any).sdPercent}%`}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).oosPercent) : 'text-rose-700'}`}>
                  {isAbsolute ? formatNumber((consolidation as any).oos) : `${(consolidation as any).oosPercent}%`}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).sbPercent) : ''}`}>
                  {isAbsolute ? formatNumber((consolidation as any).sb) : `${(consolidation as any).sbPercent}%`}
                </td>
                <td className={`py-2.5 px-2.5 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).tlPercent) : 'text-amber-800'}`}>
                  {isAbsolute ? formatNumber((consolidation as any).tl) : `${(consolidation as any).tlPercent}%`}
                </td>
                <td className={`py-2.5 px-3 text-right font-mono ${!isAbsolute ? getNotationColor((consolidation as any).bpjPercent) : ''}`}>
                  {isAbsolute ? formatNumber((consolidation as any).bpj) : `${(consolidation as any).bpjPercent}%`}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default BrandNotationMatrixTable;
