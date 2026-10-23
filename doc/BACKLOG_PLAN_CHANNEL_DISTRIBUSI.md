# Rencana & Backlog Final: Penambahan Fitur Channel Distribusi (Opsi 2: Normalized Table)

**Modul:** Salesmanship - Territory Management (`mst_district`) & Callsheet Integration  
**Arsitektur Terpilih:** **Opsi 2 (Tabel Master `mst_channel` + Junction Table `mst_district_channel`)**  
**Status Dokumen:** READY FOR BACKLOG / SPRINT READY  
**Tanggal Penyelesaian:** 22 Oktober 2026  

---

## 1. Ringkasan Eksekutif & Keputusan Arsitektur

Berdasarkan hasil diskusi teknis, diputuskan untuk menggunakan **Opsi 2 (Relasi Many-to-Many M:N via Junction Table)** dengan pertimbangan utama:
1. **Skalabilitas Masa Depan (*Future-Proof*):**  
   Daftar channel dapat ditambah di kemudian hari (misal: `Horeka`, `Sub-Agen`, `Modern Trade Key Account`) langsung dari database/UI tanpa perlu rilis ulang kode (*zero code deployment*).
2. **Integritas Relasional:**  
   Menjamin konsistensi data teritori melalui *Foreign Key Constraints* (mencegah typo string).
3. **Multi-Select per Teritori (DO):**  
   Satu Teritori / DO dapat melayani lebih dari 1 channel (Contoh: `DO-012` memiliki channel: `Agen` dan `Wholesale`).
4. **Otomatisasi Laporan Callsheet WhatsApp:**  
   Format WhatsApp secara otomatis menarik daftar channel teritori terkait:
   ```text
   District : DO-012
   Channel  : Agen, Wholesale
   ```

---

## 2. Diagram Relasi Basis Data (ERD)

```
┌─────────────────────────────────┐
│           MstDistrict           │
│        (mst_district)           │
├─────────────────────────────────┤
│ id           UUID (PK)          │
│ ou_kode      VARCHAR(20)        │
│ kode         VARCHAR(10)        │◄────────┐
│ karyawan_id  VARCHAR(50)        │         │
│ status       VARCHAR(10)        │         │ 1:N
└─────────────────────────────────┘         │
                                            │
┌─────────────────────────────────┐         │
│       MstDistrictChannel        │         │
│     (mst_district_channel)      │         │
├─────────────────────────────────┤         │
│ district_id  UUID (PK, FK)      │─────────┘
│ channel_id   UUID (PK, FK)      │─────────┐
│ created_at   TIMESTAMP          │         │
└─────────────────────────────────┘         │ N:1
                                            │
┌─────────────────────────────────┐         │
│           MstChannel            │         │
│          (mst_channel)          │         │
├─────────────────────────────────┤         │
│ id           UUID (PK)          │◄────────┘
│ kode         VARCHAR(20) UNIQUE │
│ nama         VARCHAR(100)       │
│ urutan       INT                │
│ status       VARCHAR(10)        │
└─────────────────────────────────┘
```

---

## 3. Spesifikasi Teknis Skema Basis Data

### 3.1. File `prisma/schema.prisma` di Backend
```prisma
// 1. Master Channel Baru
model MstChannel {
  id          String   @id @default(uuid()) @db.Uuid
  kode        String   @unique @db.VarChar(20) // AGEN, WHOLESALE, RETAIL, MTI
  nama        String   @db.VarChar(100)        // Agen, Wholesale, Retail, MTI
  deskripsi   String?  @db.Text
  urutan      Int      @default(1)
  status      String   @default("AKTIF") @db.VarChar(10) // AKTIF, NONAKTIF
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  createdBy   String?  @map("created_by") @db.VarChar(50)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamp(6)
  updatedBy   String?  @map("updated_by") @db.VarChar(50)

  districts   MstDistrictChannel[]

  @@map("mst_channel")
}

// 2. Junction Table Relasi Teritori ke Channel (Many-to-Many)
model MstDistrictChannel {
  districtId  String      @map("district_id") @db.Uuid
  channelId   String      @map("channel_id") @db.Uuid
  createdAt   DateTime    @default(now()) @map("created_at") @db.Timestamp(6)

  district    MstDistrict @relation(fields: [districtId], references: [id], onDelete: Cascade)
  channel     MstChannel  @relation(fields: [channelId], references: [id], onDelete: Restrict)

  @@id([districtId, channelId])
  @@map("mst_district_channel")
}

// 3. Update Model MstDistrict yang Sudah Ada
model MstDistrict {
  id          String   @id @default(uuid()) @db.Uuid
  ouKode      String   @map("ou_kode") @db.VarChar(20)
  kode        String   @db.VarChar(10)
  karyawanId  String   @map("karyawan_id") @db.VarChar(50)
  status      String   @default("AKTIF") @db.VarChar(10)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  createdBy   String?  @map("created_by") @db.VarChar(50)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamp(6)
  updatedBy   String?  @map("updated_by") @db.VarChar(50)

  targets     MstTarget[]
  rekapHarian TrxRekapHarian[]
  channels    MstDistrictChannel[] // Relasi relasional ke junction

  @@unique([ouKode, kode], name: "ou_kode_kode_unique")
  @@map("mst_district")
}
```

