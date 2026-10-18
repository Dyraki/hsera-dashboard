# HSERA Platform – Dokumentasi Proyek & Panduan Sistem

> **Tujuan Dokumen**: Dokumen ini adalah pusat navigasi (*hub*) dan ringkasan arsitektur platform HSERA. Bacalah dokumen ini dan modul-modul terkait di folder `doc/` sebelum memulai pengembangan untuk menghemat token AI dan memahami konteks proyek secara utuh tanpa perlu melakukan pencarian berulang.

---

## 1. Ikhtisar Sistem (System Overview)

HSERA adalah platform terintegrasi untuk manajemen organisasi, administrasi pengguna, dan operasional salesmanship (kunjungan salesman, pencatatan callsheet harian RIS, dan monitoring performa mingguan).

Platform ini dibangun dengan arsitektur berbasis layanan (*Service-Oriented Architecture*) yang terdiri dari:

1. **`hsera-dashboard`** (Port: `5175` / `5173`):
   * SPA Frontend berbasis **React 18**, **TypeScript**, **Vite**, dan **Tailwind CSS**.
   * Menerapkan **Clean Architecture** (Domain, Use Cases, Infrastructure, Presentation).
2. **`hsera-auth-backend`** (Port Host: `5002`, Port Kontainer: `5001`):
   * Layanan autentikasi terpusat (SSO), manajemen pengguna, hierarki organisasi (Operation Unit), data karyawan, dan RBAC / ACL menu berbasis bitmask.
   * Database: PostgreSQL `hsera` (Port: `5433`).
3. **`hsera-salesmanship-backend`** (Port: `5003`):
   * Layanan microservice operasional salesmanship: Teritori (District), Target Bulanan, Formulir Rekap Callsheet Harian (RIS Matrix), Monitoring Callsheet Mingguan, dan Penguncian Periode Minggu.
   * Database: PostgreSQL `hsera_salesmanship` (Port: `5433`).
4. **PostgreSQL Container (`hsera_postgres`)**:
   * Port Host: `5433` (memetakan ke port `5432` di dalam container Docker).
   * Memuat dua database terpisah: `hsera` dan `hsera_salesmanship`.

---

## 2. Navigasi Dokumen Lanjutan

Folder [doc/](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc) memiliki modul-modul dokumentasi spesifik berikut:

| Dokumen | Topik & Cakupan Utama |
| :--- | :--- |
| **[ARCHITECTURE.md](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/ARCHITECTURE.md)** | Arsitektur Clean Architecture frontend, relasi antar-service, alur JWT & Refresh Token, mekanisme OU Scoping, dan RBAC Level Bitmask. |
| **[SALESMANSHIP_MODULE.md](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/SALESMANSHIP_MODULE.md)** | Penjelasan mendalam fitur Salesmanship: Master District/Teritori, Master Target, Rekap Callsheet (RIS Matrix Brands x Notasi), Monitoring Mingguan, dan Sistem Kunci Minggu. |
| **[DATABASE_SCHEMA.md](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/DATABASE_SCHEMA.md)** | Schema lengkap PostgreSQL untuk database `hsera` dan `hsera_salesmanship`, tabel, relasi foreign key, tipe data, dan indexing. |
| **[DEVELOPMENT_GUIDE.md](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/DEVELOPMENT_GUIDE.md)** | Panduan praktis penambahan fitur baru, panduan perintah Docker/NPM, daftar jebakan umum (*gotchas*), dan panduan testing Vitest. |
| **[STRUKTUR_FOLDER.md](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/doc/STRUKTUR_FOLDER.md)** | Struktur direktori mendetail dari source code frontend `hsera-dashboard/src`. |

---

## 3. Matriks Service & Port Jaringan

