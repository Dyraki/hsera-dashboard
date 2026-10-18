# Struktur Folder Frontend `hsera-dashboard`

> **Tujuan Dokumen**: Dokumen ini memetakan struktur pohon folder aktual dari source code `hsera-dashboard/src/` beserta tanggung jawab setiap lapisannya sesuai kaidah Clean Architecture.

---

## 1. Pohon Direktori Source Code

```text
hsera-dashboard/
├── doc/                              # Dokumentasi arsitektur & modul proyek
│   ├── README.md                     # Pusat navigasi & ikhtisar sistem
│   ├── ARCHITECTURE.md               # Arsitektur sistem, auth, & token scope
│   ├── SALESMANSHIP_MODULE.md        # Modul salesmanship, matriks, & rumus
│   ├── DATABASE_SCHEMA.md            # Skema PostgreSQL dual-database
│   ├── DEVELOPMENT_GUIDE.md          # Panduan penambahan fitur & troubleshooting
│   └── STRUKTUR_FOLDER.md            # Pemetaan struktur file frontend (dokumen ini)
├── src/
│   ├── core/                         # LOGIKA BISNIS INTI
│   │   ├── constants/                # MenuConstants (SYSTEM_MENU_IDS), dll.
│   │   ├── di/container.ts           # Composition root: instansiasi repository & use case
│   │   ├── domain/                   # Model bisnis murni, interface repository, rules
│   │   │   ├── errors/               # AppError
│   │   │   ├── models/               # User, District, Target, Callsheet, Monitoring
│   │   │   ├── permissions.ts        # Logika evaluasi bitmask ACL
│   │   │   └── repositories/         # Interface kontrak repository
│   │   ├── infrastructure/           # Adapter dunia luar (HTTP & Storage)
│   │   │   ├── api/                  # AxiosHttpClient, SalesmanshipHttpClient, environment
│   │   │   ├── dto/                  # Schema payload JSON backend
│   │   │   ├── mappers/              # Transformasi DTO <-> Domain
│   │   │   └── repositories/         # HttpAuthRepository, HttpSalesmanshipRepository, dll.
│   │   └── use-cases/                # Alur use cases aplikasi
│   ├── presentation/                 # ANTARMUKA PENGGUNA (REACT)
│   │   ├── components/
│   │   │   ├── form/                 # InputField, Select, DatePicker, dll.
│   │   │   ├── layout/               # AdminLayout, Header, Sidebar
│   │   │   └── ui/                   # Button, Badge, Modal, SlideOver, PermissionButton
│   │   ├── context/                  # AuthContext, ToastContext
│   │   ├── pages/                    # Halaman per modul bisnis
│   │   │   ├── Dashboard/            # Dashboard Ringkasan Utama
│   │   │   ├── Login/                # Halaman Autentikasi
│   │   │   ├── Master/               # Master Karyawan & Operation Unit (OU)
│   │   │   ├── Salesmanship/         # Modul Teritori, Target, Callsheet, Monitoring
│   │   │   │   ├── Territory/        # Master Distrik & Penugasan Salesman
│   │   │   │   ├── Target/           # Setup Target Bulanan Distrik
│   │   │   │   ├── Callsheet/        # Input & Rekap Callsheet Harian (RIS)
│   │   │   │   └── Monitoring/       # Monitoring Callsheet Mingguan & Kunci Periode
│   │   │   ├── Settings/             # Menu, Role, Role-User (ACL)
│   │   │   └── System/               # Unauthorized & Fallback Pages
│   │   ├── theme/                    # Token Tailwind & Design System
│   │   └── utils/                    # Helper formatting & UI
│   ├── routes/
│   │   ├── AppRoutes.tsx             # Lazy loading routes & guard otorisasi
│   │   ├── ProtectedRoute.tsx        # Guard otorisasi berdasarkan login & level ACL
│   │   └── routePaths.ts             # Konstanta path URL bernama
│   ├── App.tsx                       # Root provider wrapper & Error Boundary
│   ├── index.css                     # Tailwind CSS & global styling
│   └── main.tsx                      # Entrypoint DOM React
├── package.json
├── tailwind.config.js
├── tsconfig.json                     # Alias @/* -> src/*
└── vite.config.ts                    # Konfigurasi bundler Vite & Vitest
```

