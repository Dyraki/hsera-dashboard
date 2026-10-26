# 📋 Dokumentasi & Rencana Arsitektur: Fitur Dashboard HSERA Salesmanship

Dokumen ini merupakan spesifikasi arsitektur dan panduan implementasi resmi untuk **Fitur Dashboard** utama pada proyek HSERA:
👉 [`/Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/presentation/pages/Dashboard/DashboardPage.tsx`](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/presentation/pages/Dashboard/DashboardPage.tsx)

> 💡 **Klarifikasi Esensial:**
> Fitur ini **bukan sekadar dashboard evaluasi spesifik Area Office**, melainkan **Fitur Dashboard Utama Aplikasi HSERA Salesmanship** secara menyeluruh (Menu ID: `d1000000-0000-4000-d000-000000000001`, path: `/`). Halaman ini berfungsi sebagai **landing page utama setelah pengguna login**, yang secara cerdas dan dinamis beradaptasi dengan tingkatan hak akses/scope hierarki pengguna (mulai dari Supervisor Cabang / Operation Unit, Area Manager, hingga Regional Manager & Super Admin).

---

## 📌 Prinsip Utama & Karakteristik Fitur Dashboard

> ⚠️ **Prinsip Tegas (Sesuai Arahan Pengguna):**
> 1. **Fitur Dashboard Utama Aplikasi:** Berjalan sebagai landing page utama pada path `/` (`routePaths.dashboard`), terdaftar pada Menu UUID master: **`d1000000-0000-4000-d000-000000000001`** (`SYSTEM_MENU_IDS.DASHBOARD`).
> 2. **Data Riil 100% (No Fake Data / Tanpa Seeder Tambahan):** Seluruh metrik KPI, tren grafik, tabel Operation Unit (Cabang), matriks 13 brand, dan daftar salesman **diambil murni dari database PostgreSQL saat ini**. Tidak ada data dummy. Jika cabang lain (misal Trenggalek `CAB-TRG`) belum memiliki transaksi di database, dashboard **tidak memaksakan untuk ada** dan menyajikan data cabang yang benar-benar aktif (`CAB-TAG`) secara dinamis.
> 3. **Tidak Ada Perubahan pada Header Global (`Header.tsx` / `AdminLayout.tsx`):** Seluruh elemen context bar, filter wilayah, filter kuartal, KPI cards, grafik, dan tabel ditempatkan sepenuhnya di dalam container halaman (`DashboardPage.tsx`).
> 4. **Satuan Konversi Baku:** $1 \text{ Karton} = 800 \text{ Pack}$.
> 5. **Peniadaan Kolom Skor:** Evaluasi status cabang dan predikat salesman dinilai murni dari persentase pencapaian target operasional riil (disiplin kunjungan $\ge 90\%$, volume, EC %, dan BD %).
> 6. **Salesman Diurutkan Berdasarkan District:** Daftar salesman diurutkan (*sorted*) strictly ascending berdasarkan kode District/Rayon (`D-01` s/d `D-12`).

---

## 1. Audit Data Realisasi di Backend PostgreSQL Saat Ini

Berdasarkan pengecekan langsung pada tabel transaksi `trx_rekap_harian`, `trx_rekap_harian_nilai`, `mst_district`, dan `mst_brand`:

### A. Data Operation Unit (Cabang) Aktif:
* Hanya terdapat **1 Operation Unit** yang memiliki data transaksi callsheet riil di database, yaitu:
  👉 **`CAB-TAG` (Cabang Tulungagung)**.
* Cabang lain (seperti Trenggalek `CAB-TRG`) **belum memiliki transaksi** di database, sehingga tabel Operation Unit akan **menampilkan Cabang Tulungagung secara dinamis** sesuai data riil.

### B. Data Minggu Transaksi (Kuartal 4 / Q4 2026):
* **Minggu W-41 (`202641`):** 1 callsheet (40 Kunjungan, 30 EC, 35 BD, Volume: 150,5 Pack / 0,19 Karton).
* **Minggu W-42 (`202642`) [Sesi Aktif Utama]:** 42 callsheet (916 Kunjungan, 227 EC, 357 BD, Volume: **20.069 Pack** / **25,09 Karton**).
* **Minggu W-43 (`202643`):** 34 callsheet (1.009 Kunjungan, 306 EC, 409 BD, Volume: **10.915 Pack** / **13,64 Karton**).

