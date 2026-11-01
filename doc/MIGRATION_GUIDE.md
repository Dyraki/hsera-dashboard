# Panduan Migrasi & Setup Proyek HSERA ke Komputer Baru (AI & Developer Runbook)

> **Tujuan Dokumen**: Dokumen ini dirancang khusus sebagai panduan komprehensif bagi Anda (Developer) maupun AI Agent (Antigravity/Claude/ChatGPT) saat memindahkan seluruh ekosistem proyek **HSERA** dari repositori Git ke komputer baru. Dokumen ini memuat seluruh struktur folder, file konfigurasi `.env`, orkestrator `docker-compose.yml`, restore database, pemetaan port, dan alur verifikasi hingga aplikasi berjalan 100%.

---

## 1. Ringkasan Ekosistem & Arsitektur Sistem

Platform **HSERA** adalah sistem enterprise berbasis *Service-Oriented Architecture (SOA)* yang terdiri dari **3 repositori Git terpisah** di dalam satu direktori kerja induk (`hsera/`), didukung oleh 1 kontainer PostgreSQL yang mengelola 2 database independen:

```mermaid
graph TD
    Client["Browser / Web Client (SPA)"]
    
    subgraph "Frontend Layer"
        Dashboard["hsera-dashboard<br/>(React 18 + TS + Tailwind + Vite)<br/>Port: 5175 (Docker) / 5173 (Host)"]
    end

    subgraph "Backend Services"
        AuthSvc["hsera-auth-backend<br/>(Express + TypeScript + Prisma)<br/>Port: 5002 (Host) / 5001 (Internal)"]
        SalesSvc["hsera-salesmanship-backend<br/>(Express + TypeScript + Prisma)<br/>Port: 5003 (Host & Internal)"]
    end

    subgraph "Database Layer (PostgreSQL Container: hsera_postgres)"
        DB_Auth[("Database: hsera<br/>(Port: 5433)")]
        DB_Sales[("Database: hsera_salesmanship<br/>(Port: 5433)")]
    end

    Client -->|Akses UI| Dashboard
    Dashboard -->|REST API Port 5002| AuthSvc
    Dashboard -->|REST API Port 5003| SalesSvc
    SalesSvc -->|Validasi SSO & Lookup Karyawan| AuthSvc
    AuthSvc --> DB_Auth
    SalesSvc --> DB_Sales
```

### Pemetaan Port dan Jaringan

