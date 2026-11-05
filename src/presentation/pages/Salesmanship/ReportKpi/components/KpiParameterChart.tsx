import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { KpiWeeklyDataPoint, KpiParameterMetric } from '@/core/domain/models/ReportKpi';

interface KpiParameterChartProps {
  title: string;
  subtitle: string;
  unit: string;
  icon: LucideIcon;
  colorTheme?: 'indigo' | 'emerald' | 'purple' | 'amber';
  weeks: KpiWeeklyDataPoint[];
  getMetric: (w: KpiWeeklyDataPoint) => KpiParameterMetric;
  selectedWeek?: number | 'all';
  onSelectWeek?: (kodeMinggu: number) => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

export const KpiParameterChart: React.FC<KpiParameterChartProps> = ({
  title,
  subtitle,
  unit,
  icon: Icon,
  weeks,
  getMetric,
  selectedWeek,
  onSelectWeek,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (weeks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-center h-64 text-gray-400 text-xs">
        Tidak ada data minggu untuk kuartal / siklus ini.
      </div>
    );
  }

  // Calculate scales
  const metrics = weeks.map((w) => getMetric(w));
  const maxReal = Math.max(...metrics.map((m) => m.realisasi), 0);
  const maxTarget = Math.max(...metrics.map((m) => m.target), 0);
  const maxValue = Math.max(10, Math.max(maxReal, maxTarget) * 1.15);

  const chartHeight = 200;
  const chartWidth = 620;
  const paddingX = 40;
  const paddingY = 30;
  const usableHeight = chartHeight - paddingY * 2;
  const totalWeeks = weeks.length;
  const stepX = (chartWidth - paddingX * 2) / Math.max(1, totalWeeks);
  const barWidth = Math.max(16, Math.min(36, stepX * 0.55));

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxValue) * usableHeight;
  };

  const getBarColor = (m: KpiParameterMetric, isSelected: boolean) => {
    if (m.achievementPercent >= 100) {
      return isSelected ? '#047857' : '#10b981'; // emerald
    }
    if (m.achievementPercent >= 85) {
      return isSelected ? '#4338ca' : '#6366f1'; // indigo
    }
    if (m.achievementPercent >= 70) {
      return isSelected ? '#d97706' : '#f59e0b'; // amber
    }
    return isSelected ? '#be123c' : '#f43f5e'; // rose
  };

  // Target line path
  const targetPoints = weeks.map((w, idx) => {
    const x = paddingX + idx * stepX + stepX / 2;
    const y = getY(getMetric(w).target);
    return { x, y };
  });

  const targetPath = targetPoints.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              {title}
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {unit}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
            <span className="text-[11px]">Realisasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" />
            <span className="text-[11px] font-medium text-rose-700">Target</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto select-none py-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
          style={{ minWidth: `${Math.max(380, totalWeeks * 40)}px` }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const val = maxValue * pct;
            const y = getY(val);
            return (
              <g key={pct}>
                <line
                  x1={paddingX - 6}
                  y1={y}
                  x2={chartWidth - paddingX + 6}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={pct === 0 ? undefined : '2,2'}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontWeight="500"
                >
                  {formatNumber(Math.round(val))}
                </text>
              </g>
            );
          })}

          {/* Target line (Dashed) */}
          <path
            d={targetPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="4,3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Target Points */}
          {targetPoints.map((pt, idx) => (
            <circle
              key={`target-pt-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#ffffff"
              stroke="#f43f5e"
              strokeWidth="2"
            />
          ))}

          {/* Bars for Realisasi */}
          {weeks.map((w, idx) => {
            const m = getMetric(w);
            const x = paddingX + idx * stepX + (stepX - barWidth) / 2;
            const barH = Math.max(2, (m.realisasi / maxValue) * usableHeight);
            const y = chartHeight - paddingY - barH;
            const isHovered = hoveredIdx === idx;
            const isSelected = selectedWeek === w.kodeMinggu;
            const barColor = getBarColor(m, isSelected);

            return (
              <g
                key={w.kodeMinggu}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectWeek && onSelectWeek(w.kodeMinggu)}
              >
                {/* Background highlight pill on hover/select */}
                {(isHovered || isSelected) && (
                  <rect
                    x={paddingX + idx * stepX + 2}
                    y={paddingY - 10}
                    width={stepX - 4}
                    height={usableHeight + 20}
                    rx="6"
                    fill={isSelected ? '#e0e7ff' : '#f8fafc'}
                    opacity={isSelected ? '0.45' : '0.8'}
                  />
                )}

                {/* Realisasi Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="4"
                  fill={barColor}
                  className="transition-all duration-300"
                  opacity={isHovered ? 1 : 0.9}
                  stroke={isSelected ? '#1e1b4b' : isHovered ? '#374151' : 'none'}
                  strokeWidth={isSelected ? '2' : isHovered ? '1.5' : '0'}
                />

                {/* % Achievement Tag on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={m.achievementPercent >= 100 ? '#059669' : m.achievementPercent < 70 ? '#e11d48' : '#334155'}
                >
                  {m.achievementPercent}%
                </text>

                {/* X-axis week label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - paddingY + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={w.isCurrent || isSelected ? '700' : '600'}
                  fill={w.isCurrent ? '#4f46e5' : isSelected ? '#111827' : '#64748b'}
                >
                  W{w.weekNumber}
                </text>

                {/* Subtext: Current Week marker */}
                {w.isCurrent && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={chartHeight - paddingY + 24}
                    r="2"
                    fill="#4f46e5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && weeks[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none bg-gray-900 text-white rounded-lg p-2.5 shadow-xl text-xs border border-gray-700 animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${Math.min(
                80,
                Math.max(10, ((hoveredIdx + 0.5) / totalWeeks) * 100)
              )}%`,
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-gray-200 flex items-center justify-between gap-3 border-b border-gray-700 pb-1 mb-1.5">
              <span>{weeks[hoveredIdx].weekLabel}</span>
              <span className="text-[10px] text-gray-400">
                {weeks[hoveredIdx].startDate} s/d {weeks[hoveredIdx].endDate}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Target:</span>
                <span className="font-semibold text-rose-300">
                  {formatNumber(getMetric(weeks[hoveredIdx]).target)} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Realisasi:</span>
                <span className="font-bold text-emerald-300">
                  {formatNumber(getMetric(weeks[hoveredIdx]).realisasi)} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Gap:</span>
                <span
                  className={`font-semibold ${
                    getMetric(weeks[hoveredIdx]).gap >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {getMetric(weeks[hoveredIdx]).gap >= 0 ? '+' : ''}
                  {formatNumber(getMetric(weeks[hoveredIdx]).gap)} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-800">
                <span className="text-gray-400">Capaian:</span>
                <span className="font-extrabold text-amber-300">
                  {getMetric(weeks[hoveredIdx]).achievementPercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Klik batang minggu untuk memfilter/menyorot</span>
        <span className="font-medium text-gray-500">
          Tertinggi: W{weeks.reduce((prev, curr) => (getMetric(curr).realisasi > getMetric(prev).realisasi ? curr : prev), weeks[0]).weekNumber}
        </span>
      </div>
    </div>
  );
};
