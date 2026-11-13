import { Bank } from '../domain/models/Bank';

/**
 * Daftar Resmi Master Bank di Indonesia
 * Dikurasi berdasarkan standar Sandi Bank Indonesia (SKNBI) & Jaringan ATM Bersama/PRIMA.
 * Menggunakan UUID deterministik agar kompatibel dengan tipe UUID di basis data PostgreSQL.
 */
export const INDONESIA_BANKS: Bank[] = [
  // --- BANK BUMN / PEMERINTAH ---
  {
    id: 'b0000000-0000-4000-a000-000000000002',
    code: '002',
    name: 'Bank Rakyat Indonesia',
    alias: 'BRI',
    category: 'BUMN',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000008',
    code: '008',
    name: 'Bank Mandiri',
    alias: 'MANDIRI',
    category: 'BUMN',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000009',
    code: '009',
    name: 'Bank Negara Indonesia',
    alias: 'BNI',
    category: 'BUMN',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000200',
    code: '200',
    name: 'Bank Tabungan Negara',
    alias: 'BTN',
    category: 'BUMN',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000451',
    code: '451',
    name: 'Bank Syariah Indonesia',
    alias: 'BSI',
    category: 'SYARIAH',
  },

  // --- BANK SWASTA NASIONAL TERKEMUKA ---
  {
    id: 'b0000000-0000-4000-a000-000000000014',
    code: '014',
    name: 'Bank Central Asia',
    alias: 'BCA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000022',
    code: '022',
    name: 'Bank CIMB Niaga',
    alias: 'CIMB NIAGA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000011',
    code: '011',
    name: 'Bank Danamon Indonesia',
    alias: 'DANAMON',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000013',
    code: '013',
    name: 'Bank Permata',
    alias: 'PERMATA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000016',
    code: '016',
    name: 'Bank Maybank Indonesia',
    alias: 'MAYBANK',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000019',
    code: '019',
    name: 'Bank Panin',
    alias: 'PANIN',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000028',
    code: '028',
    name: 'Bank OCBC NISP',
    alias: 'OCBC',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000426',
    code: '426',
    name: 'Bank Mega',
    alias: 'MEGA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000147',
    code: '147',
    name: 'Bank Muamalat Indonesia',
    alias: 'MUAMALAT',
    category: 'SYARIAH',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000153',
    code: '153',
    name: 'Bank Sinarmas',
    alias: 'SINARMAS',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000441',
    code: '441',
    name: 'KB Bank (Bank Bukopin)',
    alias: 'KB BUKOPIN',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000213',
    code: '213',
    name: 'Bank BTPN / Jenius',
    alias: 'JENIUS',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000037',
    code: '037',
    name: 'Bank Artha Graha Internasional',
    alias: 'ARTHA GRAHA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000023',
    code: '023',
    name: 'Bank UOB Indonesia',
    alias: 'UOB',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000212',
    code: '212',
    name: 'Bank Woori Saudara (BWS)',
    alias: 'BWS',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000503',
    code: '503',
    name: 'Bank Nationalnobu',
    alias: 'NOBU',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000485',
    code: '485',
    name: 'Bank MNC Internasional',
    alias: 'MNC',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000513',
    code: '513',
    name: 'Bank Ina Perdana',
    alias: 'BANK INA',
    category: 'SWASTA',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000523',
    code: '523',
    name: 'Bank Sahabat Sampoerna',
    alias: 'SAMPOERNA',
    category: 'SWASTA',
  },

  // --- BANK DIGITAL ---
  {
    id: 'b0000000-0000-4000-a000-000000000542',
    code: '542',
    name: 'Bank Jago',
    alias: 'JAGO',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000535',
    code: '535',
    name: 'SeaBank Indonesia',
    alias: 'SEABANK',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000501',
    code: '501',
    name: 'BCA Digital (blu)',
    alias: 'BLU',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000490',
    code: '490',
    name: 'Bank Neo Commerce (Neobank)',
    alias: 'NEOBANK',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000472',
    code: '472',
    name: 'Bank Saqu (Bank Jasa Jakarta)',
    alias: 'BANK SAQU',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000567',
    code: '567',
    name: 'Allo Bank Indonesia',
    alias: 'ALLO BANK',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000525',
    code: '525',
    name: 'Bank Raya Indonesia',
    alias: 'BANK RAYA',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000531',
    code: '531',
    name: 'Amar Bank (Tunaiku)',
    alias: 'AMAR BANK',
    category: 'DIGITAL',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000526',
    code: '526',
    name: 'Bank Aladin Syariah',
    alias: 'ALADIN',
    category: 'DIGITAL',
  },

  // --- BANK PEMBANGUNAN DAERAH (BPD) ---
  {
    id: 'b0000000-0000-4000-a000-000000000110',
    code: '110',
    name: 'Bank BJB (Jawa Barat & Banten)',
    alias: 'BJB',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000425',
    code: '425',
    name: 'Bank BJB Syariah',
    alias: 'BJB SYARIAH',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000111',
    code: '111',
    name: 'Bank DKI Jakarta',
    alias: 'BANK DKI',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000112',
    code: '112',
    name: 'Bank BPD DIY (Yogyakarta)',
    alias: 'BPD DIY',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000113',
    code: '113',
    name: 'Bank Jateng (Jawa Tengah)',
    alias: 'BANK JATENG',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000114',
    code: '114',
    name: 'Bank Jatim (Jawa Timur)',
    alias: 'BANK JATIM',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000115',
    code: '115',
    name: 'Bank Jambi',
    alias: 'BANK JAMBI',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000116',
    code: '116',
    name: 'Bank Aceh Syariah',
    alias: 'BANK ACEH',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000117',
    code: '117',
    name: 'Bank Sumut',
    alias: 'BANK SUMUT',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000118',
    code: '118',
    name: 'Bank Nagari (Sumatera Barat)',
    alias: 'BANK NAGARI',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000119',
    code: '119',
    name: 'Bank Riau Kepri Syariah',
    alias: 'RIAU KEPRI',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000120',
    code: '120',
    name: 'Bank Sumsel Babel',
    alias: 'SUMSEL BABEL',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000121',
    code: '121',
    name: 'Bank Lampung',
    alias: 'BANK LAMPUNG',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000122',
    code: '122',
    name: 'Bank Kalsel (Kalimantan Selatan)',
    alias: 'BANK KALSEL',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000123',
    code: '123',
    name: 'Bank Kalbar (Kalimantan Barat)',
    alias: 'BANK KALBAR',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000124',
    code: '124',
    name: 'Bank Kaltimtara (Kaltim & Kaltara)',
    alias: 'KALTIMTARA',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000125',
    code: '125',
    name: 'Bank Kalteng (Kalimantan Tengah)',
    alias: 'BANK KALTENG',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000126',
    code: '126',
    name: 'Bank Sulselbar (Sulawesi Selatan & Barat)',
    alias: 'SULSELBAR',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000127',
    code: '127',
    name: 'Bank Sulutgo (Sulawesi Utara & Gorontalo)',
    alias: 'SULUTGO',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000128',
    code: '128',
    name: 'Bank NTB Syariah',
    alias: 'BANK NTB',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000129',
    code: '129',
    name: 'Bank BPD Bali',
    alias: 'BPD BALI',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000130',
    code: '130',
    name: 'Bank NTT (Nusa Tenggara Timur)',
    alias: 'BANK NTT',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000131',
    code: '131',
    name: 'Bank Maluku Malut',
    alias: 'MALUKU MALUT',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000132',
    code: '132',
    name: 'Bank Papua',
    alias: 'BANK PAPUA',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000133',
    code: '133',
    name: 'Bank Bengkulu',
    alias: 'BANK BENGKULU',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000134',
    code: '134',
    name: 'Bank Sulteng (Sulawesi Tengah)',
    alias: 'BANK SULTENG',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000135',
    code: '135',
    name: 'Bank Sultra (Sulawesi Tenggara)',
    alias: 'BANK SULTRA',
    category: 'BPD',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000137',
    code: '137',
    name: 'Bank Banten',
    alias: 'BANK BANTEN',
    category: 'BPD',
  },

  // --- BANK SYARIAH LAINNYA ---
  {
    id: 'b0000000-0000-4000-a000-000000000536',
    code: '536',
    name: 'BCA Syariah',
    alias: 'BCA SYARIAH',
    category: 'SYARIAH',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000506',
    code: '506',
    name: 'Bank Mega Syariah',
    alias: 'MEGA SYARIAH',
    category: 'SYARIAH',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000547',
    code: '547',
    name: 'Bank BTPN Syariah',
    alias: 'BTPN SYARIAH',
    category: 'SYARIAH',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000517',
    code: '517',
    name: 'Bank Panin Dubai Syariah',
    alias: 'PANIN SYARIAH',
    category: 'SYARIAH',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000405',
    code: '405',
    name: 'Bank Victoria Syariah',
    alias: 'VICTORIA SYARIAH',
    category: 'SYARIAH',
  },

  // --- BANK ASING & CAMPURAN ---
  {
    id: 'b0000000-0000-4000-a000-000000000087',
    code: '087',
    name: 'HSBC Indonesia',
    alias: 'HSBC',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000031',
    code: '031',
    name: 'Citibank N.A. Indonesia',
    alias: 'CITIBANK',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000050',
    code: '050',
    name: 'Standard Chartered Bank',
    alias: 'STANCHAR',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000046',
    code: '046',
    name: 'Bank DBS Indonesia',
    alias: 'DBS',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000048',
    code: '048',
    name: 'Bank ICBC Indonesia',
    alias: 'ICBC',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000484',
    code: '484',
    name: 'Bank KEB Hana Indonesia',
    alias: 'HANA BANK',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000152',
    code: '152',
    name: 'Bank Shinhan Indonesia',
    alias: 'SHINHAN',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000040',
    code: '040',
    name: 'Bangkok Bank',
    alias: 'BANGKOK BANK',
    category: 'ASING',
  },
  {
    id: 'b0000000-0000-4000-a000-000000000095',
    code: '095',
    name: 'Bank Commonwealth',
    alias: 'COMMONWEALTH',
    category: 'ASING',
  },
];

/**
 * Mencari data bank berdasarkan ID (UUID), Kode Sandi (misal: "014"), atau Alias (misal: "BCA").
 */
export function findBankByIdOrCode(query?: string | null): Bank | undefined {
  if (!query || typeof query !== 'string') return undefined;
  const clean = query.trim().toLowerCase();
  return INDONESIA_BANKS.find(
    (b) =>
      b.id.toLowerCase() === clean ||
      b.code === clean ||
      b.alias.toLowerCase() === clean ||
      b.name.toLowerCase() === clean
  );
}

/**
 * Memformat label bank standar untuk tampilan (e.g. "[014] Bank Central Asia (BCA)")
 */
export function formatBankLabel(bankOrQuery?: Bank | string | null): string {
  if (!bankOrQuery) return '-';
  const bank = typeof bankOrQuery === 'string' ? findBankByIdOrCode(bankOrQuery) : bankOrQuery;
  if (!bank) return typeof bankOrQuery === 'string' ? bankOrQuery : '-';
  return `[${bank.code}] ${bank.name}${bank.alias ? ` (${bank.alias})` : ''}`;
}

