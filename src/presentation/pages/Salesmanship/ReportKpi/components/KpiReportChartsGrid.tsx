import React, { useState } from 'react';
import {
  Users,
  ShoppingCart,
  Layers,
  Package,
  LayoutGrid,
} from 'lucide-react';
import { KpiWeeklyDataPoint } from '@/core/domain/models/ReportKpi';
import { KpiParameterChart } from './KpiParameterChart';
import { KpiTabType } from '../types';

interface KpiReportChartsGridProps {
  weeks: KpiWeeklyDataPoint[];
  selectedWeek: number | 'all';
  onSelectWeek: (w: number) => void;
}

export const KpiReportChartsGrid: React.FC<KpiReportChartsGridProps> = ({
  weeks,
  selectedWeek,
  onSelectWeek,
}) => {
  const [activeTab, setActiveTab] = useState<KpiTabType>('ALL');

  const tabs: Array<{ id: KpiTabType; label: string; icon: any }> = [
    { id: 'ALL', label: 'Semua Grafik (2x2 Grid)', icon: LayoutGrid },
    { id: 'KUNJUNGAN', label: 'Kunjungan vs Target', icon: Users },
    { id: 'EC', label: 'EC vs Target', icon: ShoppingCart },
    { id: 'BD', label: 'BD vs Target', icon: Layers },
    { id: 'VOLUME', label: 'Volume vs Target', icon: Package },
  ];

  return (
    <div className="space-y-3">
      {/* View Switch Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Tracking <span className="font-bold text-gray-800">{weeks.length} Minggu</span> pada kuartal terpilih
        </div>
      </div>

      {/* Grid or Single View */}
      {activeTab === 'ALL' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1. Kunjungan Chart */}
          <KpiParameterChart
            title="1. Tracking Kunjungan Outlet"
            subtitle="Kunjungan Harian Realisasi vs Target"
            unit="Toko"
            icon={Users}
            colorTheme="indigo"
            weeks={weeks}
            getMetric={(w) => w.kunjungan}
            selectedWeek={selectedWeek}
            onSelectWeek={onSelectWeek}
          />

          {/* 2. EC Chart */}
          <KpiParameterChart
            title="2. Tracking Effective Call (EC)"
            subtitle="Jumlah Outlet Transaksi Sukses vs Target"
            unit="Toko"
            icon={ShoppingCart}
            colorTheme="emerald"
            weeks={weeks}
            getMetric={(w) => w.ec}
            selectedWeek={selectedWeek}
            onSelectWeek={onSelectWeek}
          />

          {/* 3. BD Chart */}
          <KpiParameterChart
            title="3. Tracking Brand Distribution (BD)"
            subtitle="Sebaran Outlet Multi-Brand vs Target"
            unit="Outlet BD"
            icon={Layers}
            colorTheme="purple"
            weeks={weeks}
            getMetric={(w) => w.bd}
            selectedWeek={selectedWeek}
            onSelectWeek={onSelectWeek}
          />

          {/* 4. Volume Chart */}
          <KpiParameterChart
            title="4. Tracking Volume Penjualan"
            subtitle="Total Pack vs Target"
            unit="Pack"
            icon={Package}
            colorTheme="amber"
            weeks={weeks}
            getMetric={(w) => w.volume}
            selectedWeek={selectedWeek}
            onSelectWeek={onSelectWeek}
          />
        </div>
      ) : (
        <div className="w-full">
          {activeTab === 'KUNJUNGAN' && (
            <KpiParameterChart
              title="Tracking Kunjungan Outlet vs Target"
              subtitle="Perbandingan mingguan total kunjungan toko dengan target yang ditetapkan"
              unit="Toko"
              icon={Users}
              colorTheme="indigo"
              weeks={weeks}
              getMetric={(w) => w.kunjungan}
              selectedWeek={selectedWeek}
              onSelectWeek={onSelectWeek}
            />
          )}

          {activeTab === 'EC' && (
            <KpiParameterChart
              title="Tracking Effective Call (EC) vs Target"
              subtitle="Perbandingan mingguan jumlah toko transaksi aktif dengan target yang ditetapkan"
              unit="Toko"
              icon={ShoppingCart}
              colorTheme="emerald"
              weeks={weeks}
              getMetric={(w) => w.ec}
              selectedWeek={selectedWeek}
              onSelectWeek={onSelectWeek}
            />
          )}

          {activeTab === 'BD' && (
            <KpiParameterChart
              title="Tracking Brand Distribution (BD) vs Target"
              subtitle="Perbandingan mingguan penyebaran multi-brand pada outlet dengan target"
              unit="Outlet BD"
              icon={Layers}
              colorTheme="purple"
              weeks={weeks}
              getMetric={(w) => w.bd}
              selectedWeek={selectedWeek}
              onSelectWeek={onSelectWeek}
            />
          )}

          {activeTab === 'VOLUME' && (
            <KpiParameterChart
              title="Tracking Volume Penjualan vs Target"
              subtitle="Perbandingan mingguan total volume penjualan (Pack) dengan target"
              unit="Pack"
              icon={Package}
              colorTheme="amber"
              weeks={weeks}
              getMetric={(w) => w.volume}
              selectedWeek={selectedWeek}
              onSelectWeek={onSelectWeek}
            />
          )}
        </div>
      )}
    </div>
  );
};
