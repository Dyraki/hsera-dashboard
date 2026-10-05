import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Mail, MapPin, Pencil, Phone, Trash2, Users } from 'lucide-react';
import { Karyawan } from '../../../../../core/domain/models/Karyawan';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';

interface KaryawanTableProps {
  employees: Karyawan[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  getUnitTypeBadge: (type?: string) => React.ReactNode;
  onCreate: () => void;
  onOpenDetail: (employee: Karyawan) => void;
  onEdit: (employee: Karyawan) => void;
  onDelete: (employee: Karyawan) => void;
  onPageChange: (page: number) => void;
}

export const KaryawanTable: React.FC<KaryawanTableProps> = ({
  employees,
  isLoading,
  page,
  totalPages,
  totalCount,
  getUnitTypeBadge,
  onCreate,
  onOpenDetail,
  onEdit,
  onDelete,
  onPageChange
}) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600 text-caption font-semibold bg-gray-50">
            <th className="py-3.5 px-4">KARYAWAN</th>
            <th className="py-3.5 px-4">IDENTITAS (NIK / NO)</th>
            <th className="py-3.5 px-4">UNIT PENEMPATAN & LINEAGE</th>
            <th className="py-3.5 px-4">ATASAN (SUPERVISOR)</th>
            <th className="py-3.5 px-4">STATUS</th>
            <th className="py-3.5 px-4 text-right">AKSI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr><td colSpan={6} className="py-12 text-center text-gray-600">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-body-sm mt-2">Memuat data karyawan...</p>
            </td></tr>
          ) : employees.length === 0 ? (
            <tr><td colSpan={6} className="py-12 text-center text-gray-600">
              <Users size={36} className="mx-auto text-gray-400" />
              <p className="text-body-sm font-medium mt-2">Tidak ada data karyawan ditemukan.</p>
              <PermissionButton menuId={SYSTEM_MENU_IDS.KARYAWAN} minLevel={2} variant="primary" size="sm" onClick={onCreate} className="mt-2">Tambah Karyawan Baru</PermissionButton>
            </td></tr>
          ) : employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-xs">
                    {employee.legalName.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-950">{employee.legalName}</div>
                    <div className="text-caption text-gray-600 flex items-center gap-2 mt-0.5">
                      {employee.email && <span className="flex items-center gap-1 truncate"><Mail size={11} className="text-gray-500" /> {employee.email}</span>}
                      {employee.phone && <span className="flex items-center gap-1 whitespace-nowrap"><Phone size={11} className="text-gray-500" /> {employee.phone}</span>}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded">{employee.employeeNumber}</span>
                  <div className="text-caption text-gray-600 font-mono">NIK: {employee.nik}</div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {getUnitTypeBadge(employee.operationUnit?.type)}
                    <span className="font-medium text-gray-900">{employee.operationUnit?.name || '-'}</span>
                  </div>
                  {employee.operationUnit?.hierarchyPath && <p className="text-[11px] text-gray-600 truncate max-w-xs flex items-center gap-1"><MapPin size={10} className="text-gray-500 shrink-0" />{employee.operationUnit.hierarchyPath}</p>}
                </div>
              </td>
              <td className="py-3.5 px-4 text-gray-700">
                {employee.supervisor ? <div><div className="font-medium text-gray-900">{employee.supervisor.legalName}</div><span className="font-mono text-[11px] text-gray-600">{employee.supervisor.employeeNumber}</span></div> : <span className="text-gray-600 italic text-xs">Pimpinan Utama / None</span>}
              </td>
              <td className="py-3.5 px-4">{employee.status ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}</td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <Button variant="ghost" size="sm" onClick={() => onOpenDetail(employee)} title="Lihat Detail 32 Kolom" className="p-1.5"><Eye size={15} /></Button>
                <PermissionButton menuId={SYSTEM_MENU_IDS.KARYAWAN} minLevel={3} variant="ghost" size="sm" onClick={() => onEdit(employee)} title="Edit Karyawan" className="p-1.5"><Pencil size={15} /></PermissionButton>
                <PermissionButton menuId={SYSTEM_MENU_IDS.KARYAWAN} minLevel={4} variant="ghost" size="sm" onClick={() => onDelete(employee)} title="Hapus Karyawan" className="p-1.5 text-error-600 hover:text-error-700 hover:bg-error-50"><Trash2 size={15} /></PermissionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {totalPages > 1 && <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 text-body-sm text-gray-600">
      <div>Menampilkan halaman <span className="text-gray-950 font-semibold">{page}</span> dari <span className="text-gray-950 font-semibold">{totalPages}</span> ({totalCount} total karyawan)</div>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-2.5 py-1 text-xs"><ChevronLeft size={14} className="mr-1" /> Sebelumnya</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-2.5 py-1 text-xs">Berikutnya <ChevronRight size={14} className="ml-1" /></Button>
      </div>
    </div>}
  </div>
);
