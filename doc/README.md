# Dokumentasi Frontend `admin-dashboard`

README ini merangkum framework, library, dan toolchain frontend yang dipakai beserta tempat konfigurasi dan prosedur upgrade. Struktur folder serta arsitektur aplikasi dijelaskan lebih lengkap di [STRUKTUR_FOLDER.md](STRUKTUR_FOLDER.md).

## Stack Frontend

Versi terpasang di bawah berasal dari dependency tree saat dokumentasi diperbarui. `package.json` menyimpan rentang versi, sedangkan `package-lock.json` mengunci versi yang dipasang oleh `npm ci`.

| Teknologi                  | Kegunaan                                | Versi terpasang | Deklarasi package    |
| -------------------------- | --------------------------------------- | --------------: | -------------------- |
| React                      | Library UI berbasis komponen            |          18.3.1 | `^18.2.0`            |
| React DOM                  | Render React ke browser                 |          18.3.1 | `^18.2.0`            |
| TypeScript                 | Bahasa dan type checking                |           5.9.3 | `^5.2.2`             |
| Vite                       | Dev server dan production bundler       |          5.4.21 | `^5.1.3`             |
| Tailwind CSS               | Utility-first CSS framework             |          3.4.19 | `^3.4.1`             |
| React Router DOM           | Routing SPA                             |          6.30.4 | `^6.22.1`            |
| Axios                      | HTTP client                             |          1.19.0 | `^1.6.7`             |
| jwt-decode                 | Decode payload JWT di browser           |           4.0.0 | `^4.0.0`             |
| Lucide React               | Ikon UI                                 |         0.330.0 | `^0.330.0`           |
| PostCSS + Autoprefixer     | Pemrosesan dan prefix CSS               | 8.5.26 + 10.5.4 | lihat `package.json` |
| Vitest                     | Test runner yang kompatibel dengan Vite |           2.1.9 | `^2.1.9`             |
| Testing Library + jsdom    | Pengujian komponen React di DOM virtual | 16.3.3 + 25.0.1 | lihat `package.json` |
| ESLint + TypeScript ESLint | Lint source TypeScript/React            | 8.57.1 + 8.71.0 | lihat `package.json` |
| eslint-plugin-boundaries   | Menegakkan batas dependensi arsitektur  |           7.2.0 | `^7.2.0`             |

### Runtime dan konfigurasi

- **React 18** menangani UI; state berbagi sesi menggunakan React Context.
- **Tailwind CSS 3** digunakan bersama token aplikasi dari `src/presentation/theme/designSystem.ts` dan `tailwind.config.js`.
- **Vite 5** menyediakan dev server dan build; plugin React ada di `vite.config.ts`.
- Alias source **`@/*`** diarahkan ke `src/*` dan dikonfigurasi konsisten di `tsconfig.json` serta `vite.config.ts`.
- URL backend dibaca dari `VITE_API_URL`; jika tidak diset, aplikasi memakai `http://localhost:5001`. URL divalidasi di `src/core/infrastructure/api/environment.ts`.
- Konfigurasi ESLint dan aturan batas `core`/`presentation` berada di `.eslintrc.cjs`.

Untuk environment lokal, buat file `.env.local` di `admin-dashboard/`:

```dotenv
VITE_API_URL=http://localhost:5001
```

Hanya variabel dengan prefix `VITE_` yang diekspos oleh Vite ke bundle browser. Jangan taruh secret atau kredensial server pada variabel tersebut.

## Perintah Harian

Jalankan dari direktori `admin-dashboard/`:

```sh
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
npm run preview
```

`npm run build` menjalankan `tsc` lalu Vite production build. `npm run lint` memeriksa source dan dependency boundaries. `npm run test` menjalankan seluruh test Vitest.

## Panduan Upgrade Framework

### Prinsip

1. Perbarui satu kelompok teknologi dalam satu perubahan: misalnya React, Tailwind, atau Vite/tooling. Upgrade lintas major beberapa framework sekaligus akan menyulitkan pencarian sumber regresi.
2. Periksa peer dependency dan migration guide resmi sebelum memilih versi. Jangan mengatasi konflik peer dengan `--force` sebagai langkah pertama.
3. Perbarui `package.json` dan `package-lock.json` bersama-sama. Commit keduanya jika perubahan versi memang disetujui.
4. Jalankan build, lint, test, dan smoke test alur yang terkait sebelum menganggap upgrade selesai.

### Urutan Kerja

1. Pastikan baseline bersih:

   ```sh
   npm ci
   npm run build
   npm run lint
   npm run test
   ```

