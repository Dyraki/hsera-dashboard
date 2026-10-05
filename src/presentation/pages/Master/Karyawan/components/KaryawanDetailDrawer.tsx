import React from 'react';
import { Pencil } from 'lucide-react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Badge } from '@/presentation/components/ui/Badge';
import { Karyawan } from '../../../../../core/domain/models/Karyawan';

interface KaryawanDetailDrawerProps {
  isOpen: boolean;
  employee: Karyawan | null;
  onClose: () => void;
  onEdit: (employee: Karyawan) => void;
}

export const KaryawanDetailDrawer: React.FC<KaryawanDetailDrawerProps> = ({ isOpen, employee, onClose, onEdit }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title={employee ? `${employee.legalName} (${employee.employeeNumber})` : 'Detail'}>
    {employee && <div className="p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg uppercase shadow-sm">{employee.legalName.substring(0, 2)}</div>
        <div>
          <h3 className="font-bold text-gray-950 text-base leading-tight">{employee.legalName}</h3>
          <span className="text-caption text-primary-700 font-mono font-medium block mt-0.5">{employee.employeeNumber} • NIK: {employee.nik}</span>
          <div className="mt-1">{employee.status ? <Badge variant="success">Karyawan Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}</div>
        </div>
      </div>

      <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg space-y-1">
        <span className="text-caption text-primary-700 font-semibold uppercase tracking-wider block">Penempatan & Silsilah Organisasi</span>
        <p className="text-body-sm text-gray-900 font-medium">{employee.operationUnit?.hierarchyPath || employee.operationUnit?.name || '-'}</p>
      </div>

      <dl className="space-y-3.5 text-body-sm">
        <DetailRow label="Jenis Kelamin" value={employee.sex} />
        <DetailRow label="Email" value={employee.email} />
        <DetailRow label="Nomor Telepon" value={employee.phone} />
        <DetailRow label="Tempat, Tanggal Lahir" value={`${employee.placeOfBirth || '-'}, ${employee.dateOfBirth?.substring(0, 10) || '-'}`} />
        <DetailRow label="Pendidikan Terakhir" value={employee.lastEducation} />
        <DetailRow label="Atasan Langsung" value={employee.supervisor ? `${employee.supervisor.legalName} (${employee.supervisor.employeeNumber})` : 'Pimpinan Tertinggi'} />
        <DetailRow label="Rekening Bank" value={employee.accountNumber ? `${employee.accountNumber} a/n ${employee.accountName}` : '-'} />
      </dl>

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <PermissionButton menuId={SYSTEM_MENU_IDS.KARYAWAN} minLevel={3} variant="secondary" onClick={() => onEdit(employee)}><Pencil size={15} className="mr-1.5" /> Edit Karyawan Ini</PermissionButton>
      </div>
    </div>}
  </SlideOver>
);

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 pb-2.5 border-b border-gray-200">
    <dt className="text-gray-600">{label}</dt>
    <dd className="text-gray-900 text-right">{value || '-'}</dd>
  </div>
);
