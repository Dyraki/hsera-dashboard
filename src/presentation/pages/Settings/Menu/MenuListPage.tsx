import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MenuRecord, MenuWriteData } from '../../../../core/domain/models/Management';
import { useCases } from '../../../../core/di/container';
import { SYSTEM_MENU_IDS } from '../../../../core/constants/MenuConstants';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { sortMenusByHierarchy } from './sortMenus';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Input, Select } from '../../../components/form';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { Plus, Pencil, Trash2, LayoutGrid, AlertCircle } from 'lucide-react';

export const MenuListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Data
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Slide-over Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formUpline, setFormUpline] = useState('0');
  const [formUrut, setFormUrut] = useState(1);
  const [formNama, setFormNama] = useState('');
  const [formTipe, setFormTipe] = useState('Menu');
  const [formLevel, setFormLevel] = useState(1);
  const [formLink, setFormLink] = useState('');
  const [formIcon, setFormIcon] = useState('glyphicon glyphicon-file');
  const [formAktif, setFormAktif] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasPermission } = useAuth();
  const canCreateMenu = hasPermission(SYSTEM_MENU_IDS.SETTINGS, 2);
  const canUpdateMenu = hasPermission(SYSTEM_MENU_IDS.SETTINGS, 3);
  const canDeleteMenu = hasPermission(SYSTEM_MENU_IDS.SETTINGS, 4);

  const fetchMenus = () => {
    setIsLoading(true);
    useCases.manageMenus.list()
      .then((result) => {
        setMenus(sortMenusByHierarchy(result));
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Gagal mengambil data menu.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Handle URL query trigger (?action=new or ?edit=:id)
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    if (!canCreateMenu) {
      showToast('error', 'Anda tidak memiliki izin untuk menambah menu.');
      return;
    }
    setDrawerMode('create');
    setEditId(null);
    setFormError(null);

    setFormId('');
    setFormUpline('');
    const rootMenus = menus.filter((menu) => !menu.upline || menu.upline === '0');
    setFormUrut(Math.max(0, ...rootMenus.map((menu) => Number(menu.urut) || 0)) + 1);
    setFormNama('');
    setFormTipe('Menu');
    setFormLevel(1);
    setFormLink('');
    setFormIcon('glyphicon glyphicon-file');
    setFormAktif(1);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (menu: MenuRecord) => {
    if (!canUpdateMenu) {
      showToast('error', 'Anda tidak memiliki izin untuk mengubah menu.');
      return;
    }
    setDrawerMode('edit');
    setEditId(menu.id);
    setFormError(null);

    setFormId(menu.id);
    setFormUpline(menu.upline || '');
    setFormUrut(menu.urut || 1);
    setFormNama(menu.nama || '');
    setFormTipe(menu.tipe || 'Menu');
    setFormLevel(menu.level || 1);
    setFormLink(menu.link || '');
    setFormIcon(menu.icon || 'glyphicon glyphicon-file');
    setFormAktif(menu.aktif);
    setIsDrawerOpen(true);
  };

  const handleUplineChange = (parentId: string) => {
    setFormUpline(parentId);
    const parent = menus.find((menu) => menu.id === parentId);
    const siblings = menus.filter((menu) => (menu.upline || '') === parentId && menu.id !== formId);
    setFormLevel(parent ? Number(parent.level) + 1 : 1);
    setFormUrut(Math.max(0, ...siblings.map((menu) => Number(menu.urut) || 0)) + 1);
  };

  const handleCloseDrawer = () => {
    if (!isSubmitting) {
      setIsDrawerOpen(false);
      setFormError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const normalizedLink = formLink ? formLink.trim().replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase() : '';
    if (normalizedLink && !/^[a-z0-9/_-]+$/.test(normalizedLink)) {
      setFormError('Format link tidak valid. Gunakan huruf, angka, slash, dash atau underscore. Contoh: settings/menu');
      setIsSubmitting(false);
      return;
    }

    const payload: MenuWriteData = {
      upline: formUpline && formUpline.trim() !== '' && formUpline !== '0' ? formUpline.trim() : null,
      urut: Number(formUrut),
      nama: formNama,
      tipe: formTipe,
      level: Number(formLevel),
      link: normalizedLink,
      icon: formIcon,
      aktif: Number(formAktif),
    };

    if (formId && formId.trim() !== '') {
      payload.id = formId.trim();
    }

    try {
      if (drawerMode === 'edit' && editId) {
        await useCases.manageMenus.update(editId, payload);
        showToast('success', `Menu "${formNama}" berhasil diperbarui.`);
      } else {
        await useCases.manageMenus.create(payload);
        showToast('success', `Menu "${formNama}" berhasil ditambahkan.`);
      }
      setIsDrawerOpen(false);
      fetchMenus();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan menu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteMenu) {
      showToast('error', 'Anda tidak memiliki izin untuk menghapus menu.');
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus menu "${id}"?`)) {
      try {
        await useCases.manageMenus.delete(id);
        showToast('success', 'Menu berhasil dihapus.');
        fetchMenus();
      } catch (err: unknown) {
        showToast('error', err instanceof Error ? err.message : 'Gagal menghapus menu.');
      }
    }
  };

  return (
    <AdminLayout>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
              <LayoutGrid size={22} />
            </div>
            <div>
              <h1 className="text-h3 text-gray-900">Setup Menu</h1>
              <p className="text-body-sm text-gray-500 mt-0.5">
                Kelola hierarki struktur tata letak menu navigasi sistem.
              </p>
            </div>
          </div>
        </div>
        {canCreateMenu && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
          >
            Tambah Menu
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-600 rounded-lg p-4 text-body-sm mb-4">
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-caption font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 text-center w-[100px]">Aksi</th>
                <th className="px-6 py-3.5">ID Menu</th>
                <th className="px-6 py-3.5 w-[80px] text-center">Upline</th>
                <th className="px-6 py-3.5 w-[80px] text-center">Urut</th>
                <th className="px-6 py-3.5">Nama Menu</th>
                <th className="px-6 py-3.5">Tipe</th>
                <th className="px-6 py-3.5 text-center">Level</th>
                <th className="px-6 py-3.5">Link</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
                    <span className="text-caption text-gray-400 mt-2 block">Memuat data menu...</span>
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-1.5">
                      {canUpdateMenu && (
                        <button
                          onClick={() => handleOpenEdit(menu)}
                          className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit Menu"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {canDeleteMenu && (
                        <button
                          onClick={() => handleDelete(menu.id)}
                          className="p-1.5 rounded-md text-error-600 hover:bg-error-50 transition-colors"
                          title="Hapus Menu"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-caption font-bold text-gray-900">{menu.id}</td>
                    <td className="px-6 py-4 text-center text-caption text-gray-600" title={menu.upline || 'Root'}>
                      {menu.upline ? menus.find((parent) => parent.id === menu.upline)?.nama || 'Induk tidak ditemukan' : 'Root'}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-caption text-gray-500">{menu.urut}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      <span style={{ paddingLeft: `${(menu.level - 1) * 12}px` }} className="inline-block">
                        {menu.level > 1 && <span className="text-gray-300 mr-1">└─</span>}
                        {menu.nama}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={menu.tipe === 'Header' ? 'gold' : 'primary'} size="sm">
                        {menu.tipe}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-caption text-gray-500">{menu.level}</td>
                    <td className="px-6 py-4 font-mono text-caption text-gray-500">{menu.link || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={menu.aktif === 1 ? 'success' : 'neutral'} dot>
                        {menu.aktif === 1 ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer Form */}
      <SlideOver
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={drawerMode === 'create' ? 'Tambah Menu Baru' : `Edit Menu: ${formNama}`}
        subtitle={
          drawerMode === 'create'
            ? 'Buat entitas navigasi baru dalam struktur pohon menu sistem.'
            : 'Perbarui konfigurasi detail menu navigasi sistem.'
        }
        icon={<LayoutGrid size={20} className="text-primary-600" />}
        width="max-w-xl"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCloseDrawer}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="menu-form"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {drawerMode === 'create' ? 'Tambah Menu' : 'Simpan Perubahan'}
            </Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={handleFormSubmit} className="space-y-5">
          {formError && (
            <div className="bg-error-50 border border-error-200 text-error-600 rounded-lg p-3 text-body-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ID Menu (UUID)"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              disabled={drawerMode === 'edit' || isSubmitting}
              placeholder={drawerMode === 'create' ? 'Auto (UUID)' : ''}
            />
            <Input
              label="Nomor Urut"
              type="number"
              value={formUrut}
              onChange={(e) => setFormUrut(Number(e.target.value))}
              disabled={isSubmitting}
              required
            />
          </div>

          <Input
            label="Nama Menu"
            value={formNama}
            onChange={(e) => setFormNama(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="Contoh: ROLE USER"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Menu Induk (Upline)"
              value={formUpline}
              onChange={(e) => handleUplineChange(e.target.value)}
              disabled={isSubmitting}
              options={[
                { value: '', label: 'Root (Tanpa Induk)' },
                ...menus
                  .filter((m) => m.id !== formId)
                  .map((m) => ({
                    value: m.id,
                    label: m.nama,
                  })),
              ]}
            />
            <Select
              label="Tipe Tampilan"
              value={formTipe}
              onChange={(e) => setFormTipe(e.target.value)}
              disabled={isSubmitting}
              options={[
                { value: 'Menu', label: 'Menu (Item navigasi)' },
                { value: 'Header', label: 'Header (Grup dropdown)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Level Kedalaman"
              type="number"
              min={1}
              max={5}
              value={formLevel}
              onChange={(e) => setFormLevel(Number(e.target.value))}
              disabled={isSubmitting}
              required
            />
            <Select
              label="Status Menu"
              value={formAktif}
              onChange={(e) => setFormAktif(Number(e.target.value))}
              disabled={isSubmitting}
              options={[
                { value: 1, label: 'Aktif (Tampil)' },
                { value: 0, label: 'Nonaktif (Sembunyi)' },
              ]}
            />
          </div>

          <Input
            label="Link URL Path"
            value={formLink}
            onChange={(e) => setFormLink(e.target.value)}
            disabled={isSubmitting}
            placeholder="Contoh: settings/roleuser"
            helperText="Kosongkan jika bertipe Header (dropdown)."
          />

          <Input
            label="CSS Class Icon"
            value={formIcon}
            onChange={(e) => setFormIcon(e.target.value)}
            disabled={isSubmitting}
            placeholder="glyphicon glyphicon-file"
          />
        </form>
      </SlideOver>
    </AdminLayout>
  );
};
export default MenuListPage;
