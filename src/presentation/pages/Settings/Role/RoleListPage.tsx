import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MenuAclRecord, RoleRecord, RoleWriteData } from '../../../../core/domain/models/Management';
import { useCases } from '../../../../core/di/container';
import { SYSTEM_MENU_IDS } from '../../../../core/constants/MenuConstants';
import { useToast } from '@/presentation/context/ToastContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { sortMenusByHierarchy } from '@/presentation/pages/Settings/Menu/sortMenus';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Input, Select, Checkbox } from '../../../components/form';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { Plus, Pencil, Trash2, Shield, AlertCircle } from 'lucide-react';

export const RoleListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Data
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { hasPermission } = useAuth();
  const canCreateRole = hasPermission(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 2);
  const canUpdateRole = hasPermission(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 3);
  const canDeleteRole = hasPermission(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 4);
  const canManageRoleAcl = hasPermission(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 2);

  // Slide-over Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);

  // Role Form Fields
  const [formId, setFormId] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formAktif, setFormAktif] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ACL Matrix state inside drawer
  const [menusAcl, setMenusAcl] = useState<MenuAclRecord[]>([]);
  const [loadingAcl, setLoadingAcl] = useState(false);

  const fetchRoles = () => {
    setIsLoading(true);
    useCases.manageRoles.list()
      .then((result) => {
        setRoles(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Gagal mengambil data role.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle URL query parameter trigger
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const fetchAclsForRole = async (roleId?: string) => {
    setLoadingAcl(true);
    try {
      const result = await useCases.manageRoles.getAcls(roleId);
      setMenusAcl(sortMenusByHierarchy(result));
    } catch (e) {
      console.error('Gagal mengambil ACL menus', e);
    } finally {
      setLoadingAcl(false);
    }
  };

  const handleOpenCreate = () => {
    if (!canCreateRole) {
      showToast('error', 'Anda tidak memiliki izin untuk menambah role.');
      return;
    }
    setDrawerMode('create');
    setEditId(null);
    setFormError(null);
    setFormId(crypto.randomUUID());
    setFormNama('');
    setFormAktif(1);
    setIsDrawerOpen(true);
    fetchAclsForRole();
  };

  const handleOpenEdit = async (role: RoleRecord) => {
    if (!canUpdateRole) {
      showToast('error', 'Anda tidak memiliki izin untuk mengubah role.');
      return;
    }
    setDrawerMode('edit');
    setEditId(role.id);
    setFormError(null);
    setFormId(role.id);
    setFormNama(role.nama);
    setFormAktif(role.aktif);
    setIsDrawerOpen(true);
    fetchAclsForRole(role.id);
  };

  const handleCloseDrawer = () => {
    if (!isSubmitting) {
      setIsDrawerOpen(false);
      setFormError(null);
    }
  };

  const toggleEnable = (menuId: string) => {
    if (!canManageRoleAcl) return;
    setMenusAcl((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, acl: { ...m.acl, enable: m.acl.enable ? 0 : 1 } } : m))
    );
  };

  const toggleLevelBit = (menuId: string, bit: 'c' | 'r' | 'u' | 'd') => {
    if (!canManageRoleAcl) return;
    setMenusAcl((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m;
        const newBits = { c: m.acl.c, r: m.acl.r, u: m.acl.u, d: m.acl.d };
        newBits[bit] = newBits[bit] ? 0 : 1;
        const levelStr = `${newBits.c}${newBits.r}${newBits.u}${newBits.d}`;
        return {
          ...m,
          acl: { ...m.acl, c: newBits.c, r: newBits.r, u: newBits.u, d: newBits.d, level: Number(levelStr) },
        };
      })
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const payload: RoleWriteData = {
      id: formId,
      nama: formNama,
      aktif: Number(formAktif),
    };

    try {
      if (drawerMode === 'edit' && editId) {
        await useCases.manageRoles.update(editId, payload);
        const aclPayload = menusAcl.map((m) => ({ menuId: m.id, enable: m.acl.enable, level: m.acl.level }));
        await useCases.manageRoles.saveAcls(editId, aclPayload);
        showToast('success', `Role "${formNama}" dan hak akses berhasil diperbarui.`);
      } else {
        await useCases.manageRoles.create(payload);
        const aclPayload = menusAcl.map((m) => ({ menuId: m.id, enable: m.acl.enable, level: m.acl.level }));
        await useCases.manageRoles.saveAcls(formId, aclPayload);
        showToast('success', `Role "${formNama}" berhasil ditambahkan.`);
      }
      setIsDrawerOpen(false);
      fetchRoles();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteRole) {
      showToast('error', 'Anda tidak memiliki izin untuk menghapus role.');
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus role "${id}"?`)) {
      try {
        await useCases.manageRoles.delete(id);
        showToast('success', 'Role berhasil dihapus.');
        fetchRoles();
      } catch (err: unknown) {
        showToast('error', err instanceof Error ? err.message : 'Gagal menghapus role.');
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
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-h3 text-gray-900">Manajemen Role</h1>
              <p className="text-body-sm text-gray-500 mt-0.5">
                Kelola grup otorisasi dan matriks hak akses menu (ACL) pengguna.
              </p>
            </div>
          </div>
        </div>
        {canCreateRole && <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus size={16} />}
        >
          Tambah Role
        </Button>}
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
                <th className="px-6 py-3.5">ID Role</th>
                <th className="px-6 py-3.5">Nama Role</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
                    <span className="text-caption text-gray-400 mt-2 block">Memuat data role...</span>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canUpdateRole && <button
                          onClick={() => handleOpenEdit(role)}
                          className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit Role & ACL"
                        >
                          <Pencil size={15} />
                        </button>}
                        {canDeleteRole && <button
                          onClick={() => handleDelete(role.id)}
                          className="p-1.5 rounded-md text-error-600 hover:bg-error-50 transition-colors"
                          title="Hapus Role"
                        >
                          <Trash2 size={15} />
                        </button>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-caption font-bold text-gray-900">{role.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{role.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={role.aktif === 1 ? 'success' : 'neutral'} dot>
                        {role.aktif === 1 ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    Tidak ada data role terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer Form */}
      <SlideOver
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={drawerMode === 'create' ? 'Tambah Role Baru' : `Edit Role: ${formNama}`}
        subtitle={
          drawerMode === 'create'
            ? 'Buat grup otorisasi baru dan atur matriks hak akses menu (ACL).'
            : 'Perbarui informasi nama role, status, serta izin CRUD setiap menu.'
        }
        icon={<Shield size={20} className="text-primary-600" />}
        width="max-w-2xl"
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
              form="role-form"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {drawerMode === 'create' ? 'Tambah Role' : 'Simpan Perubahan'}
            </Button>
          </>
        }
      >
        <form id="role-form" onSubmit={handleFormSubmit} className="space-y-6">
          {formError && (
            <div className="bg-error-50 border border-error-200 text-error-600 rounded-lg p-3 text-body-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ID Role"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              disabled
              required
              helperText="ID dibuat otomatis dalam format UUID database."
              placeholder="UUID otomatis"
            />
            <Select
              label="Status Role"
              value={formAktif}
              onChange={(e) => setFormAktif(Number(e.target.value))}
              disabled={isSubmitting}
              options={[
                { value: 1, label: 'Aktif (Bisa Digunakan)' },
                { value: 0, label: 'Nonaktif (Ditangguhkan)' },
              ]}
            />
          </div>

          <Input
            label="Nama Role"
            value={formNama}
            onChange={(e) => setFormNama(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="Contoh: OPERATOR CABANG"
          />

          {/* ACL Permission Matrix Section */}
          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-body-sm font-bold text-gray-900">Matriks Hak Akses Menu (ACL)</h4>
                <p className="text-caption text-gray-500">Tentukan izin navigasi serta aksi Create, Read, Update, Delete.</p>
              </div>
            </div>

            {loadingAcl ? (
              <div className="py-8 text-center text-caption text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent mx-auto mb-2"></div>
                Memuat matriks menu...
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-caption text-left">
                  <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Menu</th>
                      <th className="px-3 py-3 text-center">Enable</th>
                      <th className="px-3 py-3 text-center">Tambah (C)</th>
                      <th className="px-3 py-3 text-center">Lihat (R)</th>
                      <th className="px-3 py-3 text-center">Edit (U)</th>
                      <th className="px-3 py-3 text-center">Hapus (D)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white font-medium">
                    {menusAcl.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-2.5 text-gray-900">
                          <span style={{ paddingLeft: `${(m.level - 1) * 14}px` }} className="inline-block">
                            {m.level > 1 && <span className="text-gray-300 mr-1.5">└─</span>}
                            {m.nama}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex justify-center">
                            <Checkbox
                              checked={m.acl.enable === 1}
                              disabled={!canManageRoleAcl}
                              onChange={() => toggleEnable(m.id)}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex justify-center">
                            <Checkbox
                              checked={m.acl.c === 1}
                              disabled={!canManageRoleAcl}
                              onChange={() => toggleLevelBit(m.id, 'c')}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex justify-center">
                            <Checkbox
                              checked={m.acl.r === 1}
                              disabled={!canManageRoleAcl}
                              onChange={() => toggleLevelBit(m.id, 'r')}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex justify-center">
                            <Checkbox
                              checked={m.acl.u === 1}
                              disabled={!canManageRoleAcl}
                              onChange={() => toggleLevelBit(m.id, 'u')}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex justify-center">
                            <Checkbox
                              checked={m.acl.d === 1}
                              disabled={!canManageRoleAcl}
                              onChange={() => toggleLevelBit(m.id, 'd')}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </form>
      </SlideOver>
    </AdminLayout>
  );
};
export default RoleListPage;
