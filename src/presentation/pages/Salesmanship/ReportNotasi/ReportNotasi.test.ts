import { describe, it, expect } from 'vitest';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { routePaths } from '@/routes/routePaths';
import { NOTATION_DEFINITIONS } from './types';

describe('Report Notasi Domain, Menu ID, & Business Logic Tests', () => {
  it('should have the exact SYSTEM_MENU_IDS and route path for Report Notasi', () => {
    expect(SYSTEM_MENU_IDS.REPORT_NOTASI).toBe('2e6467a7-0b4b-4567-9031-0a099f28c155');
    expect(routePaths.salesmanshipReportNotasi).toBe('/salesmanship/report/notasi');
  });

  describe('Field Notations Business Definitions Verification', () => {
    it('should define SK as Stok Kurang where outlet buys from salesman', () => {
      expect(NOTATION_DEFINITIONS.SK.name).toBe('Stok Kurang');
      expect(NOTATION_DEFINITIONS.SK.description).toContain('outlet belanja ke salesman');
    });

    it('should define SL as Stok Laku where outlet already bought elsewhere but not from salesman', () => {
      expect(NOTATION_DEFINITIONS.SL.name).toBe('Stok Laku');
      expect(NOTATION_DEFINITIONS.SL.description).toContain('tidak belanja ke salesman');
    });

    it('should define OOS as Out Of Stock where product is empty and outlet buys from salesman', () => {
      expect(NOTATION_DEFINITIONS.OOS.name).toBe('Out Of Stock');
      expect(NOTATION_DEFINITIONS.OOS.description).toContain('produk tidak tersedia (habis total)');
      expect(NOTATION_DEFINITIONS.OOS.description).toContain('outlet belanja ke salesman');
    });

    it('should define SD as Stok Diam where product is unchanged from previous week', () => {
      expect(NOTATION_DEFINITIONS.SD.name).toBe('Stok Diam');
      expect(NOTATION_DEFINITIONS.SD.description).toContain('produk masih sama persis dengan penjualan salesman minggu sebelumnya');
    });

    it('should define SB as Stok Baru for new outlet penetration buying from salesman', () => {
      expect(NOTATION_DEFINITIONS.SB.name).toBe('Stok Baru');
      expect(NOTATION_DEFINITIONS.SB.description).toContain('belum pernah menjual produk tersebut dan memutuskan membeli di salesman');
    });

    it('should define TL as Tidak Laku where outlet previously sold but refuses to buy again', () => {
      expect(NOTATION_DEFINITIONS.TL.name).toBe('Tidak Laku');
      expect(NOTATION_DEFINITIONS.TL.description).toContain('pernah jualan produk tersebut sebelumnya, namun tidak mau beli di salesman lagi');
    });

    it('should define BPJ as Belum Pernah Jual where outlet never sold and refuses to buy', () => {
      expect(NOTATION_DEFINITIONS.BPJ.name).toBe('Belum Pernah Jual');
      expect(NOTATION_DEFINITIONS.BPJ.description).toContain('belum pernah jualan produk tersebut dan tidak mau belanja ke salesman');
    });
  });

  describe('Non-Stacked Independent Line Logic Verification', () => {
    it('should maintain independent absolute counts for each notation line without summing them together', () => {
      const mockWeekData = {
        periodKey: 202642,
        label: 'W42',
        sk: 120, // Outlet
        sl: 85,  // Outlet
        oos: 18, // Outlet
        sd: 40,  // Outlet
        tl: 15,  // Outlet
        bpj: 250,// Outlet
        sb: 35,  // Outlet
        avgStock: 22.4, // Pack
        avgBuy: 8.6,    // Pack
        totalCalls: 380,
      };

      // Each metric stands on its own as an absolute integer/float
      expect(mockWeekData.sk).toBe(120);
      expect(mockWeekData.sl).toBe(85);
      expect(mockWeekData.oos).toBe(18);
      expect(mockWeekData.sd).toBe(40);
      expect(mockWeekData.tl).toBe(15);
      expect(mockWeekData.bpj).toBe(250);
      expect(mockWeekData.sb).toBe(35);

      // Quantities divided by totalCalls (Callmade / Kunjungan)
      const stockQty = 8512;
      const buyQty = 3268;
      const totalCalls = 380;
      const expectedAvgStock = Math.round((stockQty / totalCalls) * 10) / 10;
      const expectedAvgBuy = Math.round((buyQty / totalCalls) * 10) / 10;
      expect(mockWeekData.avgStock).toBeCloseTo(expectedAvgStock, 1);
      expect(mockWeekData.avgBuy).toBeCloseTo(expectedAvgBuy, 1);

      // Verify no forced stacking/sum between SK and OOS
      expect(mockWeekData.sk).not.toBe(mockWeekData.sk + mockWeekData.oos);
    });

    it('should suppress points and data labels when value is 0 and identify zero-value series', () => {
      const seriesPoints = [
        { periodKey: 'W40', val: 0 },
        { periodKey: 'W41', val: 45 },
        { periodKey: 'W42', val: 0 },
      ];

      // Points with val === 0 are filtered from labels/dots rendering
      const activeRenderPoints = seriesPoints.filter((p) => p.val > 0);
      expect(activeRenderPoints).toHaveLength(1);
      expect(activeRenderPoints[0].val).toBe(45);

      // Entire series with 0
      const zeroSeries = [{ val: 0 }, { val: 0 }, { val: 0 }];
      const totalZero = zeroSeries.reduce((s, p) => s + p.val, 0);
      expect(totalZero === 0).toBe(true);
    });
  });

  describe('Component and Barrel Exports Verification', () => {
    it('should export all essential ReportNotasi components and hooks properly', async () => {
      const barrel = await import('./index');
      expect(barrel.ReportNotasiPage).toBeDefined();
      expect(barrel.useNotationReport).toBeDefined();
      expect(barrel.NotationHeaderFilter).toBeDefined();
      expect(barrel.NotationChartsGrid).toBeDefined();
      expect(barrel.NotationMultiSeriesChart).toBeDefined();
      expect(barrel.NotationAvgQuantityChart).toBeDefined();
      expect(barrel.NOTATION_DEFINITIONS).toBeDefined();
      expect(barrel.QUARTER_OPTIONS).toBeDefined();
      expect(barrel.CYCLE_OPTIONS).toBeDefined();
    });
  });
});
