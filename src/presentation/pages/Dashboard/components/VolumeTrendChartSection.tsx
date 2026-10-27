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

  // Generate branch points & paths for multi-line rendering
  const branchPaths = branches.map((b) => {
    const bPoints = weeks.map((w, idx) => getCoordinates(w.volumes[b.ouKode] || 0, idx));
    let path = '';
    if (bPoints.length === 1) {
      path = `M ${bPoints[0].x - 20} ${bPoints[0].y} L ${bPoints[0].x + 20} ${bPoints[0].y}`;
    } else if (bPoints.length > 1) {
      path = bPoints.reduce(
        (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
        ''
      );
    }
    return {
      branch: b,
      points: bPoints,
      path,
    };
  });

  // Generate Total SVG path string
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
          {branches.length > 1 && (
            <div className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-3 border-t-2 border-indigo-400 border-dashed inline-block" />
              <span>Total Konsolidasi</span>
            </div>
          )}
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
      <div className="relative mt-4 overflow-x-auto pb-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Memuat grafik tren...
          </div>
        ) : weeks.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Belum ada transaksi callsheet pada kuartal yang dipilih.
          </div>
        ) : (
          <div className="min-w-[620px] relative pt-1 pb-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
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

              {/* Area Gradient (Total Area Volume) */}
              {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

              {/* Total Volume dashed line if multi-branch */}
              {linePath && branches.length > 1 && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  opacity="0.85"
                />
              )}

              {/* Individual Branch Trend Lines */}
              {branchPaths.map(({ branch, path }) =>
                path ? (
                  <path
                    key={branch.ouKode}
                    d={path}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null
              )}

              {/* Data Points and Column Highlights */}
              {weeks.map((weekData, idx) => {
                const pt = points[idx];
                const isHovered = hoveredIdx === idx;
                const isSelected =
                  selectedWeek !== undefined && selectedWeek > 0
                    ? weekData.kodeMinggu === selectedWeek
                    : selectedWeek === 0
                    ? false
                    : weekData.weekLabel.includes('Aktif');

                return (
                  <g key={idx}>
                    {/* Selected Week Indicator Line */}
                    {isSelected && (
                      <line
                        x1={pt.x}
                        y1={paddingY - 5}
                        x2={pt.x}
                        y2={chartHeight - paddingY}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                        opacity="0.7"
                      />
                    )}

                    {/* Branch Data Point Circles */}
                    {branchPaths.map(({ branch, points: bPts }) => {
                      const bPt = bPts[idx];
                      if (!bPt) return null;
                      return (
                        <g key={branch.ouKode}>
                          {isSelected && (
                            <circle
                              cx={bPt.x}
                              cy={bPt.y}
                              r="8"
                              fill="none"
                              stroke={branch.color}
                              strokeWidth="2"
                              opacity="0.4"
                              className="animate-pulse"
                            />
                          )}
                          <circle
                            cx={bPt.x}
                            cy={bPt.y}
                            r={isSelected || isHovered ? '5' : '3.5'}
                            fill={isSelected ? branch.color : '#ffffff'}
                            stroke={branch.color}
                            strokeWidth="2"
                            className="transition-all"
                          />
                        </g>
                      );
                    })}

                    {/* Total Dot if multi-branch */}
                    {branches.length > 1 && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '4' : '2.5'}
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                    )}

                    {/* Full Column Hover & Click Trigger */}
                    <rect
                      x={pt.x - 24}
                      y={0}
                      width={48}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => onSelectWeek && onSelectWeek(weekData.kodeMinggu)}
                    />

                    {/* X Axis Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? '#059669' : '#64748b'}
                      fontWeight={isSelected ? '700' : '500'}
                      className="pointer-events-none select-none"
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
                className="absolute bg-slate-900/95 backdrop-blur-xs text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700/80 pointer-events-none z-30 transition-all duration-150 min-w-[210px] whitespace-nowrap"
                style={{
                  left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredIdx].y / chartHeight) * 100}%`,
                  transform: `translate(${
                    hoveredIdx >= weeks.length - 2 ? '-92%' : hoveredIdx === 0 ? '-8%' : '-50%'
                  }, ${points[hoveredIdx].y < 110 ? '16px' : '-115%'})`,
                }}
              >
                <div className="font-bold text-[11px] text-slate-200 border-b border-slate-700/80 pb-1.5 mb-2 flex items-center justify-between">
                  <span>Minggu {weeks[hoveredIdx].weekLabel}</span>
                  {weeks[hoveredIdx].kodeMinggu === selectedWeek && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-normal">
                      Terpilih
                    </span>
                  )}
                </div>

                {/* Per Branch Breakdown */}
                {branches.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {branches.map((b) => {
                      const bVol = weeks[hoveredIdx].volumes[b.ouKode] || 0;
                      return (
                        <div key={b.ouKode} className="flex items-center justify-between gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                            {b.namaCabang}:
                          </span>
                          <span className="font-mono font-semibold" style={{ color: b.color }}>
                            {formatNumber(bVol)} Pack
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total Volume */}
                <div className="border-t border-slate-700/80 pt-1.5 space-y-0.5">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-slate-400">Total Volume:</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {formatNumber(weeks[hoveredIdx].totalVolume)} Pack
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400">
                    <span>Setara:</span>
                    <span className="font-mono">
                      {(weeks[hoveredIdx].totalVolume / 800).toFixed(2)} Karton
                    </span>
                  </div>
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
