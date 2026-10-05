# Struktur Folder Frontend

Dokumen ini menjelaskan struktur aktual `admin-dashboard/` setelah perbaikan arsitektur. Alur API mengikuti lapisan domain, use case, repository, dan composition root. Panduan ini membedakan pola yang sudah diterapkan dari bagian yang masih dapat dikembangkan.

## Struktur Proyek

```text
admin-dashboard/
├── doc/                              # Dokumentasi frontend
├── public/                           # Aset statis (opsional)
├── src/
│   ├── core/
│   │   ├── constants/                # Konstanta domain/aplikasi
│   │   ├── di/container.ts           # Composition root: repository -> use case
│   │   ├── domain/
│   │   │   ├── errors/               # Error aplikasi yang bebas framework
│   │   │   ├── models/               # Entity dan kontrak data domain
│   │   │   └── repositories/         # Interface repository
│   │   ├── infrastructure/
│   │   │   ├── api/                  # Axios client dan validasi environment
│   │   │   ├── dto/                  # Bentuk payload/respons backend
│   │   │   ├── mappers/              # Konversi DTO <-> model/domain write data
│   │   │   └── repositories/         # Implementasi interface dengan HTTP
│   │   └── use-cases/                # Alur aplikasi yang bergantung pada interface domain
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── form/                 # InputField, Input, Select, DatePicker, dll.
│   │   │   ├── layout/               # AdminLayout, Header, Sidebar
│   │   │   └── ui/                   # Button, Badge, SlideOver, ErrorBoundary
│   │   ├── context/                  # State lintas UI, seperti AuthContext
│   │   ├── pages/                    # Halaman dan modul berdasarkan fitur
│   │   │   ├── Dashboard/
│   │   │   ├── DesignSystem/
│   │   │   ├── Login/
│   │   │   ├── Master/
│   │   │   ├── Settings/
│   │   │   ├── System/               # Halaman sistem/fallback
│   │   │   └── Unauthorized/
│   │   ├── theme/                    # Token design system
│   │   └── utils/                    # Helper tampilan
│   ├── routes/
│   │   ├── AppRoutes.tsx             # Lazy routes dan otorisasi
│   │   ├── ProtectedRoute.tsx        # Guard login/ACL
│   │   └── routePaths.ts              # Path route bernama
│   ├── App.tsx                       # Shell router/provider/error boundary
│   ├── index.css                     # Tailwind dan global styles
│   ├── main.tsx                      # Mount React ke DOM
│   └── vite-env.d.ts
├── .eslintrc.cjs                     # Lint dan aturan dependency boundaries
├── package.json                      # Script dan dependency
├── tailwind.config.js
├── tsconfig.json                     # TypeScript dan alias @/*
└── vite.config.ts                    # Vite, alias, konfigurasi Vitest
```

## Tanggung Jawab Lapisan

### `core/domain`

Berisi entity/model domain, error aplikasi, dan interface repository. Kode di sini tidak boleh mengimpor React, Axios, atau `presentation`.

Model seperti `Karyawan`, `OperationUnit`, `MenuRecord`, dan `ManagedUser` mewakili data bisnis. Nilai form dan opsi dropdown yang khusus UI ditempatkan di `types.ts` folder feature, bukan di model domain.

### `core/use-cases`

Mengekspresikan aksi yang dapat dipakai UI, misalnya mengambil daftar, menyimpan, atau menghapus entity. Use case bergantung pada interface repository, tidak pada implementasi HTTP.

### `core/infrastructure`

Lapisan adapter terhadap sistem luar:

- `api/`: konfigurasi Axios, validasi `VITE_API_URL`, dan normalisasi kegagalan HTTP menjadi `AppError`.
- `dto/`: bentuk wire data backend untuk Master serta endpoint Menu, Role/ACL, dan Managed User.
- `mappers/`: transformasi DTO menjadi model serta data domain menjadi payload API.
- `repositories/`: implementasi kontrak repository dengan Axios.

Error dari Axios dinormalisasi sebagai `AppError` pada batas infrastructure. Komponen dan hook memakai `message` serta `status` error aplikasi, bukan membaca `AxiosError.response`.

### `core/di/container.ts`

Composition root tunggal. File ini membuat implementasi repository dan memasukkannya ke use case. Presentation mengimpor use case dari container; halaman tidak membuat `HttpRepository` dan tidak mengimpor `core/infrastructure`.

### `presentation`

Berisi UI dan interaksi pengguna. `components/ui`, `components/form`, dan `components/layout` mengelompokkan komponen bersama berdasarkan tanggung jawab. Komponen feature khusus tetap berdekatan dengan halaman yang menggunakannya.

### `routes`