2. Tinjau dependensi langsung dan versi yang tersedia:

   ```sh
   npm ls --depth=0
   npm outdated
   ```

3. Upgrade paket target secara eksplisit. Contoh untuk upgrade patch/minor dalam major yang sama:

   ```sh
   npm install react@^18 react-dom@^18
   npm install -D tailwindcss@^3
   ```

   Gunakan target major yang memang direncanakan setelah membaca panduan migrasi. Jangan menyalin contoh perintah tersebut jika ingin berpindah major.

4. Periksa perubahan manifest/lockfile, jalankan pemeriksaan berikut, lalu uji halaman penting di browser:

   ```sh
   npm run build
   npm run lint
   npm run test
   npm run dev
   ```

5. Tutup perubahan dengan mencatat versi yang dipilih, migration yang dilakukan, dan isu kompatibilitas yang masih ada.

### Catatan Kompatibilitas

- **React dan React DOM** harus di-upgrade sebagai pasangan versi yang kompatibel. Periksa peer dependency `@types/react` dan `@types/react-dom` saat berpindah major.
- **Tailwind saat ini v3.** Tailwind v4 merupakan migrasi major: konfigurasi JavaScript, PostCSS plugin, browser support, dan cara import CSS berbeda. Jangan hanya mengganti nomor versi; ikuti migration guide v4 dan validasi semua class/token yang dipakai.
- **Vite dan Vitest saling terkait.** Proyek ini menggunakan Vite 5 dengan Vitest 2. Jangan memasang versi Vitest terbaru secara otomatis tanpa memeriksa rentang Vite yang didukung. Jika Vite dinaikkan, naikkan dan validasi Vitest dalam langkah tooling yang sama.
- **React Router saat ini v6.** Upgrade ke major berikutnya dapat mengubah API route/data router; cek semua route di `src/routes/AppRoutes.tsx`.
- Sesudah perubahan TypeScript, jalankan `npm run build`; konfigurasi strict akan menangkap ketidakcocokan tipe sekalipun lint tidak menemukannya.

## Peta Konfigurasi

| Area                                         | File                                         |
| -------------------------------------------- | -------------------------------------------- |
| Dependensi, rentang versi, npm scripts       | `package.json`                               |
| Versi dependency yang direproduksi           | `package-lock.json`                          |
| TypeScript dan alias type-checker            | `tsconfig.json`                              |
| Vite, alias runtime, konfigurasi Vitest      | `vite.config.ts`                             |
| Tailwind theme dan content scan              | `tailwind.config.js`                         |
| PostCSS dan Autoprefixer                     | `postcss.config.js`                          |
| ESLint dan dependency boundaries             | `.eslintrc.cjs`                              |
| Entry style, Tailwind directives, CSS global | `src/index.css`                              |
| Design tokens aplikasi                       | `src/presentation/theme/designSystem.ts`     |
| Base URL dan validasi API environment        | `src/core/infrastructure/api/environment.ts` |

## Review Proyek Frontend

**Scope:** review ini mencakup source dan konfigurasi `admin-dashboard/`, bukan implementasi backend. Pemeriksaan dependency menggunakan `npm audit --omit=dev` pada 30 September 2026.

### Temuan Prioritas

1. **Sedang — advisory pada React Router.** `npm audit --omit=dev` melaporkan dua advisory moderat untuk `react-router`, termasuk open redirect melalui backslash pada `Link`/`useNavigate`; versi yang terpasang berada pada rentang terdampak. Risiko perlu ditangani dengan memperbarui `react-router-dom` ke versi perbaikan yang kompatibel dengan v6, lalu memeriksa navigasi dari menu backend dan menjalankan test/build. Advisory SSR hydration kemungkinan tidak relevan pada aplikasi client-rendered ini, tetapi tetap perlu dicatat sampai dependency diperbarui. Jalur menu dinamis ada di [Sidebar.tsx](../src/presentation/components/layout/Sidebar.tsx).

2. **Sedang — token sesi berada di `localStorage`.** [AuthContext.tsx](../src/presentation/context/AuthContext.tsx) menyimpan bearer token di `localStorage`, sehingga script yang berhasil berjalan dalam origin aplikasi berpotensi membacanya. Pertahankan mitigasi XSS (escaping, hindari HTML mentah, CSP di hosting) dan evaluasi cookie `HttpOnly`, `Secure`, `SameSite` bila arsitektur backend mendukungnya. Decode JWT di browser hanya untuk membaca klaim UI; bukan verifikasi signature atau otorisasi keamanan.

