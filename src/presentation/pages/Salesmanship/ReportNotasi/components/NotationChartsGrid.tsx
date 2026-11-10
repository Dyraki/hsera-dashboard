import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { NotationDataPoint } from '@/core/domain/models/ReportNotation';
import { NotationMultiSeriesChart, NotationSeriesConfig } from './NotationMultiSeriesChart';
import { NotationAvgQuantityChart } from './NotationAvgQuantityChart';

interface NotationChartsGridProps {
  data: NotationDataPoint[];
  selectedPeriod?: string | number | 'all';
  onSelectPeriod?: (periodKey: string | number) => void;
}

// Config 1: SK (Stok Kurang), SL (Stok Laku), OOS (Out Of Stock)
const SERIES_CHART_1: NotationSeriesConfig[] = [
  {
    key: 'sk',
    code: 'SK',
    label: 'Stok Kurang',
    color: '#f59e0b', // Amber
    description: 'Salesman datang, stok di outlet menipis/kurang, dan outlet belanja ke salesman.',
  },
  {
    key: 'sl',
    code: 'SL',
    label: 'Stok Laku',
    color: '#3b82f6', // Blue
    description: 'Salesman datang, produk di outlet laku (sudah belanja di toko/grosir lain), tetapi tidak belanja ke salesman.',
  },
  {
    key: 'oos',
    code: 'OOS',
    label: 'Out Of Stock',
    color: '#ef4444', // Red
    description: 'Salesman datang, produk tidak tersedia (habis total), dan outlet belanja ke salesman.',
  },
];

// Config 2: SD (Stok Diam), TL (Tidak Laku)
const SERIES_CHART_2: NotationSeriesConfig[] = [
  {
    key: 'sd',
    code: 'SD',
    label: 'Stok Diam',
    color: '#f43f5e', // Rose
    description: 'Salesman datang, outlet tidak belanja di toko lain dan tidak belanja di sales, produk masih sama persis dengan minggu sebelumnya.',
  },
  {
    key: 'tl',
    code: 'TL',
    label: 'Tidak Laku',
    color: '#8b5cf6', // Purple
    description: 'Outlet pernah jualan produk tersebut sebelumnya, namun tidak mau beli di salesman lagi.',
  },
];

// Config 3: BPJ (Belum Pernah Jual), SB (Stok Baru)
const SERIES_CHART_3: NotationSeriesConfig[] = [
  {
    key: 'bpj',
    code: 'BPJ',
    label: 'Belum Pernah Jual',
    color: '#64748b', // Slate
    description: 'Outlet belum pernah jualan produk tersebut dan tidak mau belanja ke salesman.',
  },
  {
    key: 'sb',
    code: 'SB',
    label: 'Stok Baru',
    color: '#10b981', // Emerald
    description: 'Outlet baru yang belum pernah menjual produk tersebut dan memutuskan membeli di salesman.',
  },
];

export const NotationChartsGrid: React.FC<NotationChartsGridProps> = ({
  data,
  selectedPeriod,
  onSelectPeriod,
}) => {
  return (
    <div className="space-y-4">
      {/* 2x2 Grid of Independent Multi-Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Grafik 1: SK, SL, OOS */}
        <NotationMultiSeriesChart
          title="Kecepatan Stok & Order ke Salesman"
          subtitle="SK (Stok Kurang & Beli ke Sales), SL (Stok Laku Tapi Beli di Grosir), OOS (Stok Habis & Beli ke Sales)"
          unit="Toko"
          icon={TrendingUp}
          data={data}
          series={SERIES_CHART_1}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={onSelectPeriod}
        />

        {/* Grafik 2: SD, TL */}
        <NotationMultiSeriesChart
          title="Produk Stagnan & Penolakan Toko"
          subtitle="SD (Stok Diam / Produk Macet), TL (Pernah Jual Tapi Tolak Beli ke Salesman Lagi)"
          unit="Toko"
          icon={AlertTriangle}
          data={data}
          series={SERIES_CHART_2}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={onSelectPeriod}
        />

        {/* Grafik 3: BPJ, SB */}
        <NotationMultiSeriesChart
          title="Dinamika Penetrasi Outlet Baru"
          subtitle="BPJ (Belum Pernah Jual & Tolak Beli), SB (Outlet Baru & Beli Pertama Kali ke Sales)"
          unit="Toko"
          icon={UserPlus}
          data={data}
          series={SERIES_CHART_3}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={onSelectPeriod}
        />

        {/* Grafik 4: Avg Stock, Avg Buy */}
        <NotationAvgQuantityChart
          data={data}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={onSelectPeriod}
        />
      </div>
    </div>
  );
};