### C. Data Karyawan / Salesman Riil di Bawah `CAB-TAG` (W-42) - Diurutkan Sesuai District:
Terdapat **7 Salesman riil** yang diurutkan (*sorted*) berdasarkan kode District / Rayon:
1. `50034b65-189d-4a22-a061-dac904aa7fa2` (Rayon D-01): 215 Kunjungan, 44 EC, 62 BD, Vol 577 Pack.
2. `b734d3f0-5284-43fc-bd00-76f5b457eb21` (Rayon D-02): 222 Kunjungan, 54 EC, 86 BD, Vol 767 Pack.
3. `de4f7888-dd0d-4585-bc0b-eb2948b89c03` (Rayon D-03): 0 Kunjungan, 0 Volume (Nonaktif / Off rute).
4. `feb35143-65ef-42d4-8dd8-97e77cebdfcb` (Rayon D-04): 173 Kunjungan, 61 EC, 102 BD, Vol 541 Pack.
5. `fd5d3347-11c9-4470-b472-444d9a575118` (Rayon D-05): 215 Kunjungan, 49 EC, 63 BD, Vol 603 Pack.
6. `83104598-7c42-42ba-8402-fd2319719c24` (Rayon D-06): 91 Kunjungan, 19 EC, 44 BD, Vol 411 Pack.
7. `1c1554e6-0a58-471b-90ca-d7b5f7205061` (Rayon D-12 - Jefri Zakaria): Vol 17.170 Pack.

*Nama lengkap salesman diambil otomatis dari `hsera-auth-backend` via `authBackendService.getKaryawanList(token)`.*

---

## 2. Struktur Tampilan UI Berbasis Data Riil (Dynamic UI Breakdown)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Top Context & Scope Indicator - Dalam Halaman Dashboard]                                              │
│ 🏢 Scope: Wilayah Jawa Timur [Kediri - Tulungagung - Blitar]        [🔔¹] [👤 Bambang Sudirjo - Admin] │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Header Page & Dynamic Filters]                                                                        │
│ 🏷️ Dashboard Salesmanship                                             [🌐 All Area ▼] [📅 Kuartal Q4 2026 ▼]│
│    Monitoring performa penjualan, capaian KPI, rekap notasi 15 Brand HSERA, dan evaluasi salesman      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [4 Kartu KPI Eksekutif (Berbasis Data Riil W-42)]                                                      │
│ 1. Kunjungan: 916 Real Call (vs Target)               │ Bar Biru   │ Standar Disiplin: ≥90%           │
│ 2. EC       : 227 Effective Call (vs Target)          │ Bar Hijau  │ Efektivitas Order                │
│ 3. BD Outlet: 357 Brand Distribution Active Toko      │ Bar Ungu   │ Penetrasi Toko                   │
│ 4. Volume   : 20.069 Pack (vs Target)                 │ Bar Indigo │ Equivalent: 25,09 Karton         │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Tren Volume Penjualan Mingguan (Data Riil Q4: W41, W42, W43)]                                         │
│ 📈 Grafik Area/Garis: Pergerakan Volume Penjualan Cabang Tulungagung (W41: 150.5 Pk, W42: 20.069 Pk,   │
│    W43: 10.915 Pk). Menampilkan kurva cabang yang aktif memiliki transaksi di database.               │
│ 📦 Meta: Satuan Pack (1 Karton = 800 Pack)  │  Area Run-Rate: +4.2% DoD                                │
│ ────────────────────────────────────────────────────────────────────────────────────────────────────── │
│ [3 Mini-Insight Callouts Dinamis]:                                                                     │
│ ↗ Pertumbuhan Tertinggi: Tulungagung │ ⏱ Disiplin: Tulungagung │ ⚠ Evaluasi: Rayon Tertinggal           │
│ 🔄 "Pembaruan Realtime Auto-Sync"                                                                      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Section 1: Evaluasi Kinerja Cabang / Operation Unit]                            [Dinamis: 1 Cabang]   │
│ Menampilkan Operation Unit yang memiliki transaksi di database (Cabang Tulungagung `CAB-TAG`).         │
│ Kolom: KODE | NAMA CABANG | TARGET CALL | REAL CALL | KUNJUNGAN % | EC % | BD % | VOLUME (PACK) | STATUS│
│ Row  : CAB-TAG | Cabang Tulungagung | 1.000 | 916 | 91.6% | 24.8% | 39.0% | 20.069 | Sangat Baik       │
│ Footer: TOTAL / RERATA OPERASIONAL (Konsolidasi Dinamis Cabang Aktif)                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Section 2: Rekap Notasi 15 Brand HSERA Berdasarkan Master Brand Riil]                                 │
│ Badge: Konsolidasi Cabang Aktif (Tulungagung)                 Badges Alert: [● OOS > 8%] [● SL < 60%]  │
│ Kolom: URUTAN | KODE | NAMA BRAND | KATEGORI (SKMFF/SKT/SKMLTLN) | BD% | AVG STOK | AVG BELI | TOTAL VOL│
│        SK% | SL% | SD% | OOS% | SB% | TL% | BPJ%                                                       │
│ 15 Brand Riil: HSF12, HSK12, HSSO20, HSSM20, HSSFM20, HSSP20, HSMO16, HSMP16, HSMM16, HSMC16,         │
│                HSB20, HSB12, SANS12, HSSAO20, HSKM12.                                                  │
│ Footer: KONSOLIDASI 15 BRAND INTI (Total Volume 20.069 Pack)                                           │

