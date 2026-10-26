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