| Layanan | Direktori | Port Host | Port Kontainer | URL Akses |
| :--- | :--- | :---: | :---: | :--- |
| **Frontend Web** | `hsera-dashboard/` | `5175` (atau `5173` lokal) | `5173` | [http://localhost:5175](http://localhost:5175) |
| **Auth Backend API** | `hsera-auth-backend/` | `5002` | `5001` | [http://localhost:5002](http://localhost:5002) (Swagger: `/api-docs`) |
| **Salesmanship API** | `hsera-salesmanship-backend/` | `5003` | `5003` | [http://localhost:5003](http://localhost:5003) |
| **PostgreSQL DB** | Kontainer `hsera_postgres` | `5433` | `5432` | `localhost:5433` (DB: `hsera` & `hsera_salesmanship`) |

> [!IMPORTANT]
> **Catatan Port Khusus**: Port database PostgreSQL sengaja dipetakan ke **5433** (bukan 5432 default) dan backend ke **5002/5003** agar **tidak bentrok jika di komputer target sudah berjalan service PostgreSQL lokal lain atau project lain**.

### Prasyarat Lingkungan (Prerequisites)
- **Node.js**: `v22.23.4` (LTS: Jod) — disarankan menggunakan NVM (`nvm install 22.23.4 && nvm use 22.23.4`)
- **npm**: `10.9.x`
- **Docker & Docker Compose**: Versi 20.10+ / Compose v2+
- **Git**: Versi 2.30+

---

## 2. Struktur Repositori Git di GitHub

Folder induk `hsera/` **bukan** merupakan satu monorepo Git, melainkan direktori kerja yang membawahi 3 repositori Git terpisah di GitHub pengguna:

1. **Frontend Dashboard**:
   * Repository: `https://github.com/Dyraki/hsera-dashboard.git`
   * Branch: `main`
2. **Core Auth Backend**:
   * Repository: `https://github.com/Dyraki/hsera-auth-backend.git`
   * Branch: `main`
3. **Salesmanship Backend**:
   * Repository: `https://github.com/Dyraki/hsera-salesmanship-backend.git`
   * Branch: `main`

### Struktur Folder Lengkap yang Diharapkan di Komputer Baru

```text
hsera/                                  # Folder induk (orchestrator)
├── docker-compose.yml                  # Orkestrasi 4 container
├── .env                                # Konfigurasi environment terpusat root
├── .env.example                        # Template environment root
├── README.md                           # Dokumentasi ringkas root
├── hsera-auth-backend/                 # Git Repo 1: Auth & IdP Service
│   ├── .env                            # Env khusus Auth Backend
│   ├── doc/
│   │   ├── hsera_dump.sql              # SQL Backup database `hsera`
│   │   └── schema_postgres.sql         # Skema DDL manual (opsional)
│   ├── prisma/schema.prisma
│   └── src/
├── hsera-salesmanship-backend/         # Git Repo 2: Salesmanship Service
│   ├── .env                            # Env khusus Salesmanship Backend
│   ├── doc/
│   │   └── hsera_salesmanship_dump.sql # SQL Backup database `hsera_salesmanship`
│   ├── prisma/schema.prisma
│   └── src/
└── hsera-dashboard/                    # Git Repo 3: Web Admin Frontend
    ├── .env                            # Env khusus Vite Frontend
    ├── doc/                            # Dokumentasi arsitektur & panduan sistem
    │   ├── ARCHITECTURE.md
    │   ├── DATABASE_SCHEMA.md
    │   ├── DEVELOPMENT_GUIDE.md
    │   ├── MIGRATION_GUIDE.md          # Dokumen ini
    │   └── README.md
    └── src/
```

---

## 3. Seluruh File Konfigurasi `.env` (Siap Salin)

Terdapat **4 file `.env`** yang harus ada di sistem. Salin isi masing-masing blok kode di bawah ini:

### A. Root `.env` (Lokasi: `hsera/.env`)

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=rootpassword
POSTGRES_DB=hsera
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera?schema=public"

JWT_SECRET="supersecretkeyframeworkv1coreauth"
JWT_EXPIRES_IN="15m"

# HSERA Ports
PORT=5002
VITE_API_URL="http://localhost:5002"
```

### B. Auth Backend `.env` (Lokasi: `hsera/hsera-auth-backend/.env`)

```env
PORT=5001
# Koneksi Database PostgreSQL lokal (host machine):
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera?schema=public"

# Jika dijalankan di dalam container docker (network Docker):
# DATABASE_URL="postgresql://postgres:rootpassword@db:5432/hsera?schema=public"

JWT_SECRET="supersecretkeyframeworkv1coreauth"
JWT_EXPIRES_IN="15m"
NODE_ENV="development"
```

### C. Salesmanship Backend `.env` (Lokasi: `hsera/hsera-salesmanship-backend/.env`)

```env
PORT=5003

# Database PostgreSQL independen untuk Salesmanship Service
# Koneksi lokal (host machine):
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera_salesmanship?schema=public"

# Jika dijalankan di dalam container docker (network Docker):
# DATABASE_URL="postgresql://postgres:rootpassword@db:5432/hsera_salesmanship?schema=public"

# Integrasi dengan Auth Backend (SSO & Lookup Karyawan)
AUTH_BACKEND_URL="http://localhost:5002"
JWT_SECRET="supersecretkeyframeworkv1coreauth"
NODE_ENV="development"
```

> [!WARNING]
> Nilai `JWT_SECRET` pada `hsera-auth-backend` dan `hsera-salesmanship-backend` **wajib sama persis** (`supersecretkeyframeworkv1coreauth`) agar token JWT hasil login dari Auth Service dapat diverifikasi dan didekode dengan valid oleh Salesmanship Service.

### D. Frontend Dashboard `.env` (Lokasi: `hsera/hsera-dashboard/.env`)

```env
VITE_API_URL="http://localhost:5002"
VITE_SALESMANSHIP_API_URL="http://localhost:5003"
```

---

## 4. File `docker-compose.yml` (Lokasi: `hsera/docker-compose.yml`)

Salin file ini di folder utama `hsera/`:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: hsera_postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-rootpassword}
      POSTGRES_DB: ${POSTGRES_DB:-hsera}
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5433:5432"
    volumes:
      - hsera_postgres_data:/var/lib/postgresql/data
    networks:
      - hsera-network

  hsera-auth-backend:
    build:
      context: ./hsera-auth-backend
      dockerfile: Dockerfile
    container_name: hsera_backend
    restart: always
    ports:
      - "5002:5001"
    environment:
      - PORT=5001
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-rootpassword}@db:5432/${POSTGRES_DB:-hsera}?schema=public
      - JWT_SECRET=${JWT_SECRET:-supersecretkeyframeworkv1coreauth}
      - JWT_EXPIRES_IN=15m
      - NODE_ENV=development
    depends_on:
      - db
    volumes:
      - ./hsera-auth-backend:/app
      - /app/node_modules
    networks:
      - hsera-network

  hsera-salesmanship-backend:
    build:
      context: ./hsera-salesmanship-backend
      dockerfile: Dockerfile
    container_name: hsera_salesmanship_backend
    restart: always
    ports:
      - "5003:5003"
    environment:
      - PORT=5003
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-rootpassword}@db:5432/hsera_salesmanship?schema=public
      - AUTH_BACKEND_URL=http://hsera-auth-backend:5001
      - JWT_SECRET=${JWT_SECRET:-supersecretkeyframeworkv1coreauth}
      - NODE_ENV=development
    depends_on:
      - db
      - hsera-auth-backend
    volumes:
      - ./hsera-salesmanship-backend:/app
      - /app/node_modules
    networks:
      - hsera-network

  hsera-dashboard:
    build:
      context: ./hsera-dashboard
      dockerfile: Dockerfile
    container_name: hsera_frontend
    restart: always
    ports:
      - "5175:5173"
    environment:
      - VITE_API_URL=http://localhost:5002
    stdin_open: true
    tty: true
    depends_on:
      - hsera-auth-backend
    volumes:
      - ./hsera-dashboard:/app
      - /app/node_modules
    networks:
      - hsera-network

volumes:
  hsera_postgres_data:

networks:
  hsera-network:
    driver: bridge
```

---

## 5. Prosedur Migrasi Langkah-demi-Langkah (Step-by-Step)

Jalankan instruksi berikut di terminal komputer baru:

### Langkah 1: Persiapan Folder Induk & Clone 3 Repositori

```bash
# Buat folder kerja utama di lokasi yang diinginkan
mkdir -p ~/Documents/Docker/hsera
cd ~/Documents/Docker/hsera

# Clone ketiga repositori Git
git clone https://github.com/Dyraki/hsera-dashboard.git
git clone https://github.com/Dyraki/hsera-auth-backend.git
git clone https://github.com/Dyraki/hsera-salesmanship-backend.git
```

### Langkah 2: Buat File Konfigurasi `.env`

Buat file `.env` di root dan di ketiga sub-direktori sesuai template di **Bagian 3**:

```bash
# Buat root .env
cat << 'EOF' > .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=rootpassword
POSTGRES_DB=hsera
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera?schema=public"
JWT_SECRET="supersecretkeyframeworkv1coreauth"
JWT_EXPIRES_IN="15m"
PORT=5002
VITE_API_URL="http://localhost:5002"
EOF

# Buat auth backend .env
cat << 'EOF' > hsera-auth-backend/.env
PORT=5001
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera?schema=public"
JWT_SECRET="supersecretkeyframeworkv1coreauth"
JWT_EXPIRES_IN="15m"
NODE_ENV="development"
EOF

# Buat salesmanship backend .env
cat << 'EOF' > hsera-salesmanship-backend/.env
PORT=5003
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5433/hsera_salesmanship?schema=public"
AUTH_BACKEND_URL="http://localhost:5002"
JWT_SECRET="supersecretkeyframeworkv1coreauth"
NODE_ENV="development"
EOF

# Buat dashboard frontend .env
cat << 'EOF' > hsera-dashboard/.env
VITE_API_URL="http://localhost:5002"
VITE_SALESMANSHIP_API_URL="http://localhost:5003"
EOF
```

### Langkah 3: Jalankan Database PostgreSQL Terlebih Dahulu

Kontainer database harus menyala sebelum data di-restore:

```bash
# Nyalakan kontainer postgres
docker compose up -d db

# Tunggu 3-5 detik sampai PostgreSQL siap menerima koneksi
docker exec -i hsera_postgres pg_isready -U postgres
```

### Langkah 4: Buat Database Kedua (`hsera_salesmanship`)

PostgreSQL Docker secara otomatis hanya membuat database pertama yang ditentukan di `POSTGRES_DB` (`hsera`). Database kedua harus dibuat:

```bash
docker exec -i hsera_postgres psql -U postgres -c "CREATE DATABASE hsera_salesmanship;"
```

### Langkah 5: Restore Database dari SQL Dump

Kedua repositori backend telah dilengkapi dengan SQL Dump lengkap yang memuat struktur tabel dan data master operasional:

```bash
# 1. Restore Database Auth (Users, Menu ACL, Karyawan, Operation Unit)
docker exec -i hsera_postgres psql -U postgres -d hsera < hsera-auth-backend/doc/hsera_dump.sql

# 2. Restore Database Salesmanship (Brands, Districts, Targets, Callsheet Rekap)
docker exec -i hsera_postgres psql -U postgres -d hsera_salesmanship < hsera-salesmanship-backend/doc/hsera_salesmanship_dump.sql
```

> [!TIP]
> **Alternatif Jika Memulai dari Database Kosong (Tanpa SQL Dump)**:
> Jika ingin membuat tabel dari awal menggunakan Prisma dan data dummy baru:
> ```bash
> # Di hsera-auth-backend:
> cd hsera-auth-backend && npm install && npx prisma db push && npm run seed && cd ..
> 
> # Di hsera-salesmanship-backend:
> cd hsera-salesmanship-backend && npm install && npx prisma db push && npm run seed && cd ..
> ```

### Langkah 6: Jalankan Seluruh Aplikasi

Terdapat dua metode untuk menjalankan aplikasi:

#### Opsi A: Full Docker Compose (Sangat Dianjurkan untuk Testing/Production)
```bash
# Dari root direktori hsera/
docker compose up -d --build
```
Periksa status kontainer:
```bash
docker compose ps
```
Semua 4 kontainer (`hsera_postgres`, `hsera_backend`, `hsera_salesmanship_backend`, `hsera_frontend`) harus berstatus **Up**.

#### Opsi B: Development Lokal (Host Machine)
Jika Anda ingin mengembangkan code secara aktif dengan *Hot Module Reload* di mesin host:
```bash
# 1. Database tetap via Docker (Port 5433)
docker compose up -d db

# 2. Terminal 1: Jalankan Auth Backend
cd hsera-auth-backend
npm install
npx prisma generate
npm run dev
# -> Berjalan di http://localhost:5001 (atau 5002)

# 3. Terminal 2: Jalankan Salesmanship Backend
cd hsera-salesmanship-backend
npm install
npx prisma generate
npm run dev
# -> Berjalan di http://localhost:5003

# 4. Terminal 3: Jalankan Frontend Dashboard
cd hsera-dashboard
npm install
npm run dev
# -> Berjalan di http://localhost:5173
```

---

## 6. Kredensial Pengguna untuk Login

Buka browser di **`http://localhost:5175`** (atau `http://localhost:5173` jika dev lokal):

| Username | Password | Role / Jabatan | Unit Kerja (Scope) | Keterangan Akses |
| :--- | :--- | :--- | :--- | :--- |
| **`admin`** | `admin123` | `SA` (Super Admin) | `HO` (Kantor Pusat) | Akses mutlak semua menu & data nasional. |
| **`agoesm`** | `12345678` | `pegawai` (Area Manager) | `AREA-TAG` | Mengelola area Tulungagung & Trenggalek. |
| **`adys`** | `12345678` | `pegawai` (Supervisor) | `CAB-TAG` | Terbatas operasional Cabang Tulungagung. |
| **`angga`** | `12345678` | `pegawai` (Salesman) | `CAB-TAG` | Terbatas input Callsheet Cabang Tulungagung. |

*(Sistem otomatis meng-upgrade hash password lama ke bcrypt salt rounds 12 pada login pertama).*

---

## 7. Checklist Verifikasi & Smoke Test Pasca Migrasi

Lakukan uji coba cepat (*smoke test*) berikut untuk memastikan migrasi berhasil tanpa kendala:

- [ ] **Auth Backend Test**: Buka [http://localhost:5002/api-docs](http://localhost:5002/api-docs). Halaman Swagger UI harus muncul dengan dokumentasi API lengkap.
- [ ] **Salesmanship Backend Test**: Buka endpoint test [http://localhost:5003/api/salesmanship/brands](http://localhost:5003/api/salesmanship/brands). Harus mengembalikan JSON daftar brand produk.
- [ ] **Login Frontend**: Buka [http://localhost:5175](http://localhost:5175), masukkan user `admin` / `admin123`. Berhasil masuk ke halaman Dashboard Overview.
- [ ] **Grafik Dashboard**: Pastikan **Matriks Rekap Notasi Per Brand** dan **Trend Volume Penjualan** menampilkan grafik data Tulungagung & Trenggalek tanpa error.
- [ ] **Menu Master Karyawan**: Buka `/master/karyawan`, pastikan tabel data muncul dengan fitur pagination (10, 50, 100 data).
- [ ] **Menu Teritori Management**: Buka `/salesmanship/territory`, pastikan tabel teritori muncul dengan pagination.
- [ ] **Menu Target Salesmanship**: Buka `/salesmanship/target`, pastikan tabel target bulanan muncul dengan pagination.
- [ ] **Menu Callsheet & Monitoring**: Buka `/salesmanship/monitoring`, klik salah satu sel status teritori. Form callsheet di `/salesmanship/callsheet` harus membuka district dan tanggal yang sesuai.

### Menjalankan Automated Test Suite

Jalankan test suite di komputer baru untuk memastikan tidak ada *regression error*:

```bash
# 1. Test Frontend Dashboard (Vitest)
cd hsera-dashboard && npm test -- --run
# Harapan: 15 test files lulus, 60 tests lulus (100%)

# 2. Test Salesmanship Backend (Vitest)
cd ../hsera-salesmanship-backend && npm test -- --run
# Harapan: 3 test files lulus, 20 tests lulus (100%)

# 3. Test Auth Backend (Vitest)
cd ../hsera-auth-backend && npm test -- --run
# Harapan: Seluruh unit test Auth lulus
```

---

## 8. Panduan Mengatasi Kendala (Troubleshooting / Gotchas)

### 1. `DATABASE_URL` Error: Connection refused pada port 5432 vs 5433
* **Penyebab**: Jika menjalankan aplikasi di mesin host (*bukan di dalam Docker*), database PostgreSQL diekspos pada port **`5433`**.
* **Solusi**: Pastikan di `.env` lokal Anda menuliskan `localhost:5433`. Hanya di dalam lingkungan Docker compose network alamatnya menjadi `db:5432`.

### 2. Error `database "hsera_salesmanship" does not exist`
* **Penyebab**: Docker postgres hanya membuat 1 database awal (`hsera`).
* **Solusi**: Jalankan perintah pembuatan database kedua:
  ```bash
  docker exec -i hsera_postgres psql -U postgres -c "CREATE DATABASE hsera_salesmanship;"
  ```

### 3. Gagal Login / Token JWT Tidak Terbaca di Salesmanship Service
* **Penyebab**: `JWT_SECRET` di `hsera-auth-backend/.env` berbeda dengan `hsera-salesmanship-backend/.env`.
* **Solusi**: Pastikan kedua file `.env` memiliki baris:
  `JWT_SECRET="supersecretkeyframeworkv1coreauth"`

### 4. Port 5175 atau 5002 bentrok dengan service lain
* **Solusi**: Ubah pemetaan port host di file `docker-compose.yml` (sisi kiri dari titik dua, contoh: `"5004:5001"` atau `"5176:5173"`), lalu perbarui URL di `.env` frontend.

---

*Dokumen ini diperbarui secara berkala mengikuti arsitektur Clean Architecture platform HSERA.*
