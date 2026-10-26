import React, { useState } from 'react';
import { TrendingUp, Award, AlertTriangle, Activity, MousePointerClick } from 'lucide-react';
import { DashboardTrendSection } from '@/core/domain/models/Dashboard';

interface VolumeTrendChartSectionProps {
  trendSection?: DashboardTrendSection;
  selectedWeek?: number;
  loading?: boolean;
  onSelectWeek?: (w: number) => void;
}

export const VolumeTrendChartSection: React.FC<VolumeTrendChartSectionProps> = React.memo(({
  trendSection,
  selectedWeek,
  loading,
  onSelectWeek,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const weeks = trendSection?.weeks || [];
  const branches = trendSection?.branches || [];
  const insights = trendSection?.insights;

  // Chart dimensions & scaling
  const chartHeight = 180;
  const chartWidth = 720;
  const paddingX = 50;
  const paddingY = 25;

  const maxVolume = Math.max(100, ...weeks.map((w) => w.totalVolume));

  const getCoordinates = (vol: number, idx: number) => {
    const totalPoints = Math.max(1, weeks.length);
    const x =
      totalPoints === 1
        ? chartWidth / 2
        : paddingX + (idx / (totalPoints - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight - paddingY - (vol / maxVolume) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = weeks.map((w, idx) => getCoordinates(w.totalVolume, idx));

  // Generate SVG path string
  let linePath = '';
  let areaPath = '';
  if (points.length === 1) {
    linePath = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`;
    areaPath = `M ${points[0].x - 20} ${chartHeight - paddingY} L ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y} L ${points[0].x + 20} ${chartHeight - paddingY} Z`;
  } else if (points.length > 1) {
    linePath = points.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
    const first = points[0];
    const last = points[points.length - 1];
    areaPath = `${linePath} L ${last.x} ${chartHeight - paddingY} L ${first.x} ${chartHeight - paddingY} Z`;
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {trendSection?.title || 'Tren Volume Penjualan per Cabang'}
            </h2>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              Run-Rate: {trendSection?.runRateDoD || '+4.2% DoD'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {trendSection?.subtitle || 'Pergerakan tren mingguan cabang aktif di bawah Kantor Area Office (Satuan: Pack)'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {branches.map((b) => (
            <div key={b.ouKode} className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.color }} />
              <span>{b.namaCabang}</span>
            </div>
          ))}
          <span className="text-[11px] text-slate-400 font-mono">(1 Karton = 800 Pack)</span>
          {onSelectWeek && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <MousePointerClick size={12} />
              Klik titik untuk evaluasi minggu
            </span>
          )}
        </div>
      </div>

      {/* Main SVG Area Chart */}
      <div className="relative mt-4 overflow-x-auto">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Memuat grafik tren...
          </div>
        ) : weeks.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Belum ada transaksi callsheet pada kuartal yang dipilih.
          </div>
        ) : (
          <div className="min-w-[600px] relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                const val = Math.round(maxVolume * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      className="font-mono"
                    >
                      {formatNumber(val)}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient */}
              {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

              {/* Trend Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                const weekData = weeks[idx];
                const isSelected =
                  selectedWeek !== undefined && selectedWeek > 0
                    ? weekData.kodeMinggu === selectedWeek
                    : selectedWeek === 0
                    ? false
                    : weekData.weekLabel.includes('Aktif');
                return (
                  <g
                    key={idx}
                    className="cursor-pointer group"
                    onClick={() => onSelectWeek && onSelectWeek(weekData.kodeMinggu)}
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        opacity="0.5"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '6' : isHovered ? '6' : '4'}
                      fill={isSelected ? '#10b981' : '#ffffff'}
                      stroke={isSelected ? '#059669' : '#4f46e5'}
                      strokeWidth="2.5"
                      className="transition-all"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                    {/* X Axis Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? '#059669' : '#64748b'}
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {weekData.weekLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Tooltip Card */}
            {hoveredIdx !== null && weeks[hoveredIdx] && points[hoveredIdx] && (
              <div
                className="absolute bg-slate-900 text-white text-xs p-2.5 rounded shadow-lg pointer-events-none z-20 transition-all duration-150"
                style={{
                  left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredIdx].y / chartHeight) * 100}%`,
                  transform: points[hoveredIdx].y < 65 ? 'translate(-50%, 14px)' : 'translate(-50%, -115%)',
                }}
              >
                <div className="font-bold text-[11px] text-slate-300 border-b border-slate-700 pb-1 mb-1">
                  Minggu {weeks[hoveredIdx].weekLabel}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Total Volume:</span>
                  <span className="font-bold text-emerald-400">
                    {formatNumber(weeks[hoveredIdx].totalVolume)} Pack
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 mt-0.5">
                  <span>Setara:</span>
                  <span>
                    {(weeks[hoveredIdx].totalVolume / 800).toFixed(2)} Karton
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Mini-Insight Callout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
        {/* Insight 1: Highest Growth */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Pertumbuhan Tertinggi
              </span>
              <span className="text-xs font-bold text-slate-800">
                {insights?.highestGrowth?.branch || 'Tulungagung'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {insights?.highestGrowth?.value || '+5.4%'}
          </span>
        </div>

        {/* Insight 2: Discipline */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Disiplin Kunjungan
              </span>
              <span className="text-xs font-bold text-slate-800">
                {insights?.discipline?.branch || 'Tulungagung'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {insights?.discipline?.value || '91.6%'}
          </span>
        </div>

        {/* Insight 3: Operational Attention */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Fokus Evaluasi
              </span>
              <span className="text-xs font-bold text-slate-800">
                {insights?.attention?.branch || 'Rayon Tertinggal'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {insights?.attention?.value || 'Disiplin Rute'}
          </span>
        </div>
      </div>
    </div>
  );
});
