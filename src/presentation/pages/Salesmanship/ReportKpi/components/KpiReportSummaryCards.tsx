import React from 'react';
import {
  Users,
  ShoppingCart,
  Layers,
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { KpiSummaryMetric } from '@/core/domain/models/ReportKpi';

interface KpiReportSummaryCardsProps {
  summary: {
    kunjungan: KpiSummaryMetric;
    ec: KpiSummaryMetric;
    bd: KpiSummaryMetric;
    volume: KpiSummaryMetric;
  };
  totalWeeks?: number;
}

const formatNumber = (num: number, digits?: number) => {
  if (digits !== undefined) {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(num);
  }
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
  }).format(num);
};

export const KpiReportSummaryCards: React.FC<KpiReportSummaryCardsProps> = ({
  summary,
}) => {
  const cards = [
    {
      id: 'kunjungan',
      title: 'KUNJUNGAN OUTLET',
      subtitle: 'Target vs Realisasi Kunjungan Harian',
      unit: 'Toko',
      metric: summary.kunjungan,
      icon: Users,
      colorTheme: 'indigo',
    },
    {
      id: 'ec',
      title: 'EFFECTIVE CALL (EC)',
      subtitle: 'Toko dengan Transaksi Sukses',
      unit: 'Toko',
      metric: summary.ec,
      icon: ShoppingCart,
      colorTheme: 'emerald',
    },
    {
      id: 'bd',
      title: 'BRAND DISTRIBUTION (BD)',
      subtitle: 'Sebaran Brand / Multi-SKU',
      unit: 'Outlet BD',
      metric: summary.bd,
      icon: Layers,
      colorTheme: 'purple',
    },
    {
      id: 'volume',
      title: 'VOLUME PENJUALAN',
      subtitle: 'Total Volume',
      unit: 'Pack',
      metric: summary.volume,
      icon: Package,
      colorTheme: 'amber',
      extraInfo: `~${formatNumber(summary.volume.realisasi / 800, 1)} Karton`,
    },
  ];

  const getStatusBadge = (status: string, percent: number) => {
    switch (status) {
      case 'ACHIEVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Tercapai ({percent}%)
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/70 border border-blue-300/60 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            On Track ({percent}%)
          </span>
        );
      case 'UNDER_TARGET':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300/70 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Under Target ({percent}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/80 border border-rose-300/60 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Kritis ({percent}%)
          </span>
        );
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'ACHIEVED':
        return 'bg-emerald-500';
      case 'ON_TRACK':
        return 'bg-blue-500';
      case 'UNDER_TARGET':
        return 'bg-amber-500';
      default:
        return 'bg-rose-500';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const progressWidth = Math.min(100, Math.max(0, c.metric.achievementPercent));
        const gap = c.metric.gap;
        const isGapPositive = gap >= 0;

        return (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 tracking-tight">{c.title}</h3>
                    <p className="text-[10px] text-gray-500">{c.subtitle}</p>
                  </div>
                </div>
                <div>{getStatusBadge(c.metric.status, c.metric.achievementPercent)}</div>
              </div>

              {/* Main metric row: Realisasi vs Target */}
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {formatNumber(c.metric.realisasi)}
                    <span className="text-xs font-medium text-gray-500 ml-1">{c.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Target: <span className="font-semibold text-gray-700">{formatNumber(c.metric.target)}</span> {c.unit}
                  </div>
                </div>

                {/* Gap info */}
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-bold ${isGapPositive ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                  >
                    {isGapPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{isGapPositive ? `+${formatNumber(gap)}` : formatNumber(gap)}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isGapPositive ? 'Surplus' : 'Defisit'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(
                      c.metric.status
                    )}`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom info: Weekly Average & Best/Worst */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
              <div>
                Rata-rata:{' '}
                <span className="font-semibold text-gray-800">
                  {formatNumber(c.metric.weeklyAverageReal)}
                </span>{' '}
                /mgg
              </div>
              {c.extraInfo ? (
                <div className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                  {c.extraInfo}
                </div>
              ) : (
                c.metric.bestWeek.weekNumber > 0 && (
                  <div className="text-[10px] text-gray-500">
                    Puncak: <span className="font-bold text-emerald-700">W{c.metric.bestWeek.weekNumber}</span> ({c.metric.bestWeek.achievement}%)
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
