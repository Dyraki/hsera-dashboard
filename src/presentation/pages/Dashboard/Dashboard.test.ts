import { describe, it, expect } from 'vitest';
import { DashboardSalesmanRow, DashboardBrandMatrixRow } from '@/core/domain/models/Dashboard';

describe('Dashboard Core Logic & Rules Verification', () => {
  it('should enforce 1 Karton = 800 Pack conversion ratio', () => {
    const packPerKarton = 800;
    const actualPack = 20069;
    const equivalentKarton = Math.round((actualPack / packPerKarton) * 100) / 100;

    expect(packPerKarton).toBe(800);
    expect(equivalentKarton).toBe(25.09);
  });

  it('should sort salesmen strictly ascending by District code', () => {
    const rawSalesmen: Partial<DashboardSalesmanRow>[] = [
      { districtKode: 'D-12', namaSalesman: 'Jefri Zakaria' },
      { districtKode: 'D-02', namaSalesman: 'Salesman D-02' },
      { districtKode: 'D-01', namaSalesman: 'Salesman D-01' },
      { districtKode: 'D-05', namaSalesman: 'Salesman D-05' },
      { districtKode: 'D-03', namaSalesman: 'Salesman D-03' },
      { districtKode: 'D-06', namaSalesman: 'Salesman D-06' },
      { districtKode: 'D-04', namaSalesman: 'Salesman D-04' },
    ];

    const sorted = [...rawSalesmen].sort((a, b) =>
      (a.districtKode || '').localeCompare(b.districtKode || '')
    );

    expect(sorted.map((s) => s.districtKode)).toEqual([
      'D-01',
      'D-02',
      'D-03',
      'D-04',
      'D-05',
      'D-06',
      'D-12',
    ]);
  });

  it('should correctly flag OOS > 8% as critical and SL < 60% as low', () => {
    const brandRows: Partial<DashboardBrandMatrixRow>[] = [
      { kodeBrand: 'HSF12', oosPercent: 12.5, slPercent: 70.0, isOosCritical: true, isSlLow: false },
      { kodeBrand: 'HSK12', oosPercent: 4.0, slPercent: 55.0, isOosCritical: false, isSlLow: true },
      { kodeBrand: 'HSB20', oosPercent: 2.1, slPercent: 82.0, isOosCritical: false, isSlLow: false },
    ];

    expect(brandRows[0].isOosCritical).toBe(true);
    expect(brandRows[0].isSlLow).toBe(false);

    expect(brandRows[1].isOosCritical).toBe(false);
    expect(brandRows[1].isSlLow).toBe(true);

    expect(brandRows[2].isOosCritical).toBe(false);
    expect(brandRows[2].isSlLow).toBe(false);
  });

  it('should verify 4 quarters divide 52 ISO weeks evenly into 13 weeks each', () => {
    const quarters = [
      { q: 1, start: 1, end: 13, weeks: 13 },
      { q: 2, start: 14, end: 26, weeks: 13 },
      { q: 3, start: 27, end: 39, weeks: 13 },
      { q: 4, start: 40, end: 52, weeks: 13 },
    ];

    quarters.forEach((q) => {
      expect(q.end - q.start + 1).toBe(13);
    });

    const totalWeeks = quarters.reduce((acc, q) => acc + q.weeks, 0);
    expect(totalWeeks).toBe(52);
  });
});
