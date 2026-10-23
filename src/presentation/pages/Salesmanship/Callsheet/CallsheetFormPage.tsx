import React, { useState } from "react";
import { AdminLayout } from "@/presentation/components/layout/AdminLayout";
import { useCallsheetForm } from "./hooks/useCallsheetForm";
import { CallsheetHeaderFilter } from "./components/CallsheetHeaderFilter";
import { CallsheetKpiCards } from "./components/CallsheetKpiCards";
import { CallsheetMatrixTable } from "./components/CallsheetMatrixTable";
import { CallsheetActionFooter } from "./components/CallsheetActionFooter";
import { useToast } from "@/presentation/context/ToastContext";
import { ClipboardList, MessageSquare, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

// WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const CallsheetFormPage: React.FC = () => {
  const { showToast } = useToast();
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState<boolean>(false);

  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDate,
    setSelectedDate,
    formSkeleton,
    isLoading,
    isSubmitting,
    formError,
    jenisRekap,
    setJenisRekap,
    alasan,
    setAlasan,
    jumlahKunjungan,
    setJumlahKunjungan,
    totalEc,
    setTotalEc,
    bdOutlet,
    setBdOutlet,
    catatan,
    setCatatan,
    statusRekap,
    rekapId,
    matrix,
    handleCellChange,
    rowValidations,
    columnTotals,
    handleSaveDraft,
    handleFinalize,
    refreshData,
  } = useCallsheetForm();

  const isFormDisabled =
    formSkeleton?.isLocked || (formSkeleton != null && !formSkeleton.isWorkday) || isSubmitting;

  // Generate Pesan WhatsApp sesuai format standar
  const generateWhatsAppMessage = () => {
    if (!formSkeleton) return "";

    const dateDisplay = formatDateDisplay(selectedDate);
    const hari = formSkeleton.namaHari || "-";
    const salesmanName = formSkeleton.district?.karyawanName || "-";
    const districtKode = formSkeleton.district?.kode || "-";
    const channelDisplay =
      formSkeleton.district?.channels && formSkeleton.district.channels.length > 0
        ? formSkeleton.district.channels.map((c) => c.nama).join(", ")
        : "";

    // Daftar penjualan per brand
    const salesLines = formSkeleton.brands
      .map((b) => {
        const buyQty = matrix[b.id]?.["BUY"] || 0;
        return `- ${b.nama} : ${buyQty}`;
      })
      .join("\n");

    const totalSales = columnTotals.buy;
    const callMade = jenisRekap === "NORMAL" ? jumlahKunjungan : 0;
    const ecOutletVal = jenisRekap === "NORMAL" ? totalEc : 0;

    // EC SKU : diisi jika pada brand ada buy maka dihitung 1
    const ecSku = formSkeleton.brands.filter(
      (b) => (matrix[b.id]?.["BUY"] || 0) > 0
    ).length;

    const bdOutletVal = jenisRekap === "NORMAL" ? bdOutlet : 0;
    const typeKunjungan = jenisRekap;

    return `Tanggal : ${dateDisplay}
Hari : ${hari}
Nama Salesman : ${salesmanName}
Area Kunjungan : 
Kecamatan : 
District : ${districtKode}
Channel : ${channelDisplay}
PENJUALAN
${salesLines}

Total Sales : ${totalSales}
Call Made : ${callMade}
EC Outlet : ${ecOutletVal}
EC SKU : ${ecSku}
BD Outlet : ${bdOutletVal}
NOO outlet : 
Type Kunjungan : ${typeKunjungan}`;
  };

  // Trigger buka WhatsApp & salin clipboard
  const triggerOpenWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    if (!msg) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }

    showToast("success", "Teks laporan Callsheet berhasil disalin! Membuka WhatsApp...");

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  // Handler klik tombol Share WhatsApp dengan validasi kondisi data
  const handleShareWhatsAppClick = () => {
    if (!formSkeleton) return;

    // 1. Verifikasi jika data pada hari itu belum dikerjakan / belum diinput
    const isDataEmpty =
      jenisRekap === "NORMAL" &&
      jumlahKunjungan === 0 &&
      totalEc === 0 &&
      columnTotals.buy === 0;

    if (isDataEmpty) {
      showToast(
        "error",
        "Data pada hari ini belum diinput! Silakan masukkan data kunjungan dan penjualan terlebih dahulu sebelum membagikan ke WhatsApp."
      );
      return;
    }

    // 2. Verifikasi jika data sudah diisi di layar namun belum pernah disimpan ke database
    if (!rekapId) {
      setIsUnsavedModalOpen(true);
      return;
    }

    // 3. Jika sudah tersimpan, langsung bagikan
    triggerOpenWhatsApp();
  };

  // Handler Simpan Draft lalu Bagikan
  const handleSaveAndShare = async () => {
    const success = await handleSaveDraft();
    if (success) {
      setIsUnsavedModalOpen(false);
      triggerOpenWhatsApp();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
              <ClipboardList className="text-primary-600" size={26} />
              Form Callsheet Harian
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Input dan validasi rekap transaksi kunjungan salesman per teritori distribusi.
            </p>
          </div>

          {/* Right Action: Share WhatsApp */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShareWhatsAppClick}
              disabled={isLoading || !formSkeleton}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Bagikan laporan Callsheet ke WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Share ke WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Modal Konfirmasi Data Belum Disimpan */}
        {isUnsavedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Data Belum Disimpan
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Data callsheet untuk tanggal ini sudah diinput tetapi belum disimpan ke database. Apakah Anda ingin menyimpan draft terlebih dahulu sebelum membagikan ke WhatsApp?
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSaveAndShare}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Simpan Draft & Bagikan ke WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUnsavedModalOpen(false);
                    triggerOpenWhatsApp();
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tetap Bagikan Sekarang (Tanpa Simpan)
                </button>

                <button
                  type="button"
                  onClick={() => setIsUnsavedModalOpen(false)}
                  className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Filters & Header */}
        <CallsheetHeaderFilter
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          formSkeleton={formSkeleton}
          jenisRekap={jenisRekap}
          onChangeJenisRekap={setJenisRekap}
          alasan={alasan}
          onChangeAlasan={setAlasan}
          statusRekap={statusRekap}
          rekapId={rekapId}
          disabled={isSubmitting}
        />

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl shadow-xs">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-800">Memuat data callsheet...</p>
            <p className="text-xs text-gray-500 mt-1">
              Mengambil skeleton brand, target, dan matriks harian.
            </p>
          </div>
        ) : formError ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center shadow-xs">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-900">Gagal Memuat Callsheet</h3>
            <p className="text-xs text-rose-700 mt-1">{formError}</p>
            <button
              type="button"
              onClick={refreshData}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              Coba Lagi
            </button>
          </div>
        ) : formSkeleton ? (
          <>
            {/* Conditional Rendering: Normal Berjalan vs Tidak Ada Kunjungan */}
            {jenisRekap === "NORMAL" ? (
              <>
                {/* Summary KPI Target vs Realisasi */}
                <CallsheetKpiCards
                  targets={formSkeleton.targets}
                  jumlahKunjungan={jumlahKunjungan}
                  onChangeJumlahKunjungan={setJumlahKunjungan}
                  bdOutlet={bdOutlet}
                  onChangeBdOutlet={setBdOutlet}
                  totalEc={totalEc}
                  onChangeTotalEc={setTotalEc}
                  volumeGg={columnTotals.buy}
                  disabled={isFormDisabled}
                />

                {/* Matriks Distribusi 15 Brand */}
                <CallsheetMatrixTable
                  brands={formSkeleton.brands}
                  matrix={matrix}
                  onCellChange={handleCellChange}
                  rowValidations={rowValidations}
                  columnTotals={columnTotals}
                  jumlahKunjungan={jumlahKunjungan}
                  disabled={isFormDisabled}
                />
              </>
            ) : (
              /* Mode Tidak Ada Kunjungan Banner */
              <div className="p-8 bg-white border border-gray-200 rounded-xl text-center space-y-2 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto font-bold text-lg">
                  ✕
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Mode Pelaporan: Tidak Ada Kunjungan
                </h3>
                <p className="text-xs text-gray-600 max-w-lg mx-auto">
                  Kunjungan diset 0 dan seluruh sel matriks dinonaktifkan. Pastikan alasan di atas
                  telah terisi dengan jelas sebelum menyimpan.
                </p>
              </div>
            )}

            {/* Catatan Tambahan (Opsional) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                Catatan Rekap Harian (Opsional)
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                disabled={isFormDisabled}
                placeholder="Tambahkan catatan khusus untuk rekap hari ini jika ada..."
                className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg px-3.5 py-2 text-gray-900 text-xs transition-colors shadow-xs"
              />
            </div>

            {/* Action Footer */}
            <CallsheetActionFooter
              onSaveDraft={handleSaveDraft}
              onFinalize={handleFinalize}
              onCancel={refreshData}
              isSubmitting={isSubmitting}
              disabled={isFormDisabled}
            />
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default CallsheetFormPage;
