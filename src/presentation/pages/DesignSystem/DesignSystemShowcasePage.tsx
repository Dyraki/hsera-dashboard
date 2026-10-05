import React, { useState } from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import {
  Input,
  Textarea,
  Select,
  SearchInput,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
} from '../../components/form';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

export const DesignSystemShowcasePage: React.FC = () => {
  // Form State Demo
  const [textValue, setTextValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option-1');
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [dateValue, setDateValue] = useState('2026-09-13');

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-6xl pb-20">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" dot>
              Official Design System
            </Badge>
            <Badge variant="gold">Framework V1</Badge>
          </div>
          <h1 className="text-h1 text-gray-900">Design System Guidelines & UI Components</h1>
          <p className="text-body text-gray-600 mt-2 max-w-3xl">
            Pondasi desain modern SaaS, profesional, clean, dan business-oriented. Memprioritaskan
            konsistensi, usability, accessibility, dan kemudahan implementasi.
          </p>
        </div>

        {/* ============================================================
            A. FOUNDATION SECTION
            ============================================================ */}
        <section className="space-y-8">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-h2 text-gray-900">A. Foundation</h2>
            <p className="text-body-sm text-gray-500 mt-1">
              Token warna brand, semantik, neutral grayscale, tipografi, skala 4px grid, dan border radius.
            </p>
          </div>

          {/* 1. BRAND COLOR */}
          <div className="space-y-4">
            <h3 className="text-h3 text-gray-900">1. Brand Color</h3>
            <p className="text-body-sm text-gray-600">
              <span className="font-semibold text-gray-900">#231043</span> sebagai identitas brand utama,{' '}
              <span className="font-semibold text-gray-900">#6D28D9</span> sebagai warna interactive/action, dan{' '}
              <span className="font-semibold text-gray-900">#D3B973</span> sebagai aksen premium.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="rounded-lg p-3 bg-[#231043] text-white shadow-xs">
                <div className="text-xs opacity-75 font-mono">Primary 900</div>
                <div className="text-sm font-bold mt-4 font-mono">#231043</div>
                <div className="text-[11px] opacity-75 mt-0.5">Brand Identity</div>
              </div>
              <div className="rounded-lg p-3 bg-[#231034] text-white shadow-xs">
                <div className="text-xs opacity-75 font-mono">Primary 800</div>
                <div className="text-sm font-bold mt-4 font-mono">#231034</div>
                <div className="text-[11px] opacity-75 mt-0.5">Dark Brand</div>
              </div>
              <div className="rounded-lg p-3 bg-[#3B176D] text-white shadow-xs">
                <div className="text-xs opacity-75 font-mono">Primary 700</div>
                <div className="text-sm font-bold mt-4 font-mono">#3B176D</div>
                <div className="text-[11px] opacity-75 mt-0.5">Dark Purple</div>
              </div>
              <div className="rounded-lg p-3 bg-[#6D28D9] text-white shadow-xs ring-2 ring-primary-600 ring-offset-2">
                <div className="text-xs opacity-75 font-mono">Primary 600</div>
                <div className="text-sm font-bold mt-4 font-mono">#6D28D9</div>
                <div className="text-[11px] opacity-75 mt-0.5">Primary Action ★</div>
              </div>
              <div className="rounded-lg p-3 bg-[#7C3AED] text-white shadow-xs">
                <div className="text-xs opacity-75 font-mono">Primary 500</div>
                <div className="text-sm font-bold mt-4 font-mono">#7C3AED</div>
                <div className="text-[11px] opacity-75 mt-0.5">Highlight</div>
              </div>
              <div className="rounded-lg p-3 bg-[#EDE9FE] text-primary-900 border border-purple-200">
                <div className="text-xs text-primary-700 font-mono">Primary 100</div>
                <div className="text-sm font-bold mt-4 font-mono">#EDE9FE</div>
                <div className="text-[11px] text-primary-700 mt-0.5">Light Focus Ring</div>
              </div>
              <div className="rounded-lg p-3 bg-[#F5F3FF] text-primary-900 border border-purple-100">
                <div className="text-xs text-primary-700 font-mono">Primary 50</div>
                <div className="text-sm font-bold mt-4 font-mono">#F5F3FF</div>
                <div className="text-[11px] text-primary-700 mt-0.5">Subtle Bg</div>
              </div>
            </div>

            {/* Accent Gold */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Accent Gold (Premium Emphasis)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-lg p-3 bg-[#B89B4A] text-white shadow-xs">
                  <div className="text-xs opacity-75 font-mono">Gold 600</div>
                  <div className="text-sm font-bold mt-3 font-mono">#B89B4A</div>
                  <div className="text-[11px] opacity-75 mt-0.5">Premium Accent</div>
                </div>
                <div className="rounded-lg p-3 bg-[#D3B973] text-primary-900 shadow-xs">
                  <div className="text-xs text-primary-900/70 font-mono">Gold 500</div>
                  <div className="text-sm font-bold mt-3 font-mono">#D3B973</div>
                  <div className="text-[11px] text-primary-900/70 mt-0.5">Signature Gold</div>
                </div>
                <div className="rounded-lg p-3 bg-[#F5EED5] text-primary-900 border border-amber-200">
                  <div className="text-xs text-amber-900/70 font-mono">Gold 100</div>
                  <div className="text-sm font-bold mt-3 font-mono">#F5EED5</div>
                  <div className="text-[11px] text-amber-900/70 mt-0.5">Light Accent Bg</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SEMANTIC COLOR */}
          <div className="space-y-4">
            <h3 className="text-h3 text-gray-900">2. Semantic Color</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Success */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Success</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#16A34A] text-white text-center">500: #16A34A</div>
                  <div className="p-2 rounded bg-[#15803D] text-white text-center">600: #15803D</div>
                  <div className="p-2 rounded bg-[#DCFCE7] text-green-900 text-center border">100: #DCFCE7</div>
                  <div className="p-2 rounded bg-[#F0FDF4] text-green-900 text-center border">50: #F0FDF4</div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Warning</span>
                  <Badge variant="warning">Alert</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#F59E0B] text-white text-center">500: #F59E0B</div>
                  <div className="p-2 rounded bg-[#B45309] text-white text-center">600: #B45309</div>
                  <div className="p-2 rounded bg-[#FEF3C7] text-amber-900 text-center border">100: #FEF3C7</div>
                  <div className="p-2 rounded bg-[#FFFBEB] text-amber-900 text-center border">50: #FFFBEB</div>
                </div>
              </div>

              {/* Error */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Error</span>
                  <Badge variant="error">Critical</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#DC2626] text-white text-center">500: #DC2626</div>
                  <div className="p-2 rounded bg-[#B91C1C] text-white text-center">600: #B91C1C</div>
                  <div className="p-2 rounded bg-[#FEE2E2] text-red-900 text-center border">100: #FEE2E2</div>
                  <div className="p-2 rounded bg-[#FEF2F2] text-red-900 text-center border">50: #FEF2F2</div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Info</span>
                  <Badge variant="info">Notice</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#0284C7] text-white text-center">500: #0284C7</div>
                  <div className="p-2 rounded bg-[#0369A1] text-white text-center">600: #0369A1</div>
                  <div className="p-2 rounded bg-[#E0F2FE] text-sky-900 text-center border">100: #E0F2FE</div>
                  <div className="p-2 rounded bg-[#F0F9FF] text-sky-900 text-center border">50: #F0F9FF</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. NEUTRAL / GRAY */}
          <div className="space-y-4">
            <h3 className="text-h3 text-gray-900">3. Neutral / Gray</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-11 gap-2">
              <div className="p-2.5 rounded-lg bg-[#111827] text-white text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 950</div>
                <div className="text-xs font-bold font-mono mt-2">#111827</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1F2937] text-white text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 900</div>
                <div className="text-xs font-bold font-mono mt-2">#1F2937</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#374151] text-white text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 700</div>
                <div className="text-xs font-bold font-mono mt-2">#374151</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#4B5563] text-white text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 600</div>
                <div className="text-xs font-bold font-mono mt-2">#4B5563</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#6B7280] text-white text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 500</div>
                <div className="text-xs font-bold font-mono mt-2">#6B7280</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#9CA3AF] text-gray-900 text-center">
                <div className="text-[10px] opacity-75 font-mono">Gray 400</div>
                <div className="text-xs font-bold font-mono mt-2">#9CA3AF</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#D1D5DB] text-gray-900 text-center border">
                <div className="text-[10px] opacity-75 font-mono">Gray 300</div>
                <div className="text-xs font-bold font-mono mt-2">#D1D5DB</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#E5E7EB] text-gray-900 text-center border">
                <div className="text-[10px] opacity-75 font-mono">Gray 200</div>
                <div className="text-xs font-bold font-mono mt-2">#E5E7EB</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F3F4F6] text-gray-900 text-center border">
                <div className="text-[10px] opacity-75 font-mono">Gray 100</div>
                <div className="text-xs font-bold font-mono mt-2">#F3F4F6</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F9FAFB] text-gray-900 text-center border">
                <div className="text-[10px] opacity-75 font-mono">Gray 50</div>
                <div className="text-xs font-bold font-mono mt-2">#F9FAFB</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white text-gray-900 text-center border shadow-2xs">
                <div className="text-[10px] opacity-75 font-mono">White</div>
                <div className="text-xs font-bold font-mono mt-2">#FFFFFF</div>
              </div>
            </div>
          </div>

          {/* 4. TYPOGRAPHY */}
          <div className="space-y-4">
            <h3 className="text-h3 text-gray-900">4. Typography Scale (Inter)</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 divide-y divide-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">Display: 48px / 700</span>
                <span className="text-display text-gray-950 flex-1">Modern SaaS Platform</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">H1: 36px / 700</span>
                <span className="text-h1 text-gray-900 flex-1">Core Authentication Portal</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">H2: 30px / 700</span>
                <span className="text-h2 text-gray-900 flex-1">User & Role Management</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">H3: 24px / 600</span>
                <span className="text-h3 text-gray-900 flex-1">Access Control List Settings</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">H4: 20px / 600</span>
                <span className="text-h4 text-gray-900 flex-1">Security Audit & Session Policies</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">Body Large: 18px / 400</span>
                <span className="text-body-lg text-gray-700 flex-1">
                  Clean Architecture simplifies multi-tier business workflows.
                </span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">Body: 16px / 400</span>
                <span className="text-body text-gray-700 flex-1">
                  Default body text used across tables, descriptions, and dashboard cards.
                </span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">Body Small: 14px / 400</span>
                <span className="text-body-sm text-gray-600 flex-1">
                  Form labels, table headers, button labels, and secondary information.
                </span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 w-36">Caption: 12px / 400</span>
                <span className="text-caption text-gray-500 flex-1">
                  Helper text, timestamps, badge labels, and footer metadata.
                </span>
              </div>
            </div>
          </div>

          {/* 5. BORDER RADIUS & SPACING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-h3 text-gray-900">5. Border Radius</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">XS: 4px</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-xs flex items-center justify-center text-xs font-mono text-primary-700">
                    4px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">SM: 6px</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-sm flex items-center justify-center text-xs font-mono text-primary-700">
                    6px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">MD: 8px (Button / Input) ★</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-md flex items-center justify-center text-xs font-mono text-primary-700">
                    8px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">LG: 12px (Card Default) ★</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-lg flex items-center justify-center text-xs font-mono text-primary-700">
                    12px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">XL: 16px (Modal / Slide-Over) ★</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-xl flex items-center justify-center text-xs font-mono text-primary-700">
                    16px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">2XL: 24px</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-2xl flex items-center justify-center text-xs font-mono text-primary-700">
                    24px
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Full: 9999px (Badge / Switch) ★</span>
                  <div className="w-16 h-8 bg-primary-100 border border-primary-600 rounded-full flex items-center justify-center text-xs font-mono text-primary-700">
                    Full
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing System */}
            <div className="space-y-3">
              <h3 className="text-h3 text-gray-900">6. Spacing System (4px Grid)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
                {[
                  { step: '1', px: '4px' },
                  { step: '2', px: '8px' },
                  { step: '3', px: '12px' },
                  { step: '4', px: '16px' },
                  { step: '5', px: '20px' },
                  { step: '6', px: '24px' },
                  { step: '8', px: '32px' },
                  { step: '10', px: '40px' },
                  { step: '12', px: '48px' },
                ].map(({ step, px }) => (
                  <div key={step} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-600">
                      Step {step} ({px})
                    </span>
                    <div className="bg-primary-600 rounded-xs h-3" style={{ width: px }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            B. FORM COMPONENTS SHOWCASE SECTION
            ============================================================ */}
        <section className="space-y-8">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-h2 text-gray-900">B. Form Components</h2>
            <p className="text-body-sm text-gray-500 mt-1">
              8 Komponen Form standar dengan visual konsisten, default height 40px, border radius 8px, dan
              Primary 600 focus ring.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 space-y-8">
            {/* 1. INPUT */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">1. Input</h4>
                <span className="text-xs text-gray-500 font-mono">Heights: 32px / 40px / 48px</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Default State"
                  placeholder="Masukkan nama pengguna..."
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  helperText="Gunakan huruf kecil tanpa spasi."
                />
                <Input
                  label="Success State"
                  defaultValue="administrator"
                  success="Username tersedia dan valid."
                />
                <Input
                  label="Error State"
                  defaultValue="admin!"
                  error="Format karakter tidak valid."
                />
              </div>

              {/* Sizes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <Input size="sm" label="Small Input (32px)" placeholder="Size sm (h-8)" />
                <Input size="md" label="Medium Input (40px) ★ Default" placeholder="Size md (h-10)" />
                <Input size="lg" label="Large Input (48px)" placeholder="Size lg (h-12)" />
              </div>

              {/* Disabled */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <Input
                  label="Disabled State"
                  defaultValue="USR-998811"
                  disabled
                  helperText="ID akun otomatis dari sistem."
                />
                <Input
                  label="With Prefix Icon"
                  placeholder="name@company.com"
                  prefixIcon={<Mail size={16} />}
                />
                <Input
                  label="With Suffix Icon"
                  type="password"
                  defaultValue="supersecret"
                  suffixIcon={<Lock size={16} />}
                />
              </div>
            </div>

            {/* 2. TEXTAREA */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">2. Textarea</h4>
                <span className="text-xs text-gray-500 font-mono">Padding 12px, Min-height 96px</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Deskripsi Peran (Default)"
                  placeholder="Tuliskan catatan atau keterangan tugas role ini..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  helperText="Maksimal 500 karakter."
                />
                <Textarea
                  label="Textarea (Disabled)"
                  defaultValue="Deskripsi sistem yang dilindungi dan hanya dapat diubah oleh Super Admin."
                  disabled
                  helperText="Field ini hanya-baca."
                />
              </div>
            </div>

            {/* 3. SELECT */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">3. Select</h4>
                <span className="text-xs text-gray-500 font-mono">ChevronDown icon, Radius 8px</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select
                  label="Pilih Kategori (Default)"
                  placeholder="Pilih kategori menu..."
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={[
                    { value: 'pengaturan', label: 'Pengaturan Sistem' },
                    { value: 'master', label: 'Data Master' },
                    { value: 'transaksi', label: 'Transaksi Operasional' },
                    { value: 'laporan', label: 'Laporan Finansial' },
                  ]}
                  helperText="Pilih modul menu yang sesuai."
                />
                <Select
                  label="Select dengan Error"
                  value=""
                  onChange={() => {}}
                  error="Pilihan kategori wajib ditentukan."
                  options={[{ value: '1', label: 'Item 1' }]}
                />
                <Select
                  label="Select Disabled"
                  value="locked"
                  disabled
                  onChange={() => {}}
                  options={[{ value: 'locked', label: 'Level 1 - Root System (Terkunci)' }]}
                  helperText="Level telah ditetapkan secara permanen."
                />
              </div>
            </div>

            {/* 4. SEARCH */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">4. Search</h4>
                <span className="text-xs text-gray-500 font-mono">Icon 17px, Quick Clear Button</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchInput
                  label="Pencarian Master Data"
                  placeholder="Cari data..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue('')}
                  helperText="Ketik untuk memicu tombol 'X' pembersih otomatis."
                />
                <SearchInput
                  label="Search Disabled"
                  placeholder="Pencarian dinonaktifkan..."
                  disabled
                />
              </div>
            </div>

            {/* 5, 6, 7. CHECKBOX, RADIO, SWITCH */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">5. Checkbox, 6. Radio & 7. Switch</h4>
                <span className="text-xs text-gray-500 font-mono">Primary 600 Interactive Color</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                {/* Checkboxes */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Checkbox (20×20px, Radius 4px)
                  </span>
                  <div className="space-y-3">
                    <Checkbox
                      checked={checkbox1}
                      onChange={(e) => setCheckbox1(e.target.checked)}
                      label="Aktifkan Notifikasi Email"
                      description="Kirim ringkasan mingguan ke email admin."
                    />
                    <Checkbox
                      checked={checkbox2}
                      onChange={(e) => setCheckbox2(e.target.checked)}
                      label="Otomatis Backup Database"
                      description="Jalankan snapshot setiap pukul 00:00."
                    />
                    <Checkbox
                      checked={true}
                      disabled
                      label="Enkripsi Token (Disabled)"
                      description="Kebijakan keamanan wajib aktif."
                    />
                  </div>
                </div>

                {/* Radio Buttons */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Radio (20×20px, Circular)
                  </span>
                  <div className="space-y-3">
                    <Radio
                      name="role-type"
                      checked={selectedRadio === 'option-1'}
                      onChange={() => setSelectedRadio('option-1')}
                      label="Akses Standar Pegawai"
                      description="Hanya melihat dan input data transaksi."
                    />
                    <Radio
                      name="role-type"
                      checked={selectedRadio === 'option-2'}
                      onChange={() => setSelectedRadio('option-2')}
                      label="Akses Administrator"
                      description="Kelola menu, role, dan akun pengguna."
                    />
                    <Radio
                      name="role-type-disabled"
                      checked={false}
                      disabled
                      label="Super Admin (Terkunci)"
                      description="Memerlukan persetujuan direksi."
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Switch (40×24px, ON = Primary 600)
                  </span>
                  <div className="space-y-4">
                    <Switch
                      checked={switch1}
                      onChange={setSwitch1}
                      label="Status Server Sinkronisasi"
                      description="Aktif (Primary 600)"
                    />
                    <Switch
                      checked={switch2}
                      onChange={setSwitch2}
                      label="Maintenance Mode"
                      description="Nonaktif (Gray 300)"
                    />
                    <Switch
                      checked={false}
                      disabled
                      onChange={() => {}}
                      label="Debug Profiler (Disabled)"
                      description="Hanya tersedia di environment dev."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 8. DATE PICKER */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">8. Date Picker</h4>
                <span className="text-xs text-gray-500 font-mono">Calendar Trigger, Radius 8px</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DatePicker
                  label="Tanggal Mulai Berlaku"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  helperText="Format YYYY-MM-DD"
                />
                <DatePicker
                  label="Tanggal Kadaluwarsa (Error)"
                  defaultValue="2020-01-01"
                  error="Masa berlaku telah terlewati."
                />
                <DatePicker
                  label="Tanggal Arsip (Disabled)"
                  defaultValue="2026-12-31"
                  disabled
                  helperText="Kunci tanggal dari seeder sistem."
                />
              </div>
            </div>

            {/* BUTTONS & BADGES COMPANION SHOWCASE */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 text-gray-900">Button & Badge Tokens</h4>
                <span className="text-xs text-gray-500 font-mono">Button 8px, Badge Full</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Primary Button (600)
                </Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="gold" leftIcon={<Sparkles size={16} />}>
                  Gold Accent Button
                </Button>
                <Button variant="primary" isLoading>
                  Loading
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Badge variant="primary" dot>
                  Primary Badge
                </Badge>
                <Badge variant="success" dot>
                  Success Active
                </Badge>
                <Badge variant="warning" dot>
                  Warning Review
                </Badge>
                <Badge variant="error" dot>
                  Error Rejected
                </Badge>
                <Badge variant="info" dot>
                  Info Notice
                </Badge>
                <Badge variant="neutral">Neutral Gray</Badge>
                <Badge variant="gold" dot>
                  Gold Signature
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default DesignSystemShowcasePage;
