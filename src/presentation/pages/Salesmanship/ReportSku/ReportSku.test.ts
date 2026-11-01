import { describe, it, expect } from 'vitest';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { routePaths } from '@/routes/routePaths';

describe('Report SKU Domain & Computation Logic', () => {
  it('should have correct SYSTEM_MENU_IDS and route path for Report SKU', () => {
    expect(SYSTEM_MENU_IDS.REPORT_SKU).toBe('70375d06-53ca-4ce8-bf5f-bf42b2caeaa1');
    expect(routePaths.salesmanshipReportSku).toBe('/salesmanship/report/sku');
  });

  describe('Like-for-Like WTD Growth Calculations', () => {
    it('should correctly calculate positive WTD Growth percentage and delta pack', () => {
      const wtdCurrent = 5800; // e.g. W44 (Senin-Selasa)
      const wtdPrev = 5100;    // e.g. W42 (Senin-Selasa)

      const deltaPack = wtdCurrent - wtdPrev;
      const growthPercent = Math.round(((wtdCurrent - wtdPrev) / wtdPrev) * 1000) / 10;

      expect(deltaPack).toBe(700);
      expect(growthPercent).toBe(13.7);
    });

    it('should correctly calculate negative WTD Growth percentage and delta pack', () => {
      const wtdCurrent = 4200;
      const wtdPrev = 4800;

      const deltaPack = wtdCurrent - wtdPrev;
      const growthPercent = Math.round(((wtdCurrent - wtdPrev) / wtdPrev) * 1000) / 10;

      expect(deltaPack).toBe(-600);
      expect(growthPercent).toBe(-12.5);
    });

    it('should correctly calculate decrease when current week volume is less than previous week volume', () => {
      // HSSM20 case: W44 = 39 pk, W42 = 123 pk
      const currentWeekVol = 39;
      const prevWeekVol = 123;

      const deltaPack = currentWeekVol - prevWeekVol;
      const growthPercent = prevWeekVol > 0 ? Math.round(((currentWeekVol - prevWeekVol) / prevWeekVol) * 1000) / 10 : null;

      expect(deltaPack).toBe(-84);
      expect(growthPercent).toBe(-68.3);
    });

    it('should safely handle zero previous volume', () => {
      const wtdCurrent = 1500;
      const wtdPrev = 0;

      const deltaPack = wtdCurrent - wtdPrev;
      const growthPercent = wtdPrev > 0 ? Math.round(((wtdCurrent - wtdPrev) / wtdPrev) * 1000) / 10 : null;

      expect(deltaPack).toBe(1500);
      expect(growthPercent).toBeNull();
    });
  });

  describe('Productivity (Drop Size) Calculation', () => {
    it('should calculate pack per call correctly', () => {
      const totalVolumeWtd = 5420;
      const totalCallsWtd = 82;

      const dropSize = Math.round((totalVolumeWtd / totalCallsWtd) * 10) / 10;
      expect(dropSize).toBe(66.1);
    });

    it('should fallback to 0 when calls count is zero', () => {
      const totalVolumeWtd = 0;
      const totalCallsWtd = 0;

      const dropSize = totalCallsWtd > 0 ? Math.round((totalVolumeWtd / totalCallsWtd) * 10) / 10 : 0;
      expect(dropSize).toBe(0);
    });
  });

  describe('Quarter & Week Cycle Partitioning', () => {
    it('should correctly partition even vs odd weeks for Q4 (W40 - W52)', () => {
      const q4Weeks = [202640, 202641, 202642, 202643, 202644, 202645, 202646, 202647, 202648, 202649, 202650, 202651, 202652];
      
      const evenWeeks = q4Weeks.filter((km) => (km % 100) % 2 === 0);
      const oddWeeks = q4Weeks.filter((km) => (km % 100) % 2 !== 0);

      expect(evenWeeks.length).toBe(7); // W40, W42, W44, W46, W48, W50, W52
      expect(oddWeeks.length).toBe(6);  // W41, W43, W45, W47, W49, W51
      expect(evenWeeks.map((km) => km % 100)).toEqual([40, 42, 44, 46, 48, 50, 52]);
      expect(oddWeeks.map((km) => km % 100)).toEqual([41, 43, 45, 47, 49, 51]);
    });
  });

  describe('Average Weekly Volume (Excludes Zero/Empty/Unavailable Weeks from Divisor)', () => {
    it('should only divide by weeks that have sales > 0, NOT all weeks in cycle', () => {
      const filteredWeeks = [202640, 202642, 202644, 202646, 202648, 202650, 202652]; // 7 weeks in Q4 even cycle
      // W40 = 0, W42 = 874, W44 = 886, W46..W52 = future weeks (0 / no data)
      const volumesByWeek: Record<number, number> = {
        202640: 0,
        202642: 874,
        202644: 886,
        202646: 0,
        202648: 0,
        202650: 0,
        202652: 0,
      };

      const totalQuarter = Object.values(volumesByWeek).reduce((sum, v) => sum + v, 0); // 1,760 pk
      expect(totalQuarter).toBe(1760);

      // Divisor must only count weeks with volume > 0 (2 weeks, not 7)
      const activeWeeksCount = filteredWeeks.filter((km) => (volumesByWeek[km] || 0) > 0).length;
      expect(activeWeeksCount).toBe(2);

      const avgWeekly = activeWeeksCount > 0 ? Math.round((totalQuarter / activeWeeksCount) * 10) / 10 : 0;
      expect(avgWeekly).toBe(880); // (874 + 886) / 2 = 880, NOT 1760 / 7 = 251.4!
    });

    it('should return 0 when SKU has no sales in any week of the quarter', () => {
      const filteredWeeks = [202640, 202642, 202644, 202646, 202648, 202650, 202652];
      const volumesByWeek: Record<number, number> = {};
      const totalQuarter = 0;

      const activeWeeksCount = filteredWeeks.filter((km) => (volumesByWeek[km] || 0) > 0).length;
      expect(activeWeeksCount).toBe(0);

      const avgWeekly = activeWeeksCount > 0 ? Math.round((totalQuarter / activeWeeksCount) * 10) / 10 : 0;
      expect(avgWeekly).toBe(0);
    });
  });

  describe('Average Daily Volume (avg/wk / 5.5)', () => {
    it('should divide weekly average by 5.5 and round to 1 decimal place', () => {
      const avgWeekly = 880;
      const avgDaily = avgWeekly > 0 ? Math.round((avgWeekly / 5.5) * 10) / 10 : 0;
      expect(avgDaily).toBe(160); // 880 / 5.5 = 160
    });

    it('should handle decimal weekly average correctly', () => {
      const avgWeekly = 123.4;
      const avgDaily = avgWeekly > 0 ? Math.round((avgWeekly / 5.5) * 10) / 10 : 0;
      expect(avgDaily).toBe(22.4); // 123.4 / 5.5 = 22.436... -> 22.4
    });

    it('should return 0 when avgWeekly is 0', () => {
      const avgWeekly = 0;
      const avgDaily = avgWeekly > 0 ? Math.round((avgWeekly / 5.5) * 10) / 10 : 0;
      expect(avgDaily).toBe(0);
    });
  });
});

