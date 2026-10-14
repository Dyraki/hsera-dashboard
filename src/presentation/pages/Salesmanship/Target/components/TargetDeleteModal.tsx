import React from 'react';
import { Target } from '@/core/domain/models/Target';
import { Button } from '@/presentation/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { getHariLabel } from '../types';

interface TargetDeleteModalProps {
  isOpen: boolean;
  target: Target | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TargetDeleteModal: React.FC<TargetDeleteModalProps> = ({
  isOpen,
  target,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-error-100 text-error-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Konfirmasi Hapus Target</h3>
            <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Apakah Anda yakin ingin menghapus konfigurasi target{' '}
          <strong className="text-gray-900 font-bold">
            {target.jenisTarget}
          </strong>{' '}
          dengan nilai nominal{' '}
          <strong className="font-mono text-gray-950 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            {target.nilai}
          </strong>{' '}
          ({target.districtKode ? `District: ${target.districtKode}` : 'Global'}, Hari: {getHariLabel(target.hariKunjungan)})?
        </p>

        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Perhatian:</strong> Penghapusan target dapat mempengaruhi perhitungan evaluasi capaian vs target pada callsheet yang menggunakan tanggal target ini.
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-error-600 hover:bg-error-700 text-white"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Menghapus...
              </span>
            ) : (
              'Ya, Hapus Target'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
