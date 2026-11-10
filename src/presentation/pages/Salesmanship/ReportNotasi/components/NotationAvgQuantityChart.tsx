import React, { useState } from 'react';
import { Package, Info } from 'lucide-react';
import { NotationDataPoint } from '@/core/domain/models/ReportNotation';

interface NotationAvgQuantityChartProps {
  data: NotationDataPoint[];
  selectedPeriod?: string | number | 'all';
  onSelectPeriod?: (periodKey: string | number) => void;
}

const formatDecimal = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);

export const NotationAvgQuantityChart: React.FC<NotationAvgQuantityChartProps> = ({
  data,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex items-center justify-center h-64 text-gray-400 text-xs">
        Tidak ada data kuantitas untuk filter ini.
      </div>
    );
  }

  // Calculate scales (Independent max between avgStock and avgBuy)
  const maxStock = Math.max(...data.map((d) => d.avgStock), 0);
  const maxBuy = Math.max(...data.map((d) => d.avgBuy), 0);
  const maxValue = Math.max(10, Math.ceil(Math.max(maxStock, maxBuy) * 1.2));

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

  const isZeroStock = maxStock === 0;
  const isZeroBuy = maxBuy === 0;

  // Stock points & path
  const stockPoints = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.avgStock),
    val: d.avgStock,
  }));
  // Garis kuantitas hanya menghubungkan sampai Week Efektif / Minggu Berjalan saat ini
  const effectiveStockPoints = stockPoints.filter((_, idx) => !data[idx]?.isFuture);
  const stockPath =
    isZeroStock || effectiveStockPoints.length === 0
      ? ''
      : effectiveStockPoints.reduce(
          (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
          ''
        );

  // Buy points & path
  const buyPoints = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.avgBuy),
    val: d.avgBuy,
  }));
  const effectiveBuyPoints = buyPoints.filter((_, idx) => !data[idx]?.isFuture);
  const buyPath =
    isZeroBuy || effectiveBuyPoints.length === 0
      ? ''
      : effectiveBuyPoints.reduce(
          (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
          ''
        );

  const yTicks = [0, Math.round(maxValue * 0.33), Math.round(maxValue * 0.66), maxValue];
  const allZero = maxStock === 0 && maxBuy === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-sky-600">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              Kedalaman Stok & Kuantitas Transaksi
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                Satuan: Pack / Callmade (Kunjungan)
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Avg Stock (Sisa stok per callmade) vs Avg Buy (Ukuran belanja per callmade / Drop Size)
            </p>
          </div>
        </div>

        {/* Info Toggle */}
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            showInfo
              ? 'bg-sky-50 border-sky-200 text-sky-600'
              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
          }`}
          title="Lihat arti rata-rata kuantitas per kunjungan"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info Popover */}
      {showInfo && (
        <div className="mb-3 p-3 bg-sky-50/70 border border-sky-100 rounded-lg text-xs space-y-1.5 animate-fade-in">
          <p className="font-bold text-sky-900 text-[11px] uppercase tracking-wider">
            Arti Bisnis Kuantitas per Kunjungan (Callmade):
          </p>
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-sky-600" />
            <p className="text-gray-700">
              <strong className="text-gray-900">Avg Stock:</strong> Rata-rata pack fisik sisa stok yang masih berada di etalase outlet dibagi total callmade (kunjungan salesman).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-amber-600" />
            <p className="text-gray-700">
              <strong className="text-gray-900">Avg Buy (Drop Size):</strong> Rata-rata pack fisik pembelian outlet dibagi total callmade (kunjungan salesman).
            </p>
          </div>
        </div>
      )}

      {/* SVG Multi-Line Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 sm:h-52 overflow-visible"
        >
          {/* Y-axis Grids & Ticks (Nilai Sumbu Y Rata-rata per Kunjungan) */}
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
                  {formatDecimal(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Columns */}
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
                {(isHovered || isSelected) && (
                  <rect
                    x={x}
                    y={paddingY}
                    width={colWidth}
                    height={usableHeight}
                    fill={isSelected ? '#e0f2fe' : '#f8fafc'}
                    opacity={0.6}
                    rx="4"
                  />
                )}
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

          {/* Line 1: Avg Stock (Sky Blue) - Hanya digambar jika maxStock > 0 */}
          {!isZeroStock && (
            <g key="path-stock">
              <path
                d={stockPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              {stockPoints.map((pt, pIdx) => {
                if (pt.val === 0 || data[pIdx]?.isFuture) return null; // Titik & angka 0 atau future weeks tidak ditampilkan

                const isHovered = hoveredIdx === pIdx;
                const isCurrent = data[pIdx]?.isCurrent;
                return (
                  <g key={`stock-dot-group-${pIdx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5.5 : isCurrent ? 4.5 : 3.5}
                      fill="#ffffff"
                      stroke="#0284c7"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-transform duration-200"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      paintOrder="stroke fill"
                    >
                      {formatDecimal(pt.val)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Line 2: Avg Buy (Amber) - Hanya digambar jika maxBuy > 0 */}
          {!isZeroBuy && (
            <g key="path-buy">
              <path
                d={buyPath}
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              {buyPoints.map((pt, pIdx) => {
                if (pt.val === 0 || data[pIdx]?.isFuture) return null; // Titik & angka 0 atau future weeks tidak ditampilkan

                const isHovered = hoveredIdx === pIdx;
                const isCurrent = data[pIdx]?.isCurrent;
                return (
                  <g key={`buy-dot-group-${pIdx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5.5 : isCurrent ? 4.5 : 3.5}
                      fill="#ffffff"
                      stroke="#d97706"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-transform duration-200"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#d97706"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      paintOrder="stroke fill"
                    >
                      {formatDecimal(pt.val)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Jika kedua metrik bernilai 0 */}
          {allZero && (
            <text
              x={chartWidth / 2}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="11"
              fill="#94a3b8"
              fontWeight="500"
            >
              Semua nilai kuantitas pada periode ini adalah 0 Pack / Call
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
                    ? '#0284c7'
                    : isFuture
                    ? '#cbd5e1'
                    : isSelected
                    ? '#0369a1'
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-sky-500" />
                  <span className="text-gray-300">Avg Stock (Sisa per Call)</span>
                </div>
                <span className={`font-bold font-mono ${data[hoveredIdx].avgStock > 0 ? 'text-white' : 'text-gray-500'}`}>
                  {formatDecimal(data[hoveredIdx].avgStock)} Pack / Call
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-amber-500" />
                  <span className="text-gray-300">Avg Buy (Drop Size per Call)</span>
                </div>
                <span className={`font-bold font-mono ${data[hoveredIdx].avgBuy > 0 ? 'text-white' : 'text-gray-500'}`}>
                  {formatDecimal(data[hoveredIdx].avgBuy)} Pack / Call
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-5 text-xs">
        <div
          className={`flex items-center gap-1.5 transition-opacity ${
            isZeroStock ? 'opacity-40' : 'opacity-100'
          }`}
          title="Rata-rata pack fisik sisa stok di etalase outlet dibagi total kunjungan (callmade)"
        >
          <span className="w-3 h-1 rounded-full shrink-0 bg-sky-600" />
          <span className="font-bold text-gray-800 text-[11px]">Avg Stock</span>
          <span className="text-gray-500 text-[11px]">
            (Pack / Call){isZeroStock ? ' [0]' : ''}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 transition-opacity ${
            isZeroBuy ? 'opacity-40' : 'opacity-100'
          }`}
          title="Rata-rata pack fisik pembelian outlet dibagi total kunjungan (callmade) / Drop Size"
        >
          <span className="w-3 h-1 rounded-full shrink-0 bg-amber-600" />
          <span className="font-bold text-gray-800 text-[11px]">Avg Buy</span>
          <span className="text-gray-500 text-[11px]">
            (Drop Size - Pack / Call){isZeroBuy ? ' [0]' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