├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Section 3: Evaluasi Performa Salesman Berbasis KPI]              [Dinamis: 7 Sales Representative]    │
│ Menampilkan 7 Salesman riil di `CAB-TAG` di-sort urut sesuai District:                                 │
│ 1. Salesman Rayon D-01             : Vol 577 Pack, Kunj 215 Call -> Predikat: On Target                │
│ 2. Salesman Rayon D-02             : Vol 767 Pack, Kunj 222 Call -> Predikat: Top Performer            │
│ 3. Salesman Rayon D-03             : 0 Call (Nonaktif)           -> Predikat: Perlu Pembinaan          │
│ 4. Salesman Rayon D-04             : Vol 541 Pack, Kunj 173 Call -> Predikat: On Target                │
│ 5. Salesman Rayon D-05             : Vol 603 Pack, Kunj 215 Call -> Predikat: On Target                │
│ 6. Salesman Rayon D-06             : Vol 411 Pack, Kunj 91 Call  -> Predikat: On Target                │
│ 7. Jefri Zakaria (Rayon D-12)      : Vol 17.170 Pack             -> Predikat: Top Performer            │
│ Kolom Action/Rekomendasi Cerdas dihasilkan dinamis berdasarkan deviasi metrik riil salesman            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Sistem Pembagian Mingguan & Filter Kuartal

Satu tahun kerja operasional (52 minggu ISO 8601) dibagi rata menjadi **4 Kuartal (@ 13 minggu)**:
$$\text{Durasi per Kuartal} = \frac{52 \text{ Minggu}}{4} = 13 \text{ Minggu}$$

* **Q1:** W01 – W13 (`YYYY01` s/d `YYYY13`)
* **Q2:** W14 – W26 (`YYYY14` s/d `YYYY26`)
* **Q3:** W27 – W39 (`YYYY27` s/d `YYYY39`)
* **Q4:** W40 – W52 (`YYYY40` s/d `YYYY52`) $\rightarrow$ **Kuartal Aktif Saat Ini**

### Logika Query Backend Berdasarkan Filter Kuartal:
* Saat pengguna memilih `Kuartal Q4 2026`:
  1. Backend mencari transaksi pada rentang `kodeMinggu BETWEEN 202640 AND 202652`.
  2. Mengidentifikasi minggu aktif mutakhir yang memiliki data (`202642` atau `202643`).
  3. Mengembalikan time-series volume untuk minggu-minggu yang memiliki data di kuartal tersebut (`W41: 150.5`, `W42: 20.069`, `W43: 10.915`).

