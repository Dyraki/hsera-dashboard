import { describe, it, expect } from 'vitest';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { routePaths } from '@/routes/routePaths';
import { KpiParameterMetric } from '@/core/domain/models/ReportKpi';

describe('Report KPI Domain & Metric Logic', () => {
  it('should have correct SYSTEM_MENU_IDS and route path for Report KPI', () => {
    expect(SYSTEM_MENU_IDS.REPORT_KPI).toBe('70375d06-53ca-4ce8-bf5f-bf42b2caeaa2');
    expect(routePaths.salesmanshipReportKpi).toBe('/salesmanship/report/kpi');
  });

  describe('KPI Metric Calculations (Realisasi vs Target)', () => {
    const calculateMetric = (realisasi: number, target: number): KpiParameterMetric => {
      const achievementPercent = target > 0 ? Math.round((realisasi / target) * 1000) / 10 : 0;
      const gap = realisasi - target;
      let status: 'ACHIEVED' | 'ON_TRACK' | 'UNDER_TARGET' | 'CRITICAL' = 'ON_TRACK';

      if (achievementPercent >= 100) status = 'ACHIEVED';
      else if (achievementPercent >= 85) status = 'ON_TRACK';
      else if (achievementPercent >= 70) status = 'UNDER_TARGET';
      else status = 'CRITICAL';

      return {
        target: Math.round(target * 10) / 10,
        realisasi: Math.round(realisasi * 10) / 10,
        achievementPercent,
        gap: Math.round(gap * 10) / 10,
        status,
      };
    };

    it('should determine ACHIEVED status when achievement is >= 100%', () => {
      const res = calculateMetric(450, 400);
      expect(res.achievementPercent).toBe(112.5);
      expect(res.gap).toBe(50);
      expect(res.status).toBe('ACHIEVED');
    });

    it('should determine ON_TRACK status when achievement is 85% to 99.9%', () => {
      const res = calculateMetric(360, 400);
      expect(res.achievementPercent).toBe(90.0);
      expect(res.gap).toBe(-40);
      expect(res.status).toBe('ON_TRACK');
    });

    it('should determine UNDER_TARGET status when achievement is 70% to 84.9%', () => {
      const res = calculateMetric(300, 400);
      expect(res.achievementPercent).toBe(75.0);
      expect(res.gap).toBe(-100);
      expect(res.status).toBe('UNDER_TARGET');
    });

    it('should determine CRITICAL status when achievement is < 70%', () => {
      const res = calculateMetric(240, 400);
      expect(res.achievementPercent).toBe(60.0);
      expect(res.gap).toBe(-160);
      expect(res.status).toBe('CRITICAL');
    });

    it('should handle zero target safely without division by zero', () => {
      const res = calculateMetric(100, 0);
      expect(res.achievementPercent).toBe(0);
      expect(res.gap).toBe(100);
      expect(res.status).toBe('CRITICAL');
    });
  });

  describe('Cycle & Week Partitioning', () => {
    const q4Weeks = [
      202640, 202641, 202642, 202643, 202644, 202645,
      202646, 202647, 202648, 202649, 202650, 202651, 202652,
    ];

    it('should filter ALL weeks correctly in Q4', () => {
      expect(q4Weeks.length).toBe(13);
    });

    it('should filter EVEN weeks correctly in Q4 (W40, W42, W44, W46, W48, W50, W52)', () => {
      const even = q4Weeks.filter((km) => (km % 100) % 2 === 0);
      expect(even.length).toBe(7);
      expect(even.map((km) => km % 100)).toEqual([40, 42, 44, 46, 48, 50, 52]);
    });

    it('should filter ODD weeks correctly in Q4 (W41, W43, W45, W47, W49, W51)', () => {
      const odd = q4Weeks.filter((km) => (km % 100) % 2 !== 0);
      expect(odd.length).toBe(6);
      expect(odd.map((km) => km % 100)).toEqual([41, 43, 45, 47, 49, 51]);
    });
  });

  describe('Best & Worst Week Identification', () => {
    it('should identify the highest and lowest achievement weeks', () => {
      const weeksData = [
        { weekNumber: 40, real: 320, target: 400 }, // 80%
        { weekNumber: 41, real: 420, target: 400 }, // 105%
        { weekNumber: 42, real: 380, target: 400 }, // 95%
        { weekNumber: 43, real: 260, target: 400 }, // 65%
      ];

      let bestWeek = { weekNumber: 0, achievement: -Infinity };
      let worstWeek = { weekNumber: 0, achievement: Infinity };

      weeksData.forEach((w) => {
        const ach = Math.round((w.real / w.target) * 1000) / 10;
        if (ach > bestWeek.achievement) bestWeek = { weekNumber: w.weekNumber, achievement: ach };
        if (ach < worstWeek.achievement) worstWeek = { weekNumber: w.weekNumber, achievement: ach };
      });

      expect(bestWeek.weekNumber).toBe(41);
      expect(bestWeek.achievement).toBe(105);
      expect(worstWeek.weekNumber).toBe(43);
      expect(worstWeek.achievement).toBe(65);
    });
  });
});
