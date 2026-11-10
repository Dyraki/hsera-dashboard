export interface NotationReportFilterState {
  year: number;
  quarter: number;
  cycleType: 'ALL' | 'EVEN' | 'ODD';
  selectedWeek: number | 'all';
  ouKode: string;
  districtId: string;
  brandId: string | 'all';
}

export interface QuarterOption {
  year: number;
  quarter: number;
  label: string;
}

export const QUARTER_OPTIONS: QuarterOption[] = [
  { year: 2026, quarter: 4, label: 'Kuartal 4 - 2026 (Okt - Des)' },
  { year: 2026, quarter: 3, label: 'Kuartal 3 - 2026 (Jul - Sep)' },
  { year: 2026, quarter: 2, label: 'Kuartal 2 - 2026 (Apr - Jun)' },
  { year: 2026, quarter: 1, label: 'Kuartal 1 - 2026 (Jan - Mar)' },
  { year: 2025, quarter: 4, label: 'Kuartal 4 - 2025 (Okt - Des)' },
];

export const CYCLE_OPTIONS = [
  { value: 'ALL', label: 'Semua Siklus (Default: Ganjil & Genap)' },
  { value: 'ODD', label: 'Siklus Ganjil' },
  { value: 'EVEN', label: 'Siklus Genap' },
] as const;

export interface NotationDefinitionInfo {
  code: string;
  name: string;
  description: string;
  category: 'STOK_ORDER' | 'STAGNAN_TOLAK' | 'PENETRASI_BARU' | 'KUANTITAS';
  color: string;
}

export const NOTATION_DEFINITIONS: Record<string, NotationDefinitionInfo> = {
  SK: {
    code: 'SK',
    name: 'Stok Kurang',
    description: 'Salesman datang, stok di outlet menipis/kurang, dan outlet belanja ke salesman.',
    category: 'STOK_ORDER',
    color: '#f59e0b', // Amber
  },
  SL: {
    code: 'SL',
    name: 'Stok Laku',
    description: 'Salesman datang, produk di outlet laku/ada perputaran (outlet sudah belanja di toko/grosir lain), tetapi tidak belanja ke salesman.',
    category: 'STOK_ORDER',
    color: '#3b82f6', // Blue
  },
  OOS: {
    code: 'OOS',
    name: 'Out Of Stock',
    description: 'Salesman datang, produk tidak tersedia (habis total), dan outlet belanja ke salesman.',
    category: 'STOK_ORDER',
    color: '#ef4444', // Red
  },
  SD: {
    code: 'SD',
    name: 'Stok Diam',
    description: 'Salesman datang, outlet tidak belanja di toko lain dan tidak belanja di salesman, produk masih sama persis dengan penjualan salesman minggu sebelumnya.',
    category: 'STAGNAN_TOLAK',
    color: '#f43f5e', // Rose
  },
  TL: {
    code: 'TL',
    name: 'Tidak Laku',
    description: 'Outlet pernah jualan produk tersebut sebelumnya, namun tidak mau beli di salesman lagi.',
    category: 'STAGNAN_TOLAK',
    color: '#8b5cf6', // Purple
  },
  BPJ: {
    code: 'BPJ',
    name: 'Belum Pernah Jual',
    description: 'Outlet belum pernah jualan produk tersebut dan tidak mau belanja ke salesman.',
    category: 'PENETRASI_BARU',
    color: '#64748b', // Slate
  },
  SB: {
    code: 'SB',
    name: 'Stok Baru',
    description: 'Outlet baru yang belum pernah menjual produk tersebut dan memutuskan membeli di salesman.',
    category: 'PENETRASI_BARU',
    color: '#10b981', // Emerald
  },
  AVG_STOCK: {
    code: 'AVG_STOCK',
    name: 'Avg Stock',
    description: 'Rata-rata pack sisa stok fisik di outlet saat dikunjungi salesman.',
    category: 'KUANTITAS',
    color: '#0284c7', // Sky Blue
  },
  AVG_BUY: {
    code: 'AVG_BUY',
    name: 'Avg Buy',
    description: 'Rata-rata pack pembelian fisik per transaksi outlet (Drop Size).',
    category: 'KUANTITAS',
    color: '#d97706', // Amber Gold
  },
};