---

## 2. Struktur Modul Salesmanship (`presentation/pages/Salesmanship/`)

```text
presentation/pages/Salesmanship/
├── Territory/                        # 1. Teritori Management (District)
│   ├── TerritoryListPage.tsx         # Halaman tabel teritori & filter OU
│   ├── types.ts                      # Tipe state form & modal teritori
│   ├── hooks/
│   │   └── useTerritory.ts           # State, fetching, aksi create/update/delete
│   └── components/
│       ├── TerritoryTable.tsx
│       ├── TerritoryModal.tsx
│       └── TerritoryDeleteModal.tsx
├── Target/                           # 2. Setup Target Bulanan
│   ├── TargetListPage.tsx            # Halaman tabel target & filter
│   ├── types.ts                      # Tipe filter & form target
│   ├── types.test.ts                 # Unit test helper target
│   ├── hooks/
│   │   └── useTarget.ts              # State & filter target
│   └── components/
│       ├── TargetTable.tsx
│       ├── TargetModal.tsx
│       └── TargetDeleteModal.tsx
├── Callsheet/                        # 3. Rekap Callsheet Harian (RIS)
│   ├── CallsheetFormPage.tsx         # Halaman formulir rekap harian
│   ├── types.ts                      # Tipe matriks produk & notasi
│   ├── Callsheet.test.ts             # Unit test kalkulasi rumus matriks
│   ├── hooks/
│   │   └── useCallsheetForm.ts       # State form, validasi baris, autosave draft
│   └── components/
│       ├── CallsheetHeaderFilter.tsx # Filter distrik, tanggal, mode rekap
│       ├── CallsheetMatrixTable.tsx  # Grid input angka (Brands x Notasi)
│       ├── CallsheetKpiCards.tsx     # Ringkasan live status, EC, BD, volume
│       └── CallsheetActionFooter.tsx # Tombol Simpan Draft & Finalisasi
└── Monitoring/                       # 4. Monitoring Callsheet Mingguan
    ├── MonitoringPage.tsx            # Halaman utama monitoring mingguan
    ├── types.ts                      # Tipe filter mingguan & kartu KPI
    ├── Monitoring.test.ts            # Unit test ISO week & defaulting OU user
    ├── hooks/
    │   └── useWeeklyMonitoring.ts    # Fetching rekap mingguan, filter OU user, lock
    └── components/
        ├── MonitoringHeader.tsx      # Judul & tombol ekspor CSV
        ├── MonitoringWeekFilter.tsx  # Navigasi minggu ISO & dropdown filter OU
        ├── MonitoringKpiCards.tsx    # 4 kartu KPI (Kelengkapan, EC, BD, Volume)
        ├── MonitoringMatrixGrid.tsx  # Matriks Senin s/d Sabtu per distrik
        └── LockWeekModal.tsx         # Modal konfirmasi Kunci / Buka Periode
```

---

## 3. Tanggung Jawab Lapisan & Aturan ESLint Boundaries

Untuk mencegah spaghetti code dan kebocoran dependensi:

1. **`core/domain`**: Hanya mendefinisikan interface dan logika bisnis murni tanpa ketergantungan framework.
2. **`core/use-cases`**: Mengorkestrasi interaksi domain.
3. **`core/infrastructure`**: Hanya dipanggil oleh `core/di/container.ts`. Komponen presentation dilarang mengimpor langsung dari `core/infrastructure`.
4. **`presentation`**: Hanya berinteraksi dengan `useCases` dan instance repository yang disediakan oleh `core/di/container.ts`.

Aturan ini diverifikasi oleh `eslint-plugin-boundaries` saat menjalankan `npm run lint`.
