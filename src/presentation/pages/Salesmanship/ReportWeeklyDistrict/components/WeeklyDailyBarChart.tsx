import React from 'react';
import { WeeklyDistrictReportResponse } from '@/core/domain/models/ReportWeeklyDistrict';
import { BarChart3 } from 'lucide-react';

interface WeeklyDailyBarChartProps {
  dailyTrend: WeeklyDistrictReportResponse['dailyTrend'];
}

export const WeeklyDailyBarChart: React.FC<WeeklyDailyBarChartProps> = ({ dailyTrend }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Kunjungan Harian vs Target
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Perbandingan realisasi kunjungan ritase harian terhadap target (Senin s/d Sabtu)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border-2 border-dashed border-gray-400 bg-gray-50 inline-block" />
            <span>Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-primary-600 inline-block shadow-2xs" />
            <span className="font-semibold text-gray-900">Realisasi</span>
          </div>
        </div>
      </div>

      {/* 6 Days Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {dailyTrend.map((day) => {
          const isFull = day.percent >= 100;
          const isGood = day.percent >= 75;

          return (
            <div
              key={day.hari}
              className="bg-gray-50/70 border border-gray-200 rounded-xl p-3.5 flex flex-col items-center justify-between hover:border-primary-300 transition-colors group"
            >
              {/* Day Header */}
              <div className="text-center w-full pb-2 border-b border-gray-200/60">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  {day.namaHari}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {day.date.split('-').slice(1).join('/')}
                </div>
              </div>

              {/* Bar Container */}
              <div className="py-4 w-full flex flex-col items-center justify-center">
                <div className="relative w-16 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg p-1 flex flex-col justify-end overflow-hidden shadow-2xs">
                  {/* Fill Bar */}
                  <div
                    className={`w-full rounded transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white font-mono shadow-2xs ${
                      isFull
                        ? 'bg-emerald-600'
                        : isGood
                        ? 'bg-primary-600'
                        : 'bg-amber-600'
                    }`}
                    style={{ height: `${Math.max(15, Math.min(100, day.percent))}%` }}
                  >
                    <span>{day.percent}%</span>
                  </div>
                </div>
              </div>

              {/* Calls ratio bottom */}
              <div className="text-center w-full pt-1.5 border-t border-gray-200/60">
                <span className="text-xs font-bold font-mono text-gray-900">
                  {day.actual}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  /{day.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
