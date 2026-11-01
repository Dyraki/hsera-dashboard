import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { SkuSalesQuarterChartPoint } from '@/core/domain/models/ReportSkuSales';

interface SkuSalesQuarterChartProps {
  chartTrend: SkuSalesQuarterChartPoint[];
  avgWeeklyVolume: number;
}

export const SkuSalesQuarterChart: React.FC<SkuSalesQuarterChartProps> = ({
  chartTrend,
  avgWeeklyVolume,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const maxVolume = Math.max(100, avgWeeklyVolume * 1.5, ...chartTrend.map((p) => p.totalVolume));

  const chartHeight = 160;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 24;

  const barWidth = Math.max(18, Math.min(48, (chartWidth - paddingX * 2) / (chartTrend.length * 1.6)));

  const getBarX = (idx: number) => {
    const totalBars = chartTrend.length;
    if (totalBars <= 1) return chartWidth / 2 - barWidth / 2;
    const step = (chartWidth - paddingX * 2) / totalBars;
    return paddingX + idx * step + (step - barWidth) / 2;
  };

  const getBarHeight = (vol: number) => {
    const usableHeight = chartHeight - paddingY * 2;
    return (vol / maxVolume) * usableHeight;
  };

  const avgLineY = chartHeight - paddingY - (avgWeeklyVolume / maxVolume) * (chartHeight - paddingY * 2);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Grafik Penjualan SKU dalam 1 Kuartal
            </h3>
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              Satuan: Pack
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Pergerakan volume penjualan per minggu dalam siklus kuartal terpilih (Highlight pada Minggu Berjalan).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block shadow-2xs" />
            <span>Minggu Berjalan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
            <span>Siklus Selesai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 inline-block" />
            <span className="text-[11px] text-amber-700">Rata-rata Kuartal ({formatNumber(Math.round(avgWeeklyVolume))} pk)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 select-none"
          preserveAspectRatio="none"
        >
          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
            return (
              <g key={i}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={chartWidth - paddingX + 10}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Average Benchmark Line */}
          {avgWeeklyVolume > 0 && (
            <line
              x1={paddingX - 10}
              y1={avgLineY}
              x2={chartWidth - paddingX + 10}
              y2={avgLineY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* Bars */}
          {chartTrend.map((point, idx) => {
            const x = getBarX(idx);
            const bHeight = Math.max(3, getBarHeight(point.totalVolume));
            const y = chartHeight - paddingY - bHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={point.kodeMinggu}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Bar rect */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={bHeight}
                  rx="4"
                  className={`transition-all duration-300 ${
                    point.isCurrent
                      ? 'fill-indigo-600 stroke-indigo-400 stroke-2'
                      : point.totalVolume > 0
                      ? 'fill-slate-500 hover:fill-slate-600'
                      : 'fill-slate-100 stroke-slate-300 stroke-dashed'
                  }`}
                  opacity={isHovered ? 1 : 0.9}
                />

                {/* Top volume label if non-zero */}
                {point.totalVolume > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-gray-700"
                  >
                    {formatNumber(point.totalVolume)}
                  </text>
                )}

                {/* X Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold ${
                    point.isCurrent ? 'fill-indigo-700 underline font-black' : 'fill-gray-500'
                  }`}
                >
                  {point.weekLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && chartTrend[hoveredIdx] && (
          <div
            className="absolute z-10 bg-gray-900/95 text-white text-xs rounded-lg py-2 px-3 shadow-lg pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(getBarX(hoveredIdx) + barWidth / 2) / chartWidth * 100}%`,
              top: '40%',
            }}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span>{chartTrend[hoveredIdx].weekLabel}</span>
              {chartTrend[hoveredIdx].isCurrent && (
                <span className="text-[9px] bg-indigo-500 text-white px-1.5 rounded">Berjalan</span>
              )}
            </div>
            <div className="mt-1 space-y-0.5 text-[11px] text-gray-300">
              <div>Total Penjualan: <strong className="text-white font-mono">{formatNumber(chartTrend[hoveredIdx].totalVolume)} pk</strong></div>
              <div>Total Kunjungan: <strong className="text-white font-mono">{formatNumber(chartTrend[hoveredIdx].totalCalls)} Call</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
