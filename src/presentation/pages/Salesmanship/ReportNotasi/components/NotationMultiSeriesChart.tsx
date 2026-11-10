import React, { useState } from 'react';
import { LucideIcon, Info } from 'lucide-react';
import { NotationDataPoint } from '@/core/domain/models/ReportNotation';

export interface NotationSeriesConfig {
  key: keyof NotationDataPoint;
  code: string;
  label: string;
  color: string;
  description: string;
}

interface NotationMultiSeriesChartProps {
  title: string;
  subtitle: string;
  unit?: string;
  icon: LucideIcon;
  data: NotationDataPoint[];
  series: NotationSeriesConfig[];
  selectedPeriod?: string | number | 'all';
  onSelectPeriod?: (periodKey: string | number) => void;
}

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

export const NotationMultiSeriesChart: React.FC<NotationMultiSeriesChartProps> = ({
  title,
  subtitle,
  unit = 'Toko',
  icon: Icon,
  data,
  series,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex items-center justify-center h-64 text-gray-400 text-xs">
        Tidak ada data notasi untuk filter ini.
      </div>
    );
  }

  // Calculate scales (Independent max across all series)
  const allValues: number[] = [];
  data.forEach((d) => {
    series.forEach((s) => {
      const val = Number(d[s.key] || 0);
      allValues.push(val);
    });
  });

  const maxVal = Math.max(...allValues, 0);
  const maxValue = Math.max(10, Math.ceil(maxVal * 1.15));

  const chartHeight = 210;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 28;
  const usableHeight = chartHeight - paddingY * 2;
  const totalPoints = data.length;
  const stepX = (chartWidth - paddingX * 2) / Math.max(1, totalPoints - 1);

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxValue) * usableHeight;
  };

  const getX = (idx: number) => {
    return paddingX + idx * stepX;
  };

  // Build independent path for each series
  const seriesPaths = series.map((s) => {
    const points = data.map((d, idx) => ({
      x: getX(idx),
      y: getY(Number(d[s.key] || 0)),
      val: Number(d[s.key] || 0),
    }));

    const totalVal = points.reduce((sum, p) => sum + p.val, 0);
    const isZeroSeries = totalVal === 0;

    // Garis grafik hanya menghubungkan sampai Week Efektif / Minggu Berjalan saat ini
    const effectivePoints = points.filter((_, idx) => !data[idx]?.isFuture);

    const pathString =
      isZeroSeries || effectivePoints.length === 0
        ? ''
        : effectivePoints.reduce(
            (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
            ''
          );

    return {
      ...s,
      points,
      totalVal,
      isZeroSeries,
      pathString,
    };
  });

  // Y-axis grid ticks (4 ticks with absolute numbers)
  const yTicks = [0, Math.round(maxValue * 0.33), Math.round(maxValue * 0.66), maxValue];

  const allSeriesZero = maxVal === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-sm">
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
                Satuan: {unit} (Absolut)
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Info Explainer Toggle Button */}
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            showInfo
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
          }`}
          title="Lihat arti bisnis setiap notasi"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info Popover Box if open */}
      {showInfo && (
        <div className="mb-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs space-y-1.5 animate-fade-in">
          <p className="font-bold text-indigo-900 text-[11px] uppercase tracking-wider">
            Arti Bisnis Notasi Garis:
          </p>
          {series.map((s) => (
            <div key={s.code} className="flex items-start gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <p className="text-gray-700">
                <strong className="text-gray-900">{s.code} ({s.label}):</strong> {s.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SVG Multi-Line Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 sm:h-52 overflow-visible"
        >
          {/* Background Grid Lines & Y-ticks (Nilai Sumbu Y Absolut) */}
          {yTicks.map((tickVal, idx) => {
            const y = getY(tickVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#94a3b8"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {formatNumber(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Column Area */}
          {data.map((d, idx) => {
            const colWidth = stepX;
            const x = getX(idx) - colWidth / 2;
            const isHovered = hoveredIdx === idx;
            const isSelected = selectedPeriod === d.periodKey;

            return (
              <g
                key={`col-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectPeriod && onSelectPeriod(d.periodKey)}
                className="cursor-pointer"
              >
                {/* Highlight vertical guide */}
                {(isHovered || isSelected) && (
                  <rect
                    x={x}
                    y={paddingY}
                    width={colWidth}
                    height={usableHeight}
                    fill={isSelected ? '#e0e7ff' : '#f8fafc'}
                    opacity={0.6}
                    rx="4"
                  />
                )}

                {/* Vertical dash line on active */}
                {(isHovered || isSelected) && (
                  <line
                    x1={getX(idx)}
                    y1={paddingY}
                    x2={getX(idx)}
                    y2={chartHeight - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            );
          })}

          {/* Render Independent Lines (Garis bernilai 0 sepanjang waktu disembunyikan) */}
          {seriesPaths.map((s) => {
            if (s.isZeroSeries) return null; // Sembunyikan garis jika total nilainya 0

            return (
              <g key={`path-${s.code}`}>
                {s.pathString && (
                  <path
                    d={s.pathString}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Data points (dots) & Absolute Value Labels (Hanya tampil jika val > 0 dan bukan week masa depan) */}
                {s.points.map((pt, pIdx) => {
                  if (pt.val === 0 || data[pIdx]?.isFuture) return null; // Titik 0 atau week masa depan tidak ditampilkan

                  const isHovered = hoveredIdx === pIdx;
                  const isCurrent = data[pIdx]?.isCurrent;

                  return (
                    <g key={`dot-group-${s.code}-${pIdx}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : isCurrent ? 4.5 : 3.5}
                        fill="#ffffff"
                        stroke={s.color}
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-transform duration-200"
                      />
                      {/* Nilai Absolute Langsung di Grafik */}
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={s.color}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        {formatNumber(pt.val)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Jika semua notasi bernilai 0 */}
          {allSeriesZero && (
            <text
              x={chartWidth / 2}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="11"
              fill="#94a3b8"
              fontWeight="500"
            >
              Semua nilai notasi pada periode ini adalah 0 (tidak ada aktivitas)
            </text>
          )}

          {/* X-axis Labels */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIdx === idx;
            const isSelected = selectedPeriod === d.periodKey;
            const isFuture = d.isFuture;

            return (
              <text
                key={`lbl-${idx}`}
                x={x}
                y={chartHeight - paddingY + 16}
                textAnchor="middle"
                fontSize={isHovered || isSelected ? '10' : '9'}
                fontWeight={d.isCurrent ? 'bold' : isHovered || isSelected ? 'bold' : 'normal'}
                fill={
                  d.isCurrent
                    ? '#4f46e5'
                    : isFuture
                    ? '#cbd5e1'
                    : isSelected
                    ? '#4338ca'
                    : isHovered
                    ? '#1e293b'
                    : '#64748b'
                }
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute top-2 z-20 bg-gray-900/95 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl border border-gray-700 pointer-events-none transition-all duration-150 backdrop-blur-xs"
            style={{
              left: `${Math.min(
                75,
                Math.max(25, (hoveredIdx / Math.max(1, totalPoints - 1)) * 100)
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold border-b border-gray-700 pb-1 mb-1.5 flex items-center justify-between gap-3">
              <span>{data[hoveredIdx].label}</span>
              <span className="text-[10px] text-gray-400 font-normal">
                {data[hoveredIdx].cycle ? `Siklus ${data[hoveredIdx].cycle}` : ''}
              </span>
            </div>

            <div className="space-y-1">
              {series.map((s) => {
                const val = Number(data[hoveredIdx][s.key] || 0);
                return (
                  <div key={s.code} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-gray-300">
                        {s.code} ({s.label})
                      </span>
                    </div>
                    <span className={`font-bold font-mono ${val > 0 ? 'text-white' : 'text-gray-500'}`}>
                      {formatNumber(val)} {unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-xs">
        {seriesPaths.map((s) => (
          <div
            key={s.code}
            className={`flex items-center gap-1.5 transition-opacity ${
              s.isZeroSeries ? 'opacity-40' : 'opacity-100'
            }`}
            title={s.description}
          >
            <span
              className="w-3 h-1 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-bold text-gray-800 text-[11px]">{s.code}</span>
            <span className="text-gray-500 text-[11px]">
              ({s.label}){s.isZeroSeries ? ' [0]' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