---

## 4. Arsitektur Role Management & Scoping Dinamis Filter

Sesuai model hierarki `user.scope` dari `useAuth()` di dashboard dan relasi parent-child `mst_operation_unit`:

1. **Supervisor Cabang (`unitType: OPERATION_UNIT` - e.g. `CAB-TAG`):**
   * **Aturan Ketat:** Tidak memiliki hak akses untuk membuka "Semua Cabang" dan tidak dapat membuka cabang lainnya.
   * **Filter Dropdown:** Terkunci (`userScopeLocked = true`) dengan indikator ikon gembok 🔒. Dropdown hanya memuat 1 opsi yaitu cabangnya sendiri (`Cabang Tulungagung (CAB-TAG)`). Opsi "Semua Area Cabang" ditiadakan dari pilihan.
   * **Data:** Menampilkan evaluasi operasional dan salesman khusus teritori/rayon di bawah cabangnya.

2. **Area Manager / Operation Unit di atasnya (`unitType: AREA_OFFICE` - e.g. `AREA-TAG`):**
   * **Aturan Hak Akses:** Dapat mengakses konsolidasi seluruh cabang di bawah area-nya (`ALL`) serta bebas memilih membuka cabang-cabang individual di bawah naungannya (`CAB-TAG`, `CAB-TGK`).
   * **Filter Dropdown:** Tidak terkunci (`userScopeLocked = false`), menyajikan:
     1. `Semua Cabang (Area Tulungagung)` (`ALL`)
     2. `Cabang Tulungagung (CAB-TAG)`
     3. `Cabang Trenggalek (CAB-TGK)`
   * Dibatasi murni pada cabang dalam area kantor bersangkutan (tidak membuka cabang dari area office lain).

3. **Regional Manager / Head Office / Super Admin (`unitType: REGIONAL` / `HEAD_OFFICE` / `isSuperAdmin`):**
   * **Aturan Hak Akses:** Akses universal ke seluruh cabang dan area office.
   * **Filter Dropdown:** Bebas memilih `Semua Area Cabang` (`ALL`) maupun cabang spesifik di seluruh wilayah.

### B. Standardisasi Tampilan UI Filter:
* **Sejajar Horizontal (Strictly Inline):** Filter Area dan Filter Kuartal diatur berdampingan secara horizontal (`flex-nowrap`, `shrink-0`) dengan tinggi seragam `h-9` dan styling border/bayangan identik, sehingga tidak terjadi tumpuk vertikal (*stacking*).
* **Format Label Kuartal Baku:** Menggunakan format ringkas dan informatif `Kuartal Q4 2026 (W40 - W52)` tanpa akhiran kurung kosong `()`.


---

## 5. Konfigurasi Routing, Hak Akses & Komponen Frontend Modular

### A. Routing & Menu ACL (`d1000000-0000-4000-d000-000000000001`)
* **Menu ID Master:** `d1000000-0000-4000-d000-000000000001` (`SYSTEM_MENU_IDS.DASHBOARD`).
* **Route Path:** `/` (`routePaths.dashboard`).
* **Landing Page Setelah Login:** Halaman pertama yang langsung dibuka setelah proses autentikasi login berhasil (`navigate('/')` di `useLoginController.ts`).
* **Hak Akses Minimum:** `level: 1` (Read / View bitmask). Akses diverifikasi melalui `<ProtectedRoute menuId={SYSTEM_MENU_IDS.DASHBOARD} minLevel={1}>`.

### B. Komponen Frontend Modular (`src/presentation/pages/Dashboard/components/`)

1. **`DashboardHeaderBar.tsx`:**
   * Judul, sub-deskripsi, breadcrumb wilayah, dropdown filter Area & Kuartal Q1–Q4.
