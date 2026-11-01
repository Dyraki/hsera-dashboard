import React, { useState, useRef } from 'react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { salesmanshipRepository } from '@/core/di/container';
import { useToast } from '@/presentation/context/ToastContext';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';

interface CallsheetImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrictId: string;
  selectedDate: string;
  districtCode?: string;
  onImportSuccess: () => void;
}

export const CallsheetImportDrawer: React.FC<CallsheetImportDrawerProps> = ({
  isOpen,
  onClose,
  selectedDistrictId,
  selectedDate,
  districtCode,
  onImportSuccess,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusRekap, setStatusRekap] = useState<'FINAL' | 'DRAFT'>('FINAL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Reset state when drawer closes
  const handleClose = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    onClose();
  };

  // 1. Download Template Handler
  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    setErrorMessage(null);
    try {
      const blob = await salesmanshipRepository.downloadCallsheetTemplate({
        districtId: selectedDistrictId || undefined,
        date: selectedDate || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const distName = districtCode || 'District';
      a.download = `Template_Callsheet_${distName}_${selectedDate || 'Rekap'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('success', 'Template callsheet (.xlsx) berhasil diunduh.');
    } catch {
      showToast('error', 'Gagal mengunduh template callsheet.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 2. File Selection & Drag-and-Drop Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.xlsx', '.xls'];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isExtensionValid) {
      setErrorMessage('Format file tidak didukung. Harap unggah file Excel (.xlsx atau .xls).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar. Maksimal ukuran file adalah 10 MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Submit Import to Backend
  const handleImportSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage('Silakan pilih atau unggah file template Excel terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const response = await salesmanshipRepository.importCallsheetExcel(
        selectedFile,
        statusRekap
      );

      showToast('success', response.message || 'Data callsheet berhasil di-import ke database!');
      onImportSuccess();
      handleClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Terjadi kesalahan saat memproses file Excel.';
      setErrorMessage(msg);
      showToast('error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Data Callsheet"
      subtitle="Unggah rekap callsheet harian menggunakan template resmi Excel (.xlsx)"
      icon={<FileSpreadsheet className="w-5 h-5 text-emerald-600" />}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Import...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4" />
                <span>Import ke Database</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-xs text-gray-700">
        {/* Step 1: Download Template Section */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">Download Template Excel</h4>
              <p className="text-gray-500 mt-0.5 leading-relaxed">
                Unduh template resmi yang telah terisi data master 15 SKU aktif dan formula hitung otomatis.
              </p>
            </div>
          </div>

          <div className="pl-11 space-y-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-800 font-semibold rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <Download className="w-4 h-4 text-emerald-600" />
              )}
              <span>
                {isDownloading ? 'Menyiapkan Template...' : 'Download Template (.xlsx)'}
              </span>
            </button>

            <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 space-y-1 text-[11px] text-gray-600">
              <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Ketentuan Format Template:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-gray-500">
                <li>Tanggal kunjungan harus hari kerja (Senin s/d Sabtu).</li>
                <li>Kode SKU pada Kolom B tidak boleh diubah atau dihapus.</li>
                <li>Kolom BD dan BPJ otomatis terhitung oleh formula bawaan Excel.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 2: Upload Template Section */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">Upload File Template Excel</h4>
              <p className="text-gray-500 mt-0.5 leading-relaxed">
                Unggah file Excel yang telah selesai diisi untuk di-import langsung ke database.
              </p>
            </div>
          </div>

          <div className="pl-11 space-y-3">
            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce-subtle" />
                <p className="font-semibold text-gray-800 text-xs">
                  Klik untuk memilih file, atau seret file ke sini
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Mendukung format .xlsx atau .xls (Maks. 10 MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-gray-900 text-xs truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      {formatFileSize(selectedFile.size)} • Siap di-import
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Hapus file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Opsi Status Simpan */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Simpan Sebagai Status:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    statusRekap === 'FINAL'
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="statusRekap"
                    value="FINAL"
                    checked={statusRekap === 'FINAL'}
                    onChange={() => setStatusRekap('FINAL')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>FINAL (Disetujui)</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    statusRekap === 'DRAFT'
                      ? 'border-amber-500 bg-amber-50/40 text-amber-950 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="statusRekap"
                    value="DRAFT"
                    checked={statusRekap === 'DRAFT'}
                    onChange={() => setStatusRekap('DRAFT')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>DRAFT (Dapat Diedit)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Gagal Import Data:</span>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Informational Guidance Box */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-indigo-900 text-[11px] leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            Data yang di-import akan langsung tersimpan ke database dan menimpa/memperbarui rekap callsheet untuk District dan Tanggal tersebut. Setelah proses import selesai, halaman form akan otomatis menyegarkan tampilan matriks.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