### 3.2. Data Awal Seed (`seed.ts`)
```typescript
const initialChannels = [
  { kode: 'AGEN', nama: 'Agen', urutan: 1 },
  { kode: 'WHOLESALE', nama: 'Wholesale', urutan: 2 },
  { kode: 'RETAIL', nama: 'Retail', urutan: 3 },
  { kode: 'MTI', nama: 'MTI', urutan: 4 },
];
```

---

## 4. Daftar Pekerjaan Terinci (Checklist Eksekusi)

Berikut adalah daftar pekerjaan terstruktur (*step-by-step*) yang dapat langsung dijadikan tiket backlog sprint:

### TAHAP 1: Backend Database & Migration (`hsera-salesmanship-backend`)
- [x] **1.1. Schema Update:** Tambahkan model `MstChannel` dan `MstDistrictChannel` pada `prisma/schema.prisma`.
- [x] **1.2. Migration Execution:** Jalankan `npx prisma db push` & `generate` untuk membuat tabel di PostgreSQL.
- [x] **1.3. Seeding Channel Awal:** Tambahkan data awal 4 channel (`AGEN`, `WHOLESALE`, `RETAIL`, `MTI`) di `src/infrastructure/database/seed.ts` dan jalankan seed.

### TAHAP 2: Backend Domain, Repository & API
- [x] **2.1. Channel Entity & Repository:** Buat entity `Channel` dan repository interface `IChannelRepository` serta implementasi `PrismaChannelRepository`.
- [x] **2.2. Endpoint Master Channel:** Buat `GetChannelsUseCase` dan `ChannelController` dengan route `GET /api/salesmanship/channels` untuk menyediakan daftar channel ke frontend.
- [x] **2.3. Update District Repository:**
  - Perbarui `PrismaDistrictRepository.findAll()` agar meng-`include: { channels: { include: { channel: true } } }`.
  - Perbarui method `create()` dan `update()` agar menerima array `channelIds: string[]` dan mengelola transaksi pada tabel `mst_district_channel`.
- [x] **2.4. Update Callsheet Skeleton:** Perbarui `GetCallsheetFormDataUseCase` agar menyertakan array channels pada object `district` (`channels: [{ id, kode, nama }]`).

### TAHAP 3: Frontend Data Layer (`hsera-dashboard`)
- [x] **3.1. Domain Models:** 
  - Buat `src/core/domain/models/Channel.ts`.
  - Perbarui interface `District` di `District.ts`:
    ```typescript
    channels?: Array<{ id: string; kode: string; nama: string }>;
    ```
  - Perbarui `DistrictWriteData` dengan properti `channelIds: string[]`.
- [x] **3.2. Repository Implementation:** Tambahkan method `getChannels()` pada `SalesmanshipRepository` dan hubungkan ke Axios API client.

### TAHAP 4: Frontend UI Teritori Management (`src/presentation/pages/Salesmanship/Territory`)
- [x] **4.1. Types Update:** Tambahkan `channels: Channel[]` dan `channelIds: string[]` pada `types.ts` di folder Territory.
- [x] **4.2. Territory Hook (`useTerritory.ts`):** Load daftar master channel saat halaman dimuat dan sediakan ke state form.
- [x] **4.3. Update Territory Table (`TerritoryTable.tsx`):**
  - Tambahkan kolom header: **`CHANNEL`**.
  - Render daftar channel per baris menggunakan badge pembeda yang stylish:
    - `Agen` : Badge Ungu (`bg-purple-50 text-purple-700 border-purple-200`)
    - `Wholesale` : Badge Biru Sky (`bg-sky-50 text-sky-700 border-sky-200`)
    - `Retail` : Badge Hijau Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
    - `MTI` : Badge Oranye/Amber (`bg-amber-50 text-amber-700 border-amber-200`)
- [x] **4.4. Update Territory Modal (`TerritoryModal.tsx`):**
  - Tambahkan form kontrol **Channel Distribusi (Multi-Select)** berupa checkbox pills interaktif.
  - User dapat memilih satu atau kombinasi beberapa channel (misal: centang `Agen` dan `Wholesale`).
  - Mendukung penambahan channel dinamis dari master `mst_channel`.

### TAHAP 5: Integrasi Form Callsheet & Share WhatsApp (`CallsheetFormPage.tsx`)
- [x] **5.1. Ambil Channel Aktif:** Pada `CallsheetFormPage.tsx`, ekstrak daftar channel dari `formSkeleton.district.channels`.
- [x] **5.2. Format Pesan WhatsApp:**
  - Gabungkan nama-nama channel menjadi string yang dipisahkan koma:
    ```typescript
    const channelDisplay = formSkeleton.district?.channels?.map(c => c.nama).join(", ") || "";
    ```
  - Masukkan ke generator pesan pada baris `Channel : `:
    ```text
    District : DO-012
    Channel : Agen, Wholesale
    ```

### TAHAP 6: Testing & Quality Assurance
- [x] **6.1. Unit Test:** Callsheet matrix calculations test lulus 100%.
- [x] **6.2. Integrasi:** Data channel terhubung dari backend Prisma -> REST API -> Repository -> UI & WhatsApp report.
- [x] **6.3. Build Verification:** `tsc && vite build` (dashboard) dan backend TypeScript build sukses 100% tanpa error.

---

*Status: **SELESAI (COMPLETED)** — Fitur Channel Distribusi (Opsi 2 Relasi Normalisasi M:N) telah selesai diimplementasikan secara end-to-end.*