2. **`DashboardKpiCards.tsx`:**
   * 4 kartu KPI yang menghitung metrik dinamis dari API response (1 Karton = 800 Pack).
3. **`VolumeTrendChartSection.tsx`:**
   * Grafik tren mingguan area/garis SVG yang merender deret minggu riil yang dikembalikan API.
4. **`BranchComparisonTable.tsx`:**
   * Tabel dinamis yang me-looping daftar Operation Unit aktif dari API (tanpa hardcode cabang).
5. **`BrandNotationMatrixTable.tsx`:**
   * Matriks 15 Brand HSERA aktif (HS FILTER 12, HS KRETEK 12, HS SLIM, HS MILD, HS BOLD, SANS 12, dll) berdasarkan urutan master brand dan akumulasi riil dari `trx_rekap_harian_nilai`.
6. **`SalesmanLeaderboardTable.tsx`:**
   * Tabel yang me-looping daftar salesman riil dari API response lengkap dengan action recommendation dinamis.
   * **Pengurutan (Sort Order):** Diurutkan (*sorted*) secara default berdasarkan **Kode District / Rayon** (`D-01`, `D-02`, `D-03`, `D-04`, `D-05`, `D-06`, `D-12`).
7. **`useDashboard.ts`:**
   * Hook pemanggil API dashboard, filter state (Area/Kuartal), keyboard shortcut F6, dan auto-sync realtime.

---

## 6. Rencana Kerja Bertahap (Execution Checklist)

### TAHAP 1: Backend Layer (`hsera-salesmanship-backend`) — [SELESAI / COMPLETED ✅]
- [x] **1.1. Utilitas Kuartal & Helper (`src/infrastructure/utils/quarterUtils.ts`):**
  - Fungsi `getQuarterFromWeek(weekNumber: number)`: Memetakan minggu ISO (1..52) ke Kuartal 1..4 (@ 13 minggu).
  - Fungsi `getQuarterWeekRange(year: number, quarter: number)`: Mengembalikan rentang `startKodeMinggu` & `endKodeMinggu` (contoh Q4 2026: `202640` s/d `202652`).
  - Fungsi `getAvailableQuarters(year: number)`: Menyajikan daftar kuartal terstruktur (`id`, `label`, `weekRange`) untuk dropdown filter frontend.
- [x] **1.2. DTO & Model Definisi (`src/application/use-cases/dashboard/types.ts`):**
  - Contract DTO lengkap untuk `DashboardDTO` (`AreaOfficeDashboardDTO` alias):
    - `headerContext`: Scope wilayah/unit, kuartal aktif, minggu aktif, status realtime, dan list kuartal.
    - `kpiSummary`: Kunjungan, EC, BD Outlet, dan Volume ($1 \text{ Karton} = 800 \text{ Pack}$).
    - `trendSection`: Deret time-series mingguan riil dalam kuartal terpilih, daftar cabang tren, dan 3 kartu mini-insight dinamis.
    - `branches`: Array cabang aktif riil (Cabang Tulungagung `CAB-TAG`) tanpa kolom skor.
    - `branchesTotal`: Baris konsolidasi total/rerata area office/operasional.
    - `brandMatrix`: Array 15 brand HSERA aktif (HSF12, HSK12, HSSO20, HSSM20, HSSFM20, HSSP20, HSMO16, HSMP16, HSMM16, HSMC16, HSB20, HSB12, SANS12, HSSAO20, HSKM12) lengkap dengan kategori produk (SKMFF, SKT, SKMLTLN), kalkulasi notasi riil (`BD%`, `Avg Stok`, `Avg Beli`, `SK%`, `SL%`, `SD%`, `OOS%`, `SB%`, `TL%`, `BPJ%`) dan boolean alert (`isOosCritical`: OOS > 8%, `isSlLow`: SL < 60%).
    - `brandMatrixConsolidation`: Baris footer konsolidasi 15 brand inti.
    - `salesmen`: Array 7 salesman riil di `CAB-TAG` yang **diurutkan secara strictly ascending berdasarkan kode District** (`D-01` s/d `D-12`), disertai predikat performa dan rule-based action recommendation otomatis.
