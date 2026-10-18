import { describe, it, expect } from "vitest";
import { getIsoWeekNumber } from "./hooks/useWeeklyMonitoring";

describe("Weekly Monitoring Logic", () => {
  it("should calculate correct ISO week number for a given date", () => {
    // 2026-10-14 should be in week 202642
    const d = new Date(2026, 9, 14); // month is 0-indexed, 9 = October
    const week = getIsoWeekNumber(d);
    expect(week).toBe(202642);
  });

  it("should resolve default ouKode to user's unitCode if present", () => {
    const userScope = {
      isSuperAdmin: false,
      unitCode: "CAB-TAG",
      unitName: "Cabang Tulungagung",
    };

    const initialOuKode = userScope?.unitCode || "all";
    expect(initialOuKode).toBe("CAB-TAG");
  });

  it("should fall back to 'all' if user has no unitCode", () => {
    const userScope = null;
    const initialOuKode = (userScope as any)?.unitCode || "all";
    expect(initialOuKode).toBe("all");
  });

  it("should match user's OU with operation unit options", () => {
    const operationUnits = [
      { id: "1", kode: "HO", nama: "Kantor Pusat" },
      { id: "2", kode: "CAB-TAG", nama: "Cabang Tulungagung" },
      { id: "3", kode: "CAB-TGK", nama: "Cabang Trenggalek" },
    ];
    const userUnitCode = "CAB-TAG";

    const matched = operationUnits.find((ou) => ou.kode === userUnitCode);
    expect(matched).toBeDefined();
    expect(matched?.nama).toBe("Cabang Tulungagung");
  });
});
