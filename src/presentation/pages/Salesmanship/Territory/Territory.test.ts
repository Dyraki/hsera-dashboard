import { describe, it, expect } from "vitest";
import { District } from "@/core/domain/models/District";

describe("Territory District NIP Display", () => {
  it("should format NIP when karyawanNip is provided", () => {
    const district: District = {
      id: "dist-01",
      kode: "D-01",
      ouKode: "CAB-TAG",
      karyawanId: "50034b65-189d-4a22-a061-dac904aa7fa2",
      karyawanName: "DADANG TRI MAHENDRA",
      karyawanNip: "202609229",
      status: "AKTIF",
    };

    const displayNip = district.karyawanNip
      ? `NIP: ${district.karyawanNip}`
      : district.karyawanId
      ? `ID: ${district.karyawanId}`
      : "-";

    expect(displayNip).toBe("NIP: 202609229");
  });

  it("should gracefully fall back to ID if karyawanNip is absent", () => {
    const district: District = {
      id: "dist-02",
      kode: "D-02",
      ouKode: "CAB-TAG",
      karyawanId: "50034b65-189d-4a22-a061-dac904aa7fa2",
      karyawanName: "DADANG TRI MAHENDRA",
      status: "AKTIF",
    };

    const displayNip = district.karyawanNip
      ? `NIP: ${district.karyawanNip}`
      : district.karyawanId
      ? `ID: ${district.karyawanId}`
      : "-";

    expect(displayNip).toBe("ID: 50034b65-189d-4a22-a061-dac904aa7fa2");
  });
});

describe("Territory Pagination Slicing and Calculations", () => {
  const dummyDistricts: District[] = Array.from({ length: 25 }, (_, i) => ({
    id: `dist-${i + 1}`,
    kode: `D-${String(i + 1).padStart(2, '0')}`,
    ouKode: i % 2 === 0 ? "CAB-TAG" : "CAB-TGK",
    karyawanId: `karyawan-${i + 1}`,
    status: "AKTIF",
  }));

  it("should correctly compute totalPages for given pageSize", () => {
    const totalItems = dummyDistricts.length; // 25
    const pageSize10 = 10;
    const totalPages10 = Math.max(1, Math.ceil(totalItems / pageSize10));
    expect(totalPages10).toBe(3);

    const pageSize50 = 50;
    const totalPages50 = Math.max(1, Math.ceil(totalItems / pageSize50));
    expect(totalPages50).toBe(1);
  });

  it("should slice districts correctly for page 1 and page 2", () => {
    const pageSize = 10;

    const page1Districts = dummyDistricts.slice((1 - 1) * pageSize, 1 * pageSize);
    expect(page1Districts.length).toBe(10);
    expect(page1Districts[0].kode).toBe("D-01");
    expect(page1Districts[9].kode).toBe("D-10");

    const page2Districts = dummyDistricts.slice((2 - 1) * pageSize, 2 * pageSize);
    expect(page2Districts.length).toBe(10);
    expect(page2Districts[0].kode).toBe("D-11");
    expect(page2Districts[9].kode).toBe("D-20");

    const page3Districts = dummyDistricts.slice((3 - 1) * pageSize, 3 * pageSize);
    expect(page3Districts.length).toBe(5);
    expect(page3Districts[0].kode).toBe("D-21");
    expect(page3Districts[4].kode).toBe("D-25");
  });

  it("should clamp safePage within [1, totalPages]", () => {
    const totalItems = dummyDistricts.length;
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize)); // 3

    const pageOverflow = 10;
    const safePageOver = Math.min(Math.max(1, pageOverflow), totalPages);
    expect(safePageOver).toBe(3);

    const pageUnderflow = -2;
    const safePageUnder = Math.min(Math.max(1, pageUnderflow), totalPages);
    expect(safePageUnder).toBe(1);
  });
});