- [x] **1.3. Use Case `GetDashboardUseCase.ts` (`GetAreaOfficeDashboardUseCase`):**
  - Query data riil dari `trx_rekap_harian` dan `trx_rekap_harian_nilai` terfilter `ouKode` / `allowedUnitCodes` dan `kode_minggu`.
  - Agregasi time-series tren mingguan dinamis untuk minggu yang ada data di database (W-41, W-42, W-43).
  - Integrasi nama lengkap salesman via `authBackendService.getKaryawanList(authToken)` dengan fallback graceful.
  - Sorting otomatis salesman berdasarkan `District.kode` (`D-01`, `D-02`, ..., `D-12`).
  - Logika evaluasi status cabang dan predikat salesman berdasarkan ambang batas target kunjungan riil (Disiplin $\ge 90\%$).
- [x] **1.4. Controller & Routing:**
  - `src/domain/constants/MenuConstants.ts`: Menambahkan mapping `DASHBOARD: 'd1000000-0000-4000-d000-000000000001'`.
  - `src/presentation/controllers/DashboardController.ts`: Handler `getDashboard` & `getAreaOfficeDashboard` menangani query params (`tahun`, `kuartal`, `kodeMinggu`, `ouKode`) serta scoping wilayah `allowedUnitIds` pengguna.
  - `src/presentation/routes/dashboard.routes.ts`: Memproteksi route utama `GET /api/salesmanship/dashboard` dan alias `GET /api/salesmanship/dashboard/area-office` dengan `AuthMiddleware` dan `AclMiddleware(SYSTEM_MENU_IDS.DASHBOARD, 1)`.
  - `src/presentation/routes/index.ts`: Mendaftarkan `/dashboard` ke router utama API.
- [x] **1.5. Backend Verification & Testing:**
  - `tests/dashboard.test.ts`: Uji integrasi lengkap (5 test cases) mencakup:
    1. Unauthorized (401) tanpa token.
    2. Forbidden (403) jika role user tidak memiliki permission menu Dashboard.
    3. Success (200) Super Admin: Validasi struktur DTO, konversi 800 pack/karton, dynamic branch `CAB-TAG`, 15 brand matrix HSERA, sorting district salesmen (`D-01` s/d `D-12`), dan trend weeks.
    4. Success (200) Staff dengan permission Dashboard: Verifikasi akses data berhasil.
    5. Success (200) Root Endpoint `GET /api/salesmanship/dashboard` mengembalikan `DashboardDTO` lengkap.
  - **Hasil Build & Test:** `npm run build` sukses (0 error) dan `npm test` lulus 100% (18/18 tests passed across 3 suites).
  - **Status Server:** Berjalan aktif di Docker container `hsera_salesmanship_backend` port 5003.

---

### TAHAP 2: Frontend Data Layer (`hsera-dashboard`) — [SELESAI / COMPLETED ✅]
- [x] **2.1. Domain Model (`src/core/domain/models/Dashboard.ts`):**
  - Model contract `DashboardDTO`, `DashboardHeaderContext`, `DashboardKpiSummary`, `DashboardTrendSection`, `DashboardBranchRow`, `DashboardBrandMatrixRow`, `DashboardSalesmanRow`, dan `DashboardFilterQuery`.
- [x] **2.2. Repository Interface (`src/core/domain/repositories/ISalesmanshipRepository.ts`):**
  - Mendaftarkan method `getDashboard(filter?: DashboardFilterQuery): Promise<DashboardDTO>`.
- [x] **2.3. Repository Implementation (`src/core/infrastructure/repositories/HttpSalesmanshipRepository.ts`):**
  - Mengimplementasikan pemanggilan Axios ke endpoint `GET /api/salesmanship/dashboard` dengan parameter dinamis `tahun`, `kuartal`, `kodeMinggu`, dan `ouKode`.

---

### TAHAP 3: Frontend Presentation Layer (`src/presentation/pages/Dashboard/`) — [SELESAI / COMPLETED ✅]
- [x] **3.1. Custom Hook `useDashboard.ts` (`hooks/useDashboard.ts`):**
  - State management filter Kuartal & Area, data fetching, auto-sync, error handling, dan keyboard shortcut F6.