| Layanan | Direktori | Runtime | Port Host | Port Kontainer | URL Akses |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend Dashboard** | `hsera-dashboard/` | Node 20 / Vite | `5175` (atau `5173` lokal) | `5173` | [http://localhost:5175](http://localhost:5175) |
| **Auth Backend** | `hsera-auth-backend/` | Node 20 / Express / Prisma | `5002` | `5001` | [http://localhost:5002/api](http://localhost:5002/api) |
| **Salesmanship Backend** | `hsera-salesmanship-backend/` | Node 20 / Express / Prisma | `5003` | `5003` | [http://localhost:5003/api/salesmanship](http://localhost:5003/api/salesmanship) |
| **Database PostgreSQL** | Container `hsera_postgres` | PostgreSQL 16 Alpine | `5433` | `5432` | `localhost:5433` (DB: `hsera`, `hsera_salesmanship`) |

> [!NOTE]
> Di dalam jaringan Docker bridge (`hsera-network`), service saling berkomunikasi menggunakan nama container:
> - Auth Backend: `http://hsera-auth-backend:5001`
> - Salesmanship Backend: `http://hsera-salesmanship-backend:5003`
> - Database: `db:5432`

---

## 4. Akun Pengguna & Kredensial Uji Coba

Data uji coba yang tersedia dalam database (`seed.ts`):

| Username | Password | Role / Jenis | Nama Karyawan | Unit Operasional (OU) | Lingkup Akses (Scope) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`admin`** | `admin123` | `SA` (Super Admin) | Administrator Utama | `HO` (Kantor Pusat) | Akses seluruh unit nasional (semua cabang). |
| **`agoesm`** | `12345678` | `pegawai` (Area Manager) | Agoes Firdhian Mahartino | `AREA-TAG` (Area Office Tulungagung) | Unit penempatan & seluruh anak cabang (`CAB-TAG`, `CAB-TGK`). |
| **`adys`** | `12345678` | `pegawai` (Supervisor Cabang) | ADY SUPRAPTO | `CAB-TAG` (Cabang Tulungagung) | Terbatas hanya pada `CAB-TAG`. |
| **`angga`** | `12345678` | `pegawai` (Staff / Sales) | Angga | `CAB-TAG` (Cabang Tulungagung) | Terbatas hanya pada `CAB-TAG`. |

---

## 5. Ringkasan Route & Hak Akses Menu

Definisi path terpusat di [routePaths.ts](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/routes/routePaths.ts) dan konstanta ID Menu di [MenuConstants.ts](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/core/constants/MenuConstants.ts):

| Path URL | Modul / Halaman | ID Menu (UUID) | Min Level |
| :--- | :--- | :--- | :---: |
| `/` | Dashboard Ringkasan Sistem | `d1000000-0000-4000-d000-000000000001` | 1 |
| `/settings/menu` | Setup Menu & Navigasi | `d1000000-0000-4000-d000-000000000004` | 1 |
| `/settings/role` | Manajemen Peran & Hak Akses (Role) | `d1000000-0000-4000-d000-000000000003` | 1 |
| `/settings/roleuser` | Penugasan Role & User-Karyawan | `d1000000-0000-4000-d000-000000000005` | 1 |
| `/master/operation-unit` | Master Struktur Cabang / OU | `dc5a6000-35e2-4079-b0a2-1c5b1a44f74a` | 1 |
| `/master/karyawan` | Master Data Karyawan | `0da1dfda-7d53-4c59-981b-7814175c7070` | 1 |
| `/salesmanship/territory` | Teritori Management (District) | `f054f502-72d0-47fb-919d-4de7122145cf` | 1 |
| `/salesmanship/target` | Setup Target Bulanan District | `f4fda652-4730-4e12-ac08-7a4d1ab2e864` | 1 |
| `/salesmanship/callsheet` | Input & Rekap Callsheet Harian (RIS) | `de9ab023-de01-4545-82ad-968e50b24e1e` | 1 |
| `/salesmanship/monitoring` | Monitoring Callsheet Mingguan | `2cc8cdbd-c155-48fc-a5e5-f72dafab86d6` | 1 |

---

## 6. Perintah Cepat (Quick Commands)

Jalankan perintah berikut di direktori root `/Users/dyra/Documents/Docker/hsera`:

```bash
# Menjalankan seluruh stack layanan Docker
docker compose up -d

# Memeriksa status kontainer
docker compose ps

# Memeriksa log layanan tertentu
docker logs -f hsera_backend
docker logs -f hsera_salesmanship_backend
docker logs -f hsera_frontend

# Menjalankan unit test frontend
cd hsera-dashboard && npm test

# Memvalidasi build frontend
cd hsera-dashboard && npm run build
```
