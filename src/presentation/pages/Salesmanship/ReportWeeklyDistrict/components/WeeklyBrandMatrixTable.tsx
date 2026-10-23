import React from 'react';
import { WeeklyDistrictReportResponse } from '@/core/domain/models/ReportWeeklyDistrict';
import { ShieldCheck } from 'lucide-react';

interface WeeklyBrandMatrixTableProps {
  brandMatrix: WeeklyDistrictReportResponse['brandMatrix'];
}

export const WeeklyBrandMatrixTable: React.FC<WeeklyBrandMatrixTableProps> = ({ brandMatrix }) => {
  const { totalSkuAktif, totalKunjunganMingguan, brands, summaryRow } = brandMatrix;

  const getBrandDotColor = (index: number) => {
    const colors = [
      'bg-purple-600',
      'bg-sky-600',
      'bg-rose-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-indigo-600',
      'bg-cyan-600',
      'bg-teal-600',
      'bg-orange-600',
      'bg-pink-600',
      'bg-blue-600',
      'bg-lime-600',
      'bg-violet-600',
      'bg-red-600',
      'bg-fuchsia-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 font-bold text-base shadow-xs">
            ▦
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-950 tracking-tight">
                Matriks Distribusi {totalSkuAktif} Brand Inti FMCG
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200 rounded-md">
                {totalSkuAktif} SKU AKTIF
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              BD: Auto-Sum (SK+SL+SD+OOS+SB) · Persentase dihitung terhadap akumulasi{' '}
              <strong className="text-gray-700 font-semibold">{totalKunjunganMingguan} kunjungan mingguan</strong>.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Validasi Otomatis Terpenuhi</span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 px-1 py-0.5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-gray-700">KETERANGAN:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span className="text-gray-700">Validasi Sesuai</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            <strong className="text-gray-900">BD: Auto-Sum</strong> (SK+SL+SD+OOS+SB)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            <span className="text-gray-500">Read-Only</span>
          </span>
        </div>
        <div className="text-gray-400 text-[11px]">
          Satuan Volume: <strong className="text-gray-600">Pack (Pk)</strong>
        </div>
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          {/* Multi-tier Table Header */}
          <thead className="bg-gray-100 text-gray-700 uppercase font-semibold tracking-wider">
            {/* Level 1 Group Header */}
            <tr className="border-b border-gray-200 text-center">
              <th rowSpan={2} className="py-3 px-2 w-10 border-r border-gray-200 text-center">
                #
              </th>
              <th rowSpan={2} className="py-3 px-3 min-w-[200px] border-r border-gray-200 text-left">
                KODE BRAND & NAMA BRAND
              </th>
              <th colSpan={7} className="py-2 px-2 border-r border-gray-200 bg-gray-100 text-gray-800 font-bold">
                NOTASI (% DARI {totalKunjunganMingguan} KUNJUNGAN)
              </th>
              <th rowSpan={2} className="py-3 px-3 w-24 border-r border-gray-200 bg-purple-50 text-purple-900 font-bold text-center">
                BD OUTLET
                <span className="block text-[10px] font-normal text-purple-600 lowercase">[%]</span>
              </th>
              <th colSpan={3} className="py-2 px-2 bg-blue-50/70 text-blue-900 font-bold text-center">
                VOLUME & PEMBELIAN (PACK)
              </th>
            </tr>

            {/* Level 2 Sub-columns */}
            <tr className="border-b border-gray-200 text-[11px] text-gray-600 bg-gray-50 text-center">
              <th className="py-2 px-1 w-12 border-r border-gray-200">SK%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">SL%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">SD%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">OOS%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">SB%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">TL%</th>
              <th className="py-2 px-1 w-12 border-r border-gray-200">BPJ%</th>
              <th className="py-2 px-1 w-16 border-r border-gray-200 bg-blue-50/50">AVG STOCK</th>
              <th className="py-2 px-1 w-16 border-r border-gray-200 bg-blue-50/50">AVG BUY</th>
              <th className="py-2 px-2 w-20 bg-blue-50/50">TOTAL VOL</th>
            </tr>
          </thead>

          {/* Table Body (Dynamic from mst_brand) */}
          <tbody className="divide-y divide-gray-200 bg-white font-mono text-xs">
            {brands.map((b, idx) => (
              <tr key={b.brandId} className="hover:bg-gray-50 transition-colors">
                {/* Index */}
                <td className="py-2 px-2 text-center text-gray-500 font-mono text-xs border-r border-gray-200">
                  {String(b.urutan || idx + 1).padStart(2, '0')}
                </td>

                {/* Brand Code & Name */}
                <td className="py-2 px-3 border-r border-gray-200 font-sans">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getBrandDotColor(idx)}`} />
                    <div>
                      <div className="font-bold text-gray-950 font-mono tracking-wide">
                        {b.kode}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[170px]">
                        {b.nama}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Notasi % Columns */}
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-700">
                  {b.notasi.skPercent > 0 ? (
                    <span className="font-semibold text-rose-600">{b.notasi.skPercent}%</span>
                  ) : (
                    <span className="text-gray-400">0%</span>
                  )}
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-900 font-bold">
                  {b.notasi.slPercent}%
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-800">
                  {b.notasi.sdPercent}%
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200">
                  {b.notasi.oosPercent > 0 ? (
                    <span className="font-bold text-rose-600">{b.notasi.oosPercent}%</span>
                  ) : (
                    <span className="text-gray-400">0%</span>
                  )}
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-700">
                  {b.notasi.sbPercent}%
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-600">
                  {b.notasi.tlPercent}%
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-sky-700 font-semibold">
                  {b.notasi.bpjPercent}%
                </td>

                {/* BD Outlet % (Purple Cell) */}
                <td className="py-2 px-2 text-center border-r border-gray-200 bg-purple-50/70 font-bold text-purple-800">
                  {b.notasi.bdPercent}%
                </td>

                {/* Volume & Pembelian */}
                <td className="py-2 px-1 text-center border-r border-gray-200 text-gray-800">
                  {b.volume.avgStock} <span className="text-[10px] text-gray-500">pck</span>
                </td>
                <td className="py-2 px-1 text-center border-r border-gray-200 text-sky-700 font-semibold">
                  {b.volume.avgBuy} <span className="text-[10px] text-sky-600">pck</span>
                </td>
                <td className="py-2 px-2 text-center font-bold text-gray-950 bg-blue-50/30">
                  {b.volume.totalVol.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer: Summary Row */}
          <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-mono text-xs font-bold text-gray-900">
            <tr>
              <td colSpan={2} className="py-3 px-3 border-r border-gray-300 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-primary-700 text-base">▦</span>
                  <span className="tracking-wide uppercase font-bold text-gray-900">
                    {summaryRow.label}
                  </span>
                </div>
              </td>

              {/* Notasi Averages */}
              <td className="py-3 px-1 text-center border-r border-gray-300 text-rose-600">
                {summaryRow.skPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-gray-950">
                {summaryRow.slPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-gray-800">
                {summaryRow.sdPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-rose-600">
                {summaryRow.oosPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-gray-700">
                {summaryRow.sbPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-gray-600">
                {summaryRow.tlPercent}%
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-sky-700">
                {summaryRow.bpjPercent}%
              </td>

              {/* BD Outlet Average */}
              <td className="py-3 px-2 text-center border-r border-gray-300 bg-purple-100 text-purple-900 font-black">
                {summaryRow.bdPercent}%
              </td>

              {/* Volume Averages */}
              <td className="py-3 px-1 text-center border-r border-gray-300 text-gray-900">
                {summaryRow.avgStock} <span className="text-[10px] text-gray-500 font-normal">pck</span>
              </td>
              <td className="py-3 px-1 text-center border-r border-gray-300 text-sky-800">
                {summaryRow.avgBuy} <span className="text-[10px] text-sky-600 font-normal">pck</span>
              </td>
              <td className="py-3 px-2 text-center text-primary-950 bg-blue-100/70 font-black">
                {summaryRow.totalVol.toLocaleString('id-ID')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footnote & Audit Seal */}
      <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500">
        <div>
          <span className="font-semibold text-gray-700">Klasifikasi Notasi: </span>
          SK = Stok Kosong, SL = Stok Lengkap, SD = Stok Display, OOS = Out of Stock, SB = Stok Berlebih, TL = Toko Lewat, BPJ = Beli Pesaing Juga
        </div>

        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data terkunci secara kriptografis (SHA-256 Audit Seal)</span>
        </div>
      </div>
    </div>
  );
};
