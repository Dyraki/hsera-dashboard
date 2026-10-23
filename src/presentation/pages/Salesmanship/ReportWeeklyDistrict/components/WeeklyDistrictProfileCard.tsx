import React from 'react';
import { WeeklyDistrictReportResponse } from '@/core/domain/models/ReportWeeklyDistrict';
import { UserCheck, MapPin, Calendar, Clock, ShieldCheck, Database } from 'lucide-react';

interface WeeklyDistrictProfileCardProps {
  header: WeeklyDistrictReportResponse['header'];
}

export const WeeklyDistrictProfileCard: React.FC<WeeklyDistrictProfileCardProps> = ({ header }) => {
  const { district, kodeMingguDisplay, startDate, endDate } = header;

  const formatDateLabel = (isoDate?: string | null): string => {
    if (!isoDate) return '-';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Salesman & District Identity */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shrink-0 shadow-xs font-bold text-lg">
          <UserCheck className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight">
              {district.karyawanNama}
            </h2>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              {district.karyawanId}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TERVERIFIKASI SISTEM</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 font-medium text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              District {district.kode} ({district.ouKode})
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-primary-600" />
              W-{kodeMingguDisplay} ({startDate} s/d {endDate})
            </span>
            {district.lastSync && (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Sinkronisasi: {formatDateLabel(district.lastSync)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Audit Tag */}
      <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 shadow-2xs">
          <Database className="w-3.5 h-3.5 text-primary-600" />
          <span>INSPEKSI AUDIT RIS (READ ONLY)</span>
        </span>
      </div>
    </div>
  );
};