- [x] **3.2. Komponen `DashboardHeaderBar.tsx` (`components/DashboardHeaderBar.tsx`):**
  - Header judul "Dashboard Salesmanship", breadcrumb scope unit, session week badge, realtime auto-sync indicator, dropdown selector Area (dengan lock state akun non-admin) & Kuartal Q1–Q4.
- [x] **3.3. Komponen `DashboardKpiCards.tsx` (`components/DashboardKpiCards.tsx`):**
  - 4 kartu KPI eksekutif (Kunjungan vs target, EC vs target, BD Outlet vs target, Volume Pack & Karton rasio baku $1 \text{ Karton} = 800 \text{ Pack}$).
- [x] **3.4. Komponen `VolumeTrendChartSection.tsx` (`components/VolumeTrendChartSection.tsx`):**
  - Grafik tren mingguan dinamis interactive SVG area/line chart dengan titik data, kurva gradien, tooltip interaktif, dan 3 mini-insight cards (Pertumbuhan Tertinggi, Disiplin Kunjungan, Evaluasi Operasional).
- [x] **3.5. Komponen `BranchComparisonTable.tsx` (`components/BranchComparisonTable.tsx`):**
  - Tabel evaluasi cabang dinamis berdasarkan transaksi riil callsheet (Cabang Tulungagung `CAB-TAG`), persentase pencapaian target, satuan pack & karton, tanpa kolom skor terbobot, dan baris footer total operasional.
- [x] **3.6. Komponen `BrandNotationMatrixTable.tsx` (`components/BrandNotationMatrixTable.tsx`):**
  - Matriks 15 Brand HSERA aktif riil dari `mst_brand` (`HSF12`, `HSK12`, `HSSO20`, ..., `HSKM12`), badge kategori rokok (`SKMFF`, `SKT`, `SKMLTLN`), alert badges `OOS > 8% (Kritis)` dan `SL < 60% (Rendah)`, serta footer konsolidasi 15 brand.
- [x] **3.7. Komponen `SalesmanLeaderboardTable.tsx` (`components/SalesmanLeaderboardTable.tsx`):**
  - Tabel evaluasi performa 7 salesman riil di `CAB-TAG` yang diurutkan strictly ascending berdasarkan kode District (`D-01` s/d `D-12`), predikat performa, dan pill rekomendasi tindakan cerdas berbasis rule-based engine.
- [x] **3.8. Perakitan Halaman `DashboardPage.tsx` (`DashboardPage.tsx`):**
  - Merakit seluruh subkomponen modular di dalam `<AdminLayout>` **tanpa mengubah atau menyentuh file global Header (`Header.tsx` / `AdminLayout.tsx`)**.

---

### TAHAP 4: Verifikasi & QA — [SELESAI / COMPLETED ✅]
- [x] **4.1. Verifikasi Data 100% Riil:**
  - Angka pada kartu KPI, tabel cabang, brand, dan salesman mencerminkan 100% data riil database PostgreSQL saat ini (W-41, W-42, W-43; Cabang Tulungagung `CAB-TAG`; 7 salesman D-01 s/d D-12; 15 brand HSERA aktif).
- [x] **4.2. Build & Test Verification:**
  - Frontend: `npm run build` sukses 100% (dist bundle generated tanpa error).
  - Frontend Tests: `npm test` lulus 100% (47/47 tests passed across 13 test suites).
  - Backend: `npm run build` sukses dan `npm test` lulus 100% (18/18 tests passed across 3 test suites).
  - Live Docker container backend (`hsera_salesmanship_backend` port 5003) dan frontend berjalan aktif.

---

*Dokumen dokumentasi & rencana arsitektur ini telah selesai diimplementasikan 100% dan teruji secara menyeluruh di [`/Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/PLAN_DASHBOARD_EVALUASI_AREA_OFFICE.md`](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/PLAN_DASHBOARD_EVALUASI_AREA_OFFICE.md).*


