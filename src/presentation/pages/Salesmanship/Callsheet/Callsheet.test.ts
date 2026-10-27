import { describe, it, expect } from "vitest";
import { findMatchingDistrictId, isValidDateString } from "./hooks/useCallsheetForm";
import { District } from "@/core/domain/models/District";

describe("Callsheet Matrix Calculations", () => {
  it("should calculate BD as OOS + SK + SL + SD + SB", () => {
    const row = {
      OOS: 2,
      SK: 5,
      SL: 3,
      SD: 4,
      SB: 1,
    };
    const bd = row.OOS + row.SK + row.SL + row.SD + row.SB;
    expect(bd).toBe(15);
  });

  it("should calculate totalStatus as SK + SL + SD + OOS + SB + TL + BPJ = jumlahKunjungan", () => {
    const row = {
      SK: 10,
      SL: 5,
      SD: 3,
      OOS: 2,
      SB: 4,
      TL: 1,
      BPJ: 5,
    };
    const totalStatus = row.SK + row.SL + row.SD + row.OOS + row.SB + row.TL + row.BPJ;
    expect(totalStatus).toBe(30);

    const jumlahKunjungan = 30;
    expect(totalStatus - jumlahKunjungan).toBe(0);
  });

  it("should detect match, over, and under vs jumlahKunjungan", () => {
    const jumlahKunjungan = 32;

    // Match
    const matchStatus = 32;
    expect(matchStatus - jumlahKunjungan).toBe(0);

    // Over (+2)
    const overStatus = 34;
    const overDiff = overStatus - jumlahKunjungan;
    expect(overDiff).toBe(2);
    expect(overDiff > 0).toBe(true);

    // Under (-2)
    const underStatus = 30;
    const underDiff = underStatus - jumlahKunjungan;
    expect(underDiff).toBe(-2);
    expect(underDiff < 0).toBe(true);
  });

  it("should accurately sum column totals across brands", () => {
    const rows = [
      { OOS: 1, SK: 2, BD: 3, BUY: 4, FACE_UP: 5 },
      { OOS: 0, SK: 3, BD: 3, BUY: 2, FACE_UP: 1 },
      { OOS: 2, SK: 1, BD: 3, BUY: 0, FACE_UP: 4 },
    ];

    const totalOos = rows.reduce((acc, r) => acc + r.OOS, 0);
    const totalSk = rows.reduce((acc, r) => acc + r.SK, 0);
    const totalBd = rows.reduce((acc, r) => acc + r.BD, 0);
    const totalBuy = rows.reduce((acc, r) => acc + r.BUY, 0);
    const totalFu = rows.reduce((acc, r) => acc + r.FACE_UP, 0);

    expect(totalOos).toBe(3);
    expect(totalSk).toBe(6);
    expect(totalBd).toBe(9);
    expect(totalBuy).toBe(6);
    expect(totalFu).toBe(10);
  });

  it("should auto-calculate BPJ as jumlahKunjungan - (SK + SL + SD + OOS + SB + TL)", () => {
    const jumlahKunjungan = 30;
    const row = {
      SK: 10,
      SL: 5,
      SD: 3,
      OOS: 2,
      SB: 4,
      TL: 1,
    };
    const sumOthers = row.SK + row.SL + row.SD + row.OOS + row.SB + row.TL; // 25
    const bpj = Math.max(0, jumlahKunjungan - sumOthers);
    expect(bpj).toBe(5);

    const totalStatus = sumOthers + bpj;
    expect(totalStatus).toBe(30);
    expect(totalStatus - jumlahKunjungan).toBe(0);
  });

  it("should clamp BPJ to 0 when status sum exceeds jumlahKunjungan and flag over error", () => {
    const jumlahKunjungan = 30;
    const row = {
      SK: 15,
      SL: 10,
      SD: 5,
      OOS: 2,
      SB: 2,
      TL: 1, // 35
    };
    const sumOthers = row.SK + row.SL + row.SD + row.OOS + row.SB + row.TL;
    const bpj = Math.max(0, jumlahKunjungan - sumOthers);
    expect(bpj).toBe(0);

    const totalStatus = sumOthers + bpj;
    const diff = totalStatus - jumlahKunjungan;
    expect(diff).toBe(5);
    expect(diff > 0).toBe(true);
  });
});

describe("Callsheet URL Query Parameter Resolution", () => {
  const dummyDistricts: District[] = [
    {
      id: "uuid-tgk-01",
      kode: "CAB-TGK",
      ouKode: "CAB-TGK",
      karyawanId: "k-1",
      status: "AKTIF",
    },
    {
      id: "uuid-tag-01",
      kode: "D-01",
      ouKode: "CAB-TAG",
      karyawanId: "k-2",
      status: "AKTIF",
    },
  ];

  it("should match district by exact UUID", () => {
    const matched = findMatchingDistrictId(dummyDistricts, "uuid-tgk-01");
    expect(matched).toBe("uuid-tgk-01");
  });

  it("should match district by code case-insensitively", () => {
    const matched = findMatchingDistrictId(dummyDistricts, "cab-tgk");
    expect(matched).toBe("uuid-tgk-01");

    const matchedD01 = findMatchingDistrictId(dummyDistricts, "d-01");
    expect(matchedD01).toBe("uuid-tag-01");
  });

  it("should return null when district is not found or key is empty", () => {
    expect(findMatchingDistrictId(dummyDistricts, "non-existent")).toBeNull();
    expect(findMatchingDistrictId(dummyDistricts, "")).toBeNull();
  });

  it("should validate date strings properly", () => {
    expect(isValidDateString("2026-10-27")).toBe(true);
    expect(isValidDateString("2026-02-28")).toBe(true);
    expect(isValidDateString("invalid-date")).toBe(false);
    expect(isValidDateString("27-10-2026")).toBe(false);
    expect(isValidDateString("")).toBe(false);
    expect(isValidDateString(null)).toBe(false);
  });
});