3. **Sedang — fallback API dapat salah konfigurasi di production.** [environment.ts](../src/core/infrastructure/api/environment.ts) memakai `http://localhost:5001` saat `VITE_API_URL` tidak diset. Ini memudahkan pengembangan lokal, tetapi build production dengan environment yang terlupa akan mencoba menghubungi localhost milik pengguna. Pertimbangkan mewajibkan variabel pada build production atau validasi environment khusus mode production.

4. **Sedang — lookup karyawan dibatasi 100 record.** [useKaryawanList.ts](../src/presentation/pages/Master/Karyawan/hooks/useKaryawanList.ts) dan [RoleUserPage.tsx](../src/presentation/pages/Settings/RoleUser/RoleUserPage.tsx) memakai satu halaman dengan `limit: 100` untuk pilihan atasan/profil karyawan. Pada organisasi dengan lebih dari 100 karyawan, opsi yang lebih jauh tidak dapat dipilih. Gunakan endpoint lookup/search atau pagination yang dapat dicari.

5. **Rendah–sedang — respons fetch yang berlomba dapat menampilkan hasil usang.** [useKaryawanList.ts](../src/presentation/pages/Master/Karyawan/hooks/useKaryawanList.ts) tidak membatalkan request atau mengabaikan hasil lama saat filter berubah cepat. Jika request lama selesai setelah request baru, hasil lama berpotensi menimpa daftar terbaru. Tambahkan `AbortController`, request sequence, atau server-state cache saat masalah ini terlihat dalam pemakaian.

6. **Rendah — link Design System masih selalu tampil di Sidebar.** Route `/design-system` hanya didaftarkan dalam mode development di [AppRoutes.tsx](../src/routes/AppRoutes.tsx), sementara tombolnya tidak dibatasi mode di [Sidebar.tsx](../src/presentation/components/layout/Sidebar.tsx). Pada production tombol mengarah ke fallback Coming Soon. Sembunyikan link saat production atau tetapkan route production yang memang diinginkan.

### Kondisi Kualitas

- **Arsitektur: baik.** Presentation tidak mengimpor infrastructure langsung; kontrak domain, repository, use case, DTO/mapper, dan composition root sudah tersedia. Lint dependency boundaries menguji batas ini.
- **Modularitas Master: baik.** Karyawan memisahkan list dan form hook; komponen tabel/drawer berada dekat dengan fitur. Route menggunakan lazy loading dan komponen UI bersama dikelompokkan menurut peran.
- **Validasi: awal namun berjalan.** `npm run build`, `npm run lint`, dan `npm run test` berhasil pada pemeriksaan terakhir. Suite berisi 12 test di 5 file: mapper, sorting menu, environment URL, dan ErrorBoundary. Belum ada test untuk repository/use case, alur CRUD/hook, autentikasi, route ACL, maupun interaksi form utama.
- **Maintainability: ada modul lama yang masih besar.** File terbesar yang terukur adalah halaman showcase Design System (~698 baris), RoleUser (~577), Role (~429), dan Menu (~424). Pertimbangkan pecah controller/form/tabel per fitur sebagaimana pola Master.
- **ErrorBoundary: cakupan terbatas sesuai mekanisme React.** ErrorBoundary menangkap error render lifecycle, tetapi tidak menangkap exception dalam event handler atau promise. Kegagalan async ditangani terpisah melalui `AppError` dan toast; logging saat ini hanya ke console.
- **Server state: belum dicache.** Fetching menggunakan hooks/useEffect biasa. Ini cukup untuk skala sekarang, tetapi TanStack Query dapat dipertimbangkan jika kebutuhan cache, invalidasi, deduplikasi, dan optimistic update meningkat.

### Rencana Tindak Lanjut

1. Perbarui React Router untuk menutup advisory, cek changelog/peer dependency, lalu jalankan `npm audit --omit=dev`, `npm run build`, `npm run lint`, dan `npm run test`.
2. Pastikan backend memverifikasi JWT dan ACL untuk setiap endpoint; jangan mengandalkan `hasPermission` di frontend sebagai kontrol akses.
3. Ganti lookup 100 karyawan dengan pencarian/pagination untuk pilihan supervisor dan relasi akun.
4. Tambahkan test untuk AuthContext/ProtectedRoute, use case/repository, serta alur simpan role dan karyawan.
5. Pecah halaman Settings besar secara bertahap; jangan mengubah seluruh modul sekaligus agar regresi mudah dilokalisasi.
6. Evaluasi CSP, penyimpanan token, telemetry error, dan server-state caching bersama kebutuhan deployment serta backend.