`AppRoutes.tsx` mendaftarkan route menggunakan `React.lazy`/`Suspense`; `routePaths.ts` menjadi daftar path bernama; `ProtectedRoute.tsx` mengurus autentikasi dan izin akses. Design System Showcase hanya didaftarkan pada mode development.

## Struktur Feature Master

```text
presentation/pages/Master/
├── Karyawan/
│   ├── KaryawanListPage.tsx
│   ├── types.ts                    # Form values dan opsi UI fitur
│   ├── hooks/
│   │   ├── useKaryawan.ts          # Menggabungkan sub-hook dan toast
│   │   ├── useKaryawanList.ts      # Data, lookup, filter, pagination
│   │   └── useKaryawanForm.ts      # Siklus form dan mutasi
│   └── components/
│       ├── KaryawanTable.tsx
│       ├── KaryawanFormDrawer.tsx
│       └── KaryawanDetailDrawer.tsx
└── OperationUnit/
    ├── OperationUnitListPage.tsx
    ├── types.ts                    # Form values fitur
    ├── hooks/useOperationUnits.ts  # State dan aksi fitur
    └── components/
        ├── OperationUnitOverview.tsx
        ├── OperationUnitTable.tsx
        ├── OperationUnitTree.tsx
        ├── OperationUnitFormDrawer.tsx
        └── OperationUnitDetailDrawer.tsx
```

Page menyusun view dan meneruskan data/callback. Feature hook mengelola UI-state serta memanggil use case. Karyawan memisahkan `useKaryawanList` dan `useKaryawanForm`, disatukan oleh `useKaryawan`. Feature component menampilkan data dan mengirimkan callback, bukan melakukan request sendiri.

## Arah Dependensi

```text
presentation -> core/use-cases -> core/domain
                                      ^
                                      |
                              core/infrastructure

core/di/container.ts menghubungkan use case dengan implementasi repository.
```

Aturan yang ditegakkan ESLint melalui `eslint-plugin-boundaries`:

- `core/domain` tidak mengimpor use case, infrastructure, DI, routes, atau presentation.
- `core/use-cases` tidak mengimpor infrastructure, DI, routes, atau presentation.
- `core/infrastructure` tidak mengimpor DI, routes, atau presentation.
- `presentation` dan `routes` tidak mengimpor `core/infrastructure`.

Jika logika UI khusus satu fitur, letakkan hook di `<fitur>/hooks/`. Jika aturan bisnis lintas fitur, letakkan fungsi/use case di `core`. Hook lintas fitur tanpa aturan bisnis dapat ditempatkan di `presentation/shared/hooks/` bila kebutuhan itu muncul.

## Menambah Fitur

1. Definisikan entity/domain contract di `core/domain/models` dan repository interface di `core/domain/repositories`.
2. Buat DTO serta mapper di `core/infrastructure/dto` dan `mappers` untuk mengisolasi wire format API dari domain.
3. Buat implementasi HTTP repository di `core/infrastructure/repositories`.
4. Buat use case yang menerima interface repository melalui constructor.
5. Daftarkan instance repository dan use case di `core/di/container.ts`.
6. Buat folder feature di `presentation/pages/<kelompok>/<fitur>/`; tempatkan tipe form/opsi UI di `types.ts`.
7. Gunakan hooks untuk state serta alur interaksi, dan komponen untuk tabel/form/detail.
8. Daftarkan path di `routes/routePaths.ts` dan route/lazy import di `routes/AppRoutes.tsx`.
9. Jalankan build, lint, dan test dari folder `admin-dashboard/`.

## Validasi dan Perintah

```sh
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
npm run preview
```

Konfigurasi tersedia untuk alias `@/*`, ESLint dependency boundaries, Vitest, dan Testing Library. Test mencakup mapper Operation Unit/Management, validasi `VITE_API_URL`, serta fallback ErrorBoundary.

## Status Review

Sudah diterapkan: form types dipisah dari domain, DTO/mapper dan repository/use case untuk Master serta Menu/Role/User ditambahkan, composition root dipakai oleh presentation, direct import infrastructure dari presentation dihilangkan, routes dilazy-load, komponen bersama dikelompokkan, `useKaryawan` dipisah menjadi list/form hooks, lint/boundaries dan test runner dikonfigurasi, ErrorBoundary dan validasi API environment ditambahkan.

Masih dapat dikembangkan sesuai skala kebutuhan: TanStack Query untuk cache server-state, toast global, lebih banyak test unit/integrasi untuk setiap use case dan alur CRUD, serta meninjau apakah folder dokumentasi perlu dinamai ulang. Folder `use-cases/` dipertahankan sebagai konvensi yang sudah digunakan Auth dan fitur baru.
