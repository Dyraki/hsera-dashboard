import { describe, it, expect } from 'vitest';
import { BRAND_KATEGORI_OPTIONS, STATUS_DATA_OPTIONS } from './types';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { routePaths } from '@/routes/routePaths';

describe('ReportWeeklyDistrict Configurations & Constants', () => {
  it('should have Menu ID registered matching the requested UUID', () => {
    expect(SYSTEM_MENU_IDS.REPORT_WEEKLY_DISTRICT).toBe('5db9ab11-5554-40bf-8d10-8aa71ca9ede9');
  });

  it('should have route path configured properly', () => {
    expect(routePaths.salesmanshipReportWeeklyDistrict).toBe('/salesmanship/report/weekly-district');
  });

  it('should have correct 6 industry brand categories plus ALL option', () => {
    const values = BRAND_KATEGORI_OPTIONS.map((o) => o.value);
    expect(values).toContain('ALL');
    expect(values).toContain('SKM FF');
    expect(values).toContain('SKM LTLN');
    expect(values).toContain('SKT');
    expect(values).toContain('SPM');
    expect(values).toContain('SPT');
    expect(values).toContain('SKTF');
  });

  it('should have FINAL and ALL status filter options', () => {
    const values = STATUS_DATA_OPTIONS.map((o) => o.value);
    expect(values).toContain('FINAL');
    expect(values).toContain('ALL');
  });

  it('should export WeeklyNotationAnalysis component properly', async () => {
    const mod = await import('./components/WeeklyNotationAnalysis');
    expect(mod.WeeklyNotationAnalysis).toBeDefined();
  });
});
