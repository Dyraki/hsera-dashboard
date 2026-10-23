import React from "react";
import { CallsheetBrand } from "@/core/domain/models/Callsheet";
import { RowValidationResult, ColumnTotals } from "../types";
import { AlertTriangle, AlertCircle, ShieldCheck } from "lucide-react";

interface CallsheetMatrixTableProps {
  brands: CallsheetBrand[];
  matrix: Record<string, Record<string, number>>;
  onCellChange: (brandId: string, notasiKode: string, val: number) => void;
  rowValidations: RowValidationResult[];
  columnTotals: ColumnTotals;
  jumlahKunjungan: number;
  disabled?: boolean;
}

export const CallsheetMatrixTable: React.FC<CallsheetMatrixTableProps> = ({
  brands,
  matrix,
  onCellChange,
  rowValidations,
  columnTotals,
  jumlahKunjungan,
  disabled = false,
}) => {
  // Brand color dot helper
  const getBrandDotColor = (index: number) => {
    const colors = [
      "bg-purple-600", "bg-sky-600", "bg-rose-600", "bg-emerald-600",
      "bg-amber-600", "bg-indigo-600", "bg-cyan-600", "bg-teal-600",
      "bg-orange-600", "bg-pink-600", "bg-blue-600", "bg-lime-600",
      "bg-violet-600", "bg-red-600", "bg-fuchsia-600",
    ];
    return colors[index % colors.length];
  };

  // Keyboard navigation on Enter
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colKey: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextRow = rowIndex + 1;
      if (nextRow < brands.length) {
        const nextInputId = `cell-${brands[nextRow].id}-${colKey}`;
        const el = document.getElementById(nextInputId) as HTMLInputElement;
        if (el) el.focus();
      }
    }
  };

  // Filter errors and warnings for bottom banners
  const overErrors = rowValidations.filter((rv) => rv.isOver);
  const underWarnings = rowValidations.filter((rv) => rv.isUnder && jumlahKunjungan > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5">
      {/* Table Header Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 font-bold text-base shadow-xs">
            ▦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Matriks Distribusi 15 Brand Inti FMCG
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200 rounded-md">
                {brands.length} SKU AKTIF
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Input data kunjungan outlet per brand. Perubahan dihitung otomatis secara live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pemeriksaan Konsistensi Real-time Aktif</span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 px-1 py-0.5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-gray-700">KETERANGAN:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            <strong className="text-gray-900">BD: Auto-Sum</strong> (SK+SL+SD+OOS+SB)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <strong className="text-gray-900">BPJ: Auto-Calc</strong> (Kunjungan - Lainnya)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span className="text-gray-700">Valid (Total = Kunjungan)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-gray-700">Warning Varians</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            <span className="text-gray-700">Error / Selisih</span>
          </span>
        </div>
        <div className="text-gray-400">
          Enter: Pindah baris bawah
        </div>
      </div>

      {/* Main Responsive Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          {/* Multi-tier Table Header */}
          <thead className="bg-gray-100 text-gray-700 uppercase font-semibold tracking-wider">
            {/* Level 1 Group Header */}
            <tr className="border-b border-gray-200">
              <th rowSpan={2} className="py-3 px-2 text-center w-10 border-r border-gray-200">
                #
              </th>
              <th rowSpan={2} className="py-3 px-3 min-w-[200px] border-r border-gray-200">
                KODE BRAND
              </th>
              <th colSpan={7} className="py-2 px-2 text-center border-r border-gray-200 bg-gray-100 text-gray-800">
                KLASIFIKASI STATUS OUTLET (KUNJUNGAN HARI INI)
              </th>
              <th rowSpan={2} className="py-3 px-2 text-center w-16 border-r border-gray-200 bg-purple-50 text-purple-800 font-bold">
                BD
                <span className="block text-[10px] font-normal text-purple-600 lowercase">auto</span>
              </th>
              <th colSpan={2} className="py-2 px-2 text-center border-r border-gray-200 bg-gray-100 text-gray-800">
                KUANTITAS
              </th>
              <th rowSpan={2} className="py-3 px-2 text-center w-20 border-r border-gray-200 text-gray-800">
                FACE UP
              </th>
              <th rowSpan={2} className="py-3 px-3 text-center min-w-[130px] bg-gray-100 text-gray-800">
                STATUS VS KUNJUNGAN
                <span className="block text-[10px] text-gray-500 lowercase">
                  (kunjungan: {jumlahKunjungan})
                </span>
              </th>
            </tr>
            {/* Level 2 Sub-columns */}
            <tr className="border-b border-gray-200 text-[11px] text-gray-600 bg-gray-50">
              {/* Status Outlet Columns */}
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">SK</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">SL</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">SD</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">OOS</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">SB</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200">TL</th>
              <th className="py-2 px-1 text-center w-12 border-r border-gray-200 bg-amber-50/70 text-amber-800 font-bold">
                BPJ
                <span className="block text-[10px] font-normal text-amber-600 lowercase">auto</span>
              </th>
              {/* Kuantitas Columns */}
              <th className="py-2 px-1 text-center w-14 border-r border-gray-200">Stock</th>
              <th className="py-2 px-1 text-center w-14 border-r border-gray-200">Buy</th>
            </tr>
          </thead>

          {/* Table Body: 15 Rows */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {brands.map((brand, idx) => {
              const row = matrix[brand.id] || {};
              const rv = rowValidations[idx] || {
                totalStatus: 0,
                diff: 0,
                isMatch: true,
                isOver: false,
                isUnder: false,
              };

              return (
                <tr
                  key={brand.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* # */}
                  <td className="py-2 px-2 text-center text-gray-500 font-mono text-xs border-r border-gray-200">
                    {idx + 1}
                  </td>

                  {/* KODE BRAND & NAMA */}
                  <td className="py-2 px-3 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${getBrandDotColor(idx)}`} />
                      <div>
                        <div className="font-bold text-gray-950 tracking-wide font-mono">
                          {brand.kode}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[170px]">
                          {brand.nama}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* STATUS OUTLET CELLS */}
                  {["SK", "SL", "SD", "OOS", "SB", "TL"].map((notasi) => (
                    <td key={notasi} className="py-1 px-1 border-r border-gray-200 text-center">
                      <input
                        id={`cell-${brand.id}-${notasi}`}
                        type="number"
                        min={0}
                        disabled={disabled}
                        value={row[notasi] === 0 ? "" : row[notasi] ?? ""}
                        onChange={(e) =>
                          onCellChange(brand.id, notasi, parseInt(e.target.value) || 0)
                        }
                        onKeyDown={(e) => handleKeyDown(e, idx, notasi)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        className="w-full text-center bg-transparent hover:bg-gray-100/70 focus:bg-white border border-transparent hover:border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded py-1 text-gray-900 font-mono text-xs font-semibold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  ))}

                  {/* BPJ (AUTO-CALC) - Read Only Amber Cell */}
                  <td className="py-1 px-1 text-center border-r border-gray-200 bg-amber-50/70">
                    <span className="block font-bold text-amber-800 font-mono text-xs py-1">
                      {row["BPJ"] || 0}
                    </span>
                  </td>

                  {/* BD (AUTO-SUM) - Read Only Purple Cell */}
                  <td className="py-1 px-1 text-center border-r border-gray-200 bg-purple-50/70">
                    <span className="block font-bold text-purple-700 font-mono text-xs py-1">
                      {row["BD"] || 0}
                    </span>
                  </td>

                  {/* KUANTITAS: Stock & Buy */}
                  {["STOCK", "BUY"].map((notasi) => (
                    <td key={notasi} className="py-1 px-1 border-r border-gray-200 text-center">
                      <input
                        id={`cell-${brand.id}-${notasi}`}
                        type="number"
                        min={0}
                        disabled={disabled}
                        value={row[notasi] === 0 ? "" : row[notasi] ?? ""}
                        onChange={(e) =>
                          onCellChange(brand.id, notasi, parseInt(e.target.value) || 0)
                        }
                        onKeyDown={(e) => handleKeyDown(e, idx, notasi)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        className={`w-full text-center bg-transparent hover:bg-gray-100/70 focus:bg-white border border-transparent hover:border-gray-300 rounded py-1 font-mono text-xs font-semibold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${notasi === "BUY" ? "text-sky-700 focus:border-sky-500" : "text-gray-900 focus:border-primary-500"
                          }`}
                      />
                    </td>
                  ))}

                  {/* FACE UP - Single Column */}
                  <td className="py-1 px-1 text-center border-r border-gray-200">
                    <input
                      id={`cell-${brand.id}-FACE_UP`}
                      type="number"
                      min={0}
                      disabled={disabled}
                      value={row["FACE_UP"] === 0 ? "" : row["FACE_UP"] ?? ""}
                      onChange={(e) =>
                        onCellChange(brand.id, "FACE_UP", parseInt(e.target.value) || 0)
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx, "FACE_UP")}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0"
                      className="w-full text-center bg-transparent hover:bg-gray-100/70 focus:bg-white border border-transparent hover:border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded py-1 text-gray-900 font-mono text-xs font-semibold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>

                  {/* STATUS VS KUNJUNGAN REAL-TIME BADGE */}
                  <td className="py-1.5 px-3 text-center">
                    {jumlahKunjungan === 0 ? (
                      <span className="text-gray-400 font-mono text-xs">-</span>
                    ) : rv.isMatch ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rv.totalStatus} / {jumlahKunjungan} ✓
                      </span>
                    ) : rv.isUnder ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200">
                        {rv.totalStatus} / {jumlahKunjungan} △ ({rv.diff})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                        {rv.totalStatus} / {jumlahKunjungan} ⊗ (+{rv.diff})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Baris Total */}
          <tfoot className="bg-gray-100 font-bold text-xs text-gray-900 border-t-2 border-gray-300">
            <tr>
              <td colSpan={2} className="py-3 px-3 text-right uppercase tracking-wider border-r border-gray-200 text-gray-800">
                ∑ TOTAL {brands.length} BRAND
              </td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.sk}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.sl}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.sd}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.oos}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.sb}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.tl}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200 bg-amber-100/70 text-amber-900">
                {columnTotals.bpj}
              </td>
              {/* BD SUM */}
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200 bg-purple-100/70 text-purple-900">
                {columnTotals.bd}
              </td>
              {/* Kuantitas SUM */}
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200">{columnTotals.stock}</td>
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200 text-sky-700">{columnTotals.buy}</td>
              {/* Face Up SUM */}
              <td className="py-2 px-1 text-center font-mono border-r border-gray-200 text-emerald-700">{columnTotals.faceUp}</td>
              {/* Validation Counts Summary */}
              <td className="py-2 px-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono">
                  <span className="text-emerald-700">{columnTotals.okCount} OK</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-amber-700">{columnTotals.warnCount} WRN</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-rose-700">{columnTotals.errCount} ERR</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Real-time Error / Warning Alert Cards */}
      <div className="space-y-2 pt-1">
        {overErrors.map((err) => (
          <div
            key={err.brandId}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Kesalahan Keras:</strong> {err.brandKode} ({err.brandNama}) total status{" "}
              <strong>{err.totalStatus}</strong> (Lebih {err.diff} dari jumlah kunjungan {jumlahKunjungan})
            </span>
          </div>
        ))}

        {underWarnings.map((warn) => (
          <div
            key={warn.brandId}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Peringatan:</strong> {warn.brandKode} ({warn.brandNama}) total status{" "}
              <strong>{warn.totalStatus}</strong> (Kurang {Math.abs(warn.diff)} dari jumlah kunjungan {jumlahKunjungan})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
