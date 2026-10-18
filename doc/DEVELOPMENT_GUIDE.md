# Panduan Pengembangan & Lembar Praktis (Developer Guide)

> **Tujuan Dokumen**: Panduan langkah-demi-langkah bagi pengembang dan AI untuk menambah fitur baru secara konsisten tanpa melanggar batasan arsitektur, serta ringkasan solusi untuk masalah teknis umum (*gotchas*).

---

## 1. Alur Menambahkan Fitur Baru (Clean Architecture Workflow)

Saat membuat fitur baru di `hsera-dashboard`, ikuti urutan 8 langkah berikut:

### Langkah 1: Model Domain (`core/domain/models/`)
Buat interface data bisnis murni. Jangan impor React, Axios, atau komponen UI.
```typescript
// src/core/domain/models/Example.ts
export interface ExampleItem {
  id: string;
  kode: string;
  nama: string;
}
```

### Langkah 2: Kontrak Repository (`core/domain/repositories/`)
Definisikan interface abstraksi akses data.
```typescript
// src/core/domain/repositories/IExampleRepository.ts
import { ExampleItem } from '../models/Example';

export interface IExampleRepository {
  getAll(): Promise<ExampleItem[]>;
  save(item: ExampleItem): Promise<ExampleItem>;
}
```

### Langkah 3: Implementasi HTTP (`core/infrastructure/repositories/`)
Implementasikan interface menggunakan `AxiosHttpClient` (untuk Auth/Core API) atau `SalesmanshipHttpClient` (untuk Salesmanship API).
```typescript
// src/core/infrastructure/repositories/HttpExampleRepository.ts
import { IExampleRepository } from '../../domain/repositories/IExampleRepository';
import { ExampleItem } from '../../domain/models/Example';
import { SalesmanshipHttpClient } from '../api/SalesmanshipHttpClient';

export class HttpExampleRepository implements IExampleRepository {
  async getAll(): Promise<ExampleItem[]> {
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: ExampleItem[] }>('/api/salesmanship/examples');
    return res.data.data;
  }
  async save(item: ExampleItem): Promise<ExampleItem> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; data: ExampleItem }>('/api/salesmanship/examples', item);
    return res.data.data;
  }
}
```

### Langkah 4: Registrasi di Composition Root (`core/di/container.ts`)
Ekspos instance repository atau use case agar dapat diakses oleh presentation layer.
```typescript
// src/core/di/container.ts
import { HttpExampleRepository } from '../infrastructure/repositories/HttpExampleRepository';

export const exampleRepository = new HttpExampleRepository();
```

### Langkah 5: Custom Hook Fitur (`presentation/pages/<Fitur>/hooks/`)
Kelola state UI (loading, error, data, filter) di dalam hook khusus.
```typescript
// src/presentation/pages/Example/hooks/useExample.ts
import { useState, useEffect } from 'react';
import { exampleRepository } from '@/core/di/container';
import { useToast } from '@/presentation/context/ToastContext';

export const useExample = () => {
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    exampleRepository.getAll()
      .then(setData)
      .catch((err) => showToast('error', err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading };
};
```

### Langkah 6: Komponen UI & Halaman (`presentation/pages/<Fitur>/`)
Bangun UI menggunakan hook dan token design system Tailwind.

### Langkah 7: Daftarkan Route & Hak Akses
1. Tambahkan path di [routePaths.ts](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/routes/routePaths.ts).
2. Tambahkan UUID menu di [MenuConstants.ts](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/core/constants/MenuConstants.ts).
3. Daftarkan di [AppRoutes.tsx](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/routes/AppRoutes.tsx) menggunakan `React.lazy` dan bungkus dengan `<ProtectedRoute menuId={...} minLevel={1}>`.

### Langkah 8: Pengujian Vitest
Tulis unit test di folder fitur terkait (contoh: `Example.test.ts`) dan jalankan `npm test`.

---

## 2. Masalah Umum & Solusi (Gotchas & Troubleshooting)

### 1. Prisma Error `libssl.so.1.1: No such file or directory` pada Alpine Linux
* **Penyebab**: Node 20 pada Alpine 3.19+ menggunakan OpenSSL 3.0 (`libssl3`), sedangkan binary default Prisma sering kali mencari OpenSSL 1.1 jika `binaryTargets` tidak ditentukan.
* **Solusi**:
  1. Pada `Dockerfile`, tambahkan:
     ```dockerfile
     RUN apk add --no-cache openssl libc6-compat
     ```
  2. Pada `schema.prisma`:
     ```prisma
     generator client {
       provider      = "prisma-client-js"
       binaryTargets = ["native", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x"]
     }
     ```
  3. Gunakan command startup yang selalu meng-generate prisma di dalam kontainer:
     ```dockerfile
     CMD ["sh", "-c", "npx prisma generate && npm run dev"]
     ```

### 2. Environment Variable `DATABASE_URL` Tertimpa Nilai Localhost di Kontainer Docker
* **Penyebab**: Pemanggilan `dotenv.config({ override: true })` di source code backend menimpa `DATABASE_URL` yang di-inject oleh Docker Compose (`db:5432`) dengan string di file `.env` lokal (`localhost:5433`).
* **Solusi**:
  Gunakan pengecekan sebelum memuat dotenv:
  ```typescript
  if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
  }
  ```

### 3. Nilai Input Form Angka Berubah Sendiri saat Scroll Mouse
* **Penyebab**: Input bertipe `type="number"` pada tabel/form secara default menangkap event *wheel* mouse dan menaikkan/menurunkan angka saat pengguna menggulir halaman.
* **Solusi**:
  Selalu pasang handler blur pada event onWheel:
  ```tsx
  <input
    type="number"
    onWheel={(e) => e.currentTarget.blur()}
    className="..."
  />
  ```

### 4. Dropdown OU Reset ke "Semua Cabang" saat Fitur Dibuka
* **Penyebab**: State filter OU diinisialisasi dengan nilai hardcoded `"all"` alih-alih membaca scope pengguna login.
* **Solusi**:
  Ambil OU Pengguna dari `useAuth()` dan jadikan nilai awal state:
  ```typescript
  const { user } = useAuth();
  const userOuKode = user?.scope?.unitCode;

  const [filters, setFilters] = useState<FilterState>(() => ({
    ouKode: userOuKode || "all",
    ...
  }));
  ```

### 5. Port Jaringan & Akses Perangkat Lain di LAN
* `VITE_API_URL` dan `VITE_SALESMANSHIP_API_URL` secara otomatis menyesuaikan hostname jika diakses melalui IP LAN (misal `192.168.1.15:5175`) berkat fungsi `resolveApiUrl()` di [environment.ts](file:///Users/dyra/Documents/Docker/hsera/hsera-dashboard/src/core/infrastructure/api/environment.ts).

---

## 3. Perintah Verifikasi Kualitas Kode

Jalankan perintah berikut di folder `hsera-dashboard/`:

```bash
# Menjalankan seluruh pengujian unit
npm test

# Menjalankan pengujian dalam mode pantau (watch)
npm run test:watch

# Memvalidasi type checking TypeScript & build bundle Vite
npm run build

# Memeriksa kepatuhan linter & batasan arsitektur Clean Architecture
npm run lint
```
