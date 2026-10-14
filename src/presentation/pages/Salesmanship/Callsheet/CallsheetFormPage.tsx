import React from "react";
import { AdminLayout } from "@/presentation/components/layout/AdminLayout";
import { useCallsheetForm } from "./hooks/useCallsheetForm";
import { CallsheetHeaderFilter } from "./components/CallsheetHeaderFilter";
import { CallsheetKpiCards } from "./components/CallsheetKpiCards";
import { CallsheetMatrixTable } from "./components/CallsheetMatrixTable";
import { CallsheetActionFooter } from "./components/CallsheetActionFooter";
import { ClipboardList, MessageSquare, Loader2, AlertTriangle } from "lucide-react";

export const CallsheetFormPage: React.FC = () => {
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
        </div>

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
