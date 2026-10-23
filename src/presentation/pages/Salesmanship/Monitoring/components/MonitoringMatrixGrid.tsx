import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  WeeklyDistrictMonitoringRow,
  
  WeeklyMonitoringResponse,
} from "@/core/domain/models/Monitoring";
import {
  CheckCircle2,
  Clock,
  CalendarX,
  PlusCircle,
  ExternalLink,
  Info,
  Layers,
  
} from "lucide-react";

interface MonitoringMatrixGridProps {
  districts: WeeklyDistrictMonitoringRow[];
  isLoading?: boolean;
  weekResponse: WeeklyMonitoringResponse | null;
}

const formatShortDate = (isoDate?: string): string => {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length < 3) return isoDate;
  return `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}`;
};

const getKpiPillColor = (percent: number): string => {
  if (percent >= 100) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (percent >= 75) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
};

export const MonitoringMatrixGrid: React.FC<MonitoringMatrixGridProps> = ({
  districts,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Day header metadata (using the first district's days, or standard 1..6)
  const dayHeaders = useMemo(() => {
    if (districts.length > 0 && districts[0].days) {
      return districts[0].days.map((d) => ({
        hari: d.hari,
        namaHari: d.namaHari,
        date: d.date,
      }));
    }
    const defaultDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return defaultDays.map((nama, idx) => ({
      hari: idx + 1,
      namaHari: nama,
      date: "",
    }));
  }, [districts]);

  // Aggregate day column totals across all displayed districts
  const dayColumnTotals = useMemo(() => {
    const totals = dayHeaders.map(() => ({
      terisiCount: 0,
      totalCm: 0,
      totalBd: 0,
      totalEc: 0,
      totalVolume: 0,
    }));

    districts.forEach((dist) => {
      dist.days.forEach((day, idx) => {
        if (totals[idx]) {
          if (day.status === "TERISI") {
            totals[idx].terisiCount++;
            totals[idx].totalCm += day.jumlahKunjungan || 0;
            totals[idx].totalBd += day.bdOutlet || 0;
            totals[idx].totalEc += day.totalEc || 0;
            totals[idx].totalVolume += Number(day.volumeGg) || 0;
          } else if (day.status === "TIDAK_ADA_KUNJUNGAN") {
            totals[idx].terisiCount++;
          }
        }
      });
    });

    return totals;
  }, [districts, dayHeaders]);

  // Overall total summary
  const grandTotalSummary = useMemo(() => {
    const totalSlot = districts.length * 6;
    let totalTerisi = 0;
    let grandCm = 0;
    let grandBd = 0;
    let grandEc = 0;
    let grandVol = 0;

    let grandTargetCm = 0;
    let grandTargetEc = 0;
    let grandTargetBd = 0;
    let grandTargetVol = 0;
    let sumOverallScore = 0;

    districts.forEach((dist) => {
      if (dist.kpiAchievement) {
        grandTargetCm += dist.kpiAchievement.target.kunjungan;
        grandTargetEc += dist.kpiAchievement.target.ec;
        grandTargetBd += dist.kpiAchievement.target.bd;
        grandTargetVol += dist.kpiAchievement.target.volume;
        sumOverallScore += dist.kpiAchievement.percent.overall;
      }
    });

    dayColumnTotals.forEach((col) => {
      totalTerisi += col.terisiCount;
      grandCm += col.totalCm;
      grandBd += col.totalBd;
      grandEc += col.totalEc;
      grandVol += col.totalVolume;
    });

    const avgPersenHari = totalSlot > 0 ? Math.round((totalTerisi / totalSlot) * 100) : 0;
    const avgOverallAchievement =
      districts.length > 0 ? Math.round(sumOverallScore / districts.length) : avgPersenHari;

    return {
      totalSlot,
      totalTerisi,
      avgPersenHari,
      avgOverallAchievement,
      grandCm,
      grandBd,
      grandEc,
      grandVol,
      grandTargetCm,
      grandTargetEc,
      grandTargetBd,
      grandTargetVol,
    };
  }, [districts, dayColumnTotals]);

  // Handler to navigate to callsheet form
  const handleCellClick = (districtId: string, date: string) => {
    if (!date) return;
    navigate(`/salesmanship/callsheet?districtId=${districtId}&date=${date}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xs text-center space-y-3">
        <div className="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-800">Memuat matriks mingguan...</p>
        <p className="text-xs text-gray-500">Mengambil status callsheet seluruh teritori.</p>
      </div>
    );
  }

  if (districts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-xs text-center space-y-3">
        <Layers className="w-10 h-10 text-gray-400 mx-auto" />
        <h3 className="text-sm font-bold text-gray-800">Tidak Ada Data Ditemukan</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Tidak ada district yang sesuai dengan kriteria filter atau pencarian Anda. Silakan ubah filter
          status atau kata kunci pencarian.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 text-xs">
              <th className="py-3.5 px-4 font-bold text-gray-900 w-56 sticky left-0 bg-gray-50/95 z-10 border-r border-gray-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                District / Teritori
              </th>
              {dayHeaders.map((dh) => (
                <th key={dh.hari} className="py-3 px-3 font-semibold text-center border-r border-gray-200 min-w-[140px]">
                  <div className="font-bold text-gray-900">{dh.namaHari}</div>
                  {dh.date && (
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                      {formatShortDate(dh.date)}
                    </div>
                  )}
                </th>
              ))}
              <th className="py-3 px-4 font-bold text-center text-gray-900 w-48 min-w-[175px]">
                Pencapaian Minggu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs">
            {districts.map((dist) => {
              const ach = dist.kpiAchievement;
              const overallPercent = ach ? ach.percent.overall : dist.persentaseLengkap;
              const isHighAch = overallPercent >= 100;
              const isMediumAch = overallPercent >= 75 && overallPercent < 100;

              return (
                <tr key={dist.districtId} className="hover:bg-gray-50/70 transition-colors">
                  {/* District / Salesman Info */}
                  <td className="py-3 px-4 sticky left-0 bg-white hover:bg-gray-50/70 z-10 border-r border-gray-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                    <div>
                      <div className="font-bold text-gray-900 text-xs tracking-tight">
                        {dist.districtKode}
                      </div>
                      <div className="text-[11px] text-gray-600 truncate max-w-[170px]" title={dist.karyawanName}>
                        {dist.karyawanName}
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {dist.ouKode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 6 Workday Cells */}
                  {dist.days.map((day) => {
                    const isDraft = day.status === "TERISI" && day.statusRekap === "DRAFT";
                    const isFinal = day.status === "TERISI" && day.statusRekap === "FINAL";
                    const isOff = day.status === "TIDAK_ADA_KUNJUNGAN";
                    const isEmpty = day.status === "KOSONG";

                    return (
                      <td
                        key={day.hari}
                        onClick={() => handleCellClick(dist.districtId, day.date)}
                        className="py-2.5 px-2 border-r border-gray-200 align-middle text-center cursor-pointer transition-all hover:bg-primary-50/40 relative group"
                        title={`Klik untuk buka callsheet ${dist.districtKode} (${day.namaHari}, ${day.date})`}
                      >
                        {/* Hover subtle open action hint */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={11} className="text-primary-600" />
                        </div>

                        {/* FINAL Cell */}
                        {isFinal && (
                          <div className="bg-emerald-50/80 hover:bg-emerald-50 border border-emerald-200 rounded-lg p-2 transition-all">
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded">
                                <CheckCircle2 size={10} className="text-emerald-700" />
                                FINAL
                              </span>
                              <span className="text-[10px] font-bold text-emerald-900">
                                {Number(day.volumeGg || 0).toLocaleString("id-ID")} Pk
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-0.5 text-[10px] bg-white/70 rounded py-1 px-1 border border-emerald-100">
                              <div title="Callmade (Kunjungan)">
                                <span className="text-[9px] text-gray-500 block">CM</span>
                                <span className="font-extrabold text-gray-800">{day.jumlahKunjungan}</span>
                              </div>
                              <div title="Brand Distribution Outlet">
                                <span className="text-[9px] text-gray-500 block">BD</span>
                                <span className="font-extrabold text-gray-800">{day.bdOutlet}</span>
                              </div>
                              <div title="Effective Call">
                                <span className="text-[9px] text-gray-500 block">EC</span>
                                <span className="font-extrabold text-gray-800">{day.totalEc}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DRAFT Cell */}
                        {isDraft && (
                          <div className="bg-amber-50/80 hover:bg-amber-50 border border-amber-300 rounded-lg p-2 transition-all">
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded">
                                <Clock size={10} className="text-amber-700" />
                                DRAFT
                              </span>
                              <span className="text-[10px] font-bold text-amber-900">
                                {Number(day.volumeGg || 0).toLocaleString("id-ID")} Pk
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-0.5 text-[10px] bg-white/70 rounded py-1 px-1 border border-amber-200">
                              <div title="Callmade (Kunjungan)">
                                <span className="text-[9px] text-gray-500 block">CM</span>
                                <span className="font-extrabold text-gray-800">{day.jumlahKunjungan}</span>
                              </div>
                              <div title="Brand Distribution Outlet">
                                <span className="text-[9px] text-gray-500 block">BD</span>
                                <span className="font-extrabold text-gray-800">{day.bdOutlet}</span>
                              </div>
                              <div title="Effective Call">
                                <span className="text-[9px] text-gray-500 block">EC</span>
                                <span className="font-extrabold text-gray-800">{day.totalEc}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TIDAK ADA KUNJUNGAN / LIBUR Cell */}
                        {isOff && (
                          <div className="bg-gray-100/80 hover:bg-gray-100 border border-gray-200 rounded-lg p-2.5 transition-all">
                            <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded">
                              <CalendarX size={11} className="text-gray-500" />
                              Tidak Ada Kunjungan
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1 truncate" title={day.alasan || "Izin / Libur"}>
                              {day.alasan || "Izin / Libur"}
                            </div>
                          </div>
                        )}

                        {/* KOSONG Cell */}
                        {isEmpty && (
                          <div className="border border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50/70 rounded-lg p-2.5 transition-all flex flex-col items-center justify-center min-h-[64px]">
                            <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                              <PlusCircle size={12} />
                              Kosong
                            </span>
                            <span className="text-[9px] text-rose-500/80 mt-0.5">
                              Klik untuk input
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Weekly Achievement (Target vs Actual) & Completion */}
                  <td className="py-2.5 px-3 text-center min-w-[170px]">
                    {/* Main Overall Achievement Badge */}
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-black rounded-md border shadow-xs ${
                          isHighAch
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : isMediumAch
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }`}
                        title={
                          ach
                            ? `Pencapaian Minggu (Rata-rata Capped Standar Industri): ${overallPercent}%\n` +
                              `• Kunjungan (CM): ${ach.actual.kunjungan} / ${ach.target.kunjungan} (${ach.percent.kunjungan}%)\n` +
                              `• Effective Call (EC): ${ach.actual.ec} / ${ach.target.ec} (${ach.percent.ec}%)\n` +
                              `• BD Outlet: ${ach.actual.bd} / ${ach.target.bd} (${ach.percent.bd}%)\n` +
                              `• Volume GG: ${ach.actual.volume} / ${ach.target.volume || "-"} Pk (${ach.percent.volume}%)`
                            : undefined
                        }
                      >
                        {overallPercent}%
                      </span>
                    </div>

                    {/* Mini Visual Bar */}
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mx-auto mt-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isHighAch ? "bg-emerald-500" : isMediumAch ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, overallPercent)}%` }}
                      />
                    </div>

                    {/* 2x2 Sub-metrics Pills for 4 KPIs */}
                    {ach ? (
                      <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                        <div
                          className={`px-1 py-0.5 rounded border font-medium truncate cursor-help ${getKpiPillColor(
                            ach.percent.kunjungan
                          )}`}
                          title={`Kunjungan (CM): Realisasi ${ach.actual.kunjungan} dari Target ${ach.target.kunjungan} (${ach.percent.kunjungan}%)`}
                        >
                          CM: <span className="font-bold">{ach.percent.kunjungan}%</span>
                        </div>
                        <div
                          className={`px-1 py-0.5 rounded border font-medium truncate cursor-help ${getKpiPillColor(
                            ach.percent.ec
                          )}`}
                          title={`Effective Call (EC): Realisasi ${ach.actual.ec} dari Target ${ach.target.ec} (${ach.percent.ec}%)`}
                        >
                          EC: <span className="font-bold">{ach.percent.ec}%</span>
                        </div>
                        <div
                          className={`px-1 py-0.5 rounded border font-medium truncate cursor-help ${getKpiPillColor(
                            ach.percent.bd
                          )}`}
                          title={`BD Outlet: Realisasi ${ach.actual.bd} dari Target ${ach.target.bd} (${ach.percent.bd}%)`}
                        >
                          BD: <span className="font-bold">{ach.percent.bd}%</span>
                        </div>
                        <div
                          className={`px-1 py-0.5 rounded border font-medium truncate cursor-help ${
                            ach.target.volume > 0
                              ? getKpiPillColor(ach.percent.volume)
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                          title={
                            ach.target.volume > 0
                              ? `Volume GG: Realisasi ${ach.actual.volume} dari Target ${ach.target.volume} Pk (${ach.percent.volume}%)`
                              : `Volume GG: Realisasi ${ach.actual.volume} Pk (Target belum diset)`
                          }
                        >
                          Vol:{" "}
                          <span className="font-bold">
                            {ach.target.volume > 0 ? `${ach.percent.volume}%` : `${ach.actual.volume} Pk`}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Subtext Keterisian Hari */}
                    <div className="text-[10px] text-gray-500 mt-1 font-medium">
                      {dist.totalHariTerisi} / 6 Hari Terisi
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Column Aggregates */}
          <tfoot>
            <tr className="bg-gray-100/90 border-t-2 border-gray-300 font-semibold text-xs text-gray-900">
              <td className="py-3 px-4 sticky left-0 bg-gray-100/95 z-10 border-r border-gray-300 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                <div className="font-extrabold text-gray-900">TOTAL ({districts.length} DISTRICT)</div>
                <div className="text-[10px] text-gray-600 font-normal">Akumulasi Harian</div>
              </td>

              {dayColumnTotals.map((tot, idx) => (
                <td key={idx} className="py-2.5 px-2 border-r border-gray-300 text-center">
                  <div className="text-[11px] font-bold text-gray-900">
                    {tot.totalVolume.toLocaleString("id-ID")} Pk
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5">
                    CM: <span className="font-semibold">{tot.totalCm}</span> · BD: <span className="font-semibold">{tot.totalBd}</span> · EC: <span className="font-semibold">{tot.totalEc}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 mt-0.5">
                    {tot.terisiCount}/{districts.length} terisi
                  </div>
                </td>
              ))}

              <td className="py-3 px-3 text-center min-w-[170px]">
                <div className="text-xs font-black text-primary-700">
                  {grandTotalSummary.avgOverallAchievement}%
                </div>
                <div className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Rata-rata Pencapaian
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">
                  {grandTotalSummary.totalTerisi} / {grandTotalSummary.totalSlot} slot terisi ({grandTotalSummary.avgPersenHari}%)
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Legend & Explanations */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-gray-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-gray-700 flex items-center gap-1">
            <Info size={13} className="text-primary-600" /> Keterangan Status:
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <strong className="text-gray-800">FINAL:</strong> Tervalidasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <strong className="text-gray-800">DRAFT:</strong> Sementara
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            <strong className="text-gray-800">TIDAK ADA KUNJUNGAN:</strong> Izin / Libur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <strong className="text-gray-800">KOSONG:</strong> Perlu Diisi
          </span>
        </div>

        <div className="text-gray-500 text-[11px]">
          <strong>CM:</strong> Callmade (Kunjungan) · <strong>BD:</strong> BD Outlet · <strong>EC:</strong> Effective Call · <strong>Vol:</strong> Volume (Pack)
        </div>
      </div>
    </div>
  );
};
