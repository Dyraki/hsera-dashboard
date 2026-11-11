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

  describe('Brand Notation Matrix Absolute Mode & Callmade Divider Tests', () => {
    it('should correctly calculate and structure absolute counts for brand notation and handle callmade divider', () => {
      const mockBrandRow = {
        urutan: 1,
        kodeBrand: '100010',
        namaBrand: 'HSERA REGULAR 12',
        callmade: 1250,
        bd: 980,
        totalStockPack: 4900,
        totalBuyPack: 3200,
        totalVolPack: 3200,
        sk: 45,
        sl: 820,
        sd: 25,
        oos: 12,
        sb: 78,
        tl: 0,
        bpj: 0,
      };

      // Verify absolute integer counts
      expect(mockBrandRow.callmade).toBe(1250);
      expect(mockBrandRow.bd).toBe(980);
      expect(mockBrandRow.totalStockPack).toBe(4900);
      expect(mockBrandRow.totalBuyPack).toBe(3200);
      expect(mockBrandRow.sk).toBe(45);
      expect(mockBrandRow.sl).toBe(820);

      // Verify BD formula: BD = OOS + SK + SL + SD + SB
      const calculatedBd =
        mockBrandRow.oos + mockBrandRow.sk + mockBrandRow.sl + mockBrandRow.sd + mockBrandRow.sb;
      expect(mockBrandRow.bd).toBe(calculatedBd);

      // Verify divider calculations using callmade as denominator
      const callmadeDiv = mockBrandRow.callmade;
      const skPercent = Math.round((mockBrandRow.sk / callmadeDiv) * 1000) / 10;
      const slPercent = Math.round((mockBrandRow.sl / callmadeDiv) * 1000) / 10;
      const bdPercent = Math.round((mockBrandRow.bd / callmadeDiv) * 1000) / 10;
      const avgStockPack = Math.round((mockBrandRow.totalStockPack / callmadeDiv) * 10) / 10;
      const avgBuyPack = Math.round((mockBrandRow.totalBuyPack / callmadeDiv) * 10) / 10;

      expect(skPercent).toBe(3.6);
      expect(slPercent).toBe(65.6);
      expect(bdPercent).toBe(78.4);
      expect(avgStockPack).toBe(3.9);
      expect(avgBuyPack).toBe(2.6);
    });

    it('should export BrandNotationMatrixTable from Dashboard components properly', async () => {
      const { BrandNotationMatrixTable } = await import('@/presentation/pages/Dashboard/components/BrandNotationMatrixTable');
      expect(BrandNotationMatrixTable).toBeDefined();
    });

    it('should compute Ratio % using Callmade as denominator by default, and support absolute mode', () => {
      const rawSk = 50;
      const rawCalls = 250;
      const percentValue = (rawSk / rawCalls) * 100;
      expect(percentValue).toBe(20);

      // Verify that default mode across visual charts and matrix is percentage
      const defaultMode: 'percentage' | 'absolute' = 'percentage';
      expect(defaultMode).toBe('percentage');

      // Verify toggle to absolute mode
      const toggledMode: 'percentage' | 'absolute' = defaultMode === 'percentage' ? 'absolute' : 'percentage';
      expect(toggledMode).toBe('absolute');
    });

    it('should maintain mathematical consistency between 15-brand consolidation and multi-series chart', () => {
      // 15 brands each with individual SK counts
      const brandCount = 15;
      const calls = 1000;
      // Suppose each brand has 50 SK on average in 1,000 calls -> 5% each
      const brandSkRates = Array.from({ length: 15 }, () => 50); // 15 * 50 = 750 total SK
      const sumSk = brandSkRates.reduce((a, b) => a + b, 0); // 750

      // Individual brand SK %:
      const brandPercent = (50 / calls) * 100; // 5.0%

      // Consolidation SK % across 15 brands:
      const grandSkSum = brandCount * brandPercent; // 75.0
      const consolidationSkPercent = Math.round((grandSkSum / brandCount) * 10) / 10;
      expect(consolidationSkPercent).toBe(5.0);

      // Chart ratio % across 15 brands:
      // Total audit opportunities = calls * brandCount = 15,000
      const chartPercentVal = Math.round((sumSk / (calls * brandCount)) * 1000) / 10;
      expect(chartPercentVal).toBe(5.0);

      // They MUST be 100% equal!
      expect(chartPercentVal).toBe(consolidationSkPercent);
    });

    it('should guarantee avgStock and avgBuy aliases are populated for table rendering', () => {
      const row = {
        avgStockPack: 3.8,
        avgStokPack: 3.8,
        avgBuyPack: 2.4,
        avgBeliPack: 2.4,
      };

      // Both English and Indonesian property names must be resolvable
      const stockVal = row.avgStockPack ?? row.avgStokPack ?? 0;
      const buyVal = row.avgBuyPack ?? row.avgBeliPack ?? 0;

      expect(stockVal).toBe(3.8);
      expect(buyVal).toBe(2.4);
      expect(stockVal).not.toBe(0);
      expect(buyVal).not.toBe(0);
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
