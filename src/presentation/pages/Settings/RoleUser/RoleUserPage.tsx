import React, { useEffect, useState } from 'react';
import { Karyawan } from '../../../../core/domain/models/Karyawan';
import { ManagedUser, ManagedUserRole, ManagedUserWriteData } from '../../../../core/domain/models/Management';
import { useCases } from '../../../../core/di/container';
import { SYSTEM_MENU_IDS } from '../../../../core/constants/MenuConstants';
import { useToast } from '@/presentation/context/ToastContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import {
  Input,
  Select,
  DatePicker,
  Checkbox,
  SearchInput,
} from '../../../components/form';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import {
  UserPlus,
  Shield,
  Pencil,
  Trash2,
  Key,
  Users,
  RefreshCw,
  User,
} from 'lucide-react';

export const RoleUserPage: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [availableRoles, setAvailableRoles] = useState<ManagedUserRole[]>([]);
  const [availableKaryawan, setAvailableKaryawan] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { showToast } = useToast();
  const { hasPermission } = useAuth();
  const canCreateUser = hasPermission(SYSTEM_MENU_IDS.ROLE_USER, 2);
  const canUpdateUser = hasPermission(SYSTEM_MENU_IDS.ROLE_USER, 3);
  const canDeleteUser = hasPermission(SYSTEM_MENU_IDS.ROLE_USER, 4);

  // Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'rolesOnly'>('create');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formAktif, setFormAktif] = useState(1);
  const [formTgl1, setFormTgl1] = useState('');
  const [formTgl2, setFormTgl2] = useState('');
  const [formJenis, setFormJenis] = useState('pegawai');
  const [formIdRelasi, setFormIdRelasi] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users, roles, and karyawan
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersResult, rolesResult, karyawanResult] = await Promise.all([
        useCases.manageUsers.list(),
        useCases.manageRoles.list(),
        useCases.getKaryawanPage.execute({ page: 1, limit: 100 })
      ]);
      setUsers(usersResult);
      setAvailableRoles(rolesResult);
      setAvailableKaryawan(karyawanResult.data);
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Gagal memuat data pengguna dan role.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    if (!canCreateUser) {
      showToast('error', 'Anda tidak memiliki izin untuk menambah pengguna.');
      return;
    }
    setModalMode('create');
    setSelectedUser(null);
    setFormId(crypto.randomUUID());
    setFormUsername('');
    setFormPassword('');
    setFormAktif(1);
    const today = new Date().toISOString().split('T')[0];
    setFormTgl1(today);
    setFormTgl2('2035-12-31');
    setFormJenis('pegawai');
    setFormIdRelasi('');
    setSelectedRoleIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: ManagedUser) => {
    if (!canUpdateUser) {
      showToast('error', 'Anda tidak memiliki izin untuk mengubah pengguna.');
      return;
    }
    setModalMode('edit');
    setSelectedUser(user);
    setFormId(user.id);
    setFormUsername(user.username);
    setFormPassword('');
    setFormAktif(user.aktif);
    setFormTgl1(user.tgl1 ? user.tgl1.split('T')[0] : '');
    setFormTgl2(user.tgl2 ? user.tgl2.split('T')[0] : '');
    setFormJenis(user.jenis || 'pegawai');
    setFormIdRelasi(user.idRelasi || '');
    setSelectedRoleIds((user.roles || []).map((r) => r.id));
    setIsModalOpen(true);
  };

  const handleOpenRolesOnlyModal = (user: ManagedUser) => {
    if (!canCreateUser) {
      showToast('error', 'Anda tidak memiliki izin untuk mengatur role pengguna.');
      return;
    }
    setModalMode('rolesOnly');
    setSelectedUser(user);
    setSelectedRoleIds((user.roles || []).map((r) => r.id));
    setIsModalOpen(true);
  };

  const handleToggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === 'create') {
        const payload: ManagedUserWriteData = {
          id: formId,
          username: formUsername,
          password: formPassword,
          aktif: Number(formAktif),
          tgl1: formTgl1,
          tgl2: formTgl2,
          jenis: formJenis,
          idRelasi: formIdRelasi,
          roleIds: selectedRoleIds,
        };
        await useCases.manageUsers.create(payload);
        showToast('success', `Pengguna "${formUsername}" berhasil ditambahkan.`);
      } else if (modalMode === 'edit' && selectedUser) {
        const payload: ManagedUserWriteData = {
          username: formUsername,
          aktif: Number(formAktif),
          tgl1: formTgl1,
          tgl2: formTgl2,
          jenis: formJenis,
          idRelasi: formIdRelasi,
          roleIds: selectedRoleIds,
        };
        if (formPassword.trim().length > 0) {
          payload.password = formPassword;
        }
        await useCases.manageUsers.update(selectedUser.id, payload);
        showToast('success', `Data pengguna "${formUsername}" berhasil diperbarui.`);
      } else if (modalMode === 'rolesOnly' && selectedUser) {
        await useCases.manageUsers.updateRoles(selectedUser.id, selectedRoleIds);
        showToast(
          'success',
          `Role untuk pengguna "${selectedUser.username}" berhasil diperbarui.`
        );
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    if (!canDeleteUser) {
      showToast('error', 'Anda tidak memiliki izin untuk menghapus pengguna.');
      return;
    }
    if (user.username === 'admin') {
      alert('Pengguna admin utama tidak dapat dihapus.');
      return;
    }

    if (window.confirm(`Yakin ingin menghapus pengguna "${user.username}" (${user.id})?`)) {
      try {
        await useCases.manageUsers.delete(user.id);
        showToast('success', `Pengguna "${user.username}" berhasil dihapus.`);
        fetchData();
      } catch (err: unknown) {
        showToast('error', err instanceof Error ? err.message : 'Gagal menghapus pengguna.');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchKeyword.toLowerCase();
    const matchUsername = u.username.toLowerCase().includes(q);
    const matchId = u.id.toLowerCase().includes(q);
    const matchJenis = (u.jenis || '').toLowerCase().includes(q);
    const matchRole = (u.roles || []).some((r) => r.nama.toLowerCase().includes(q));
    return matchUsername || matchId || matchJenis || matchRole;
  });

  return (
    <AdminLayout>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-h3 text-gray-900">Alokasi Role Pengguna</h1>
              <p className="text-body-sm text-gray-500 mt-0.5">
                Kelola akun pengguna, masa aktif, dan penetapan hak akses grup/role otorisasi.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={fetchData}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
          >
            Segarkan
          </Button>
          {canCreateUser && (
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
              leftIcon={<UserPlus size={16} />}
            >
              Tambah Pengguna
            </Button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-96">
          <SearchInput
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onClear={() => setSearchKeyword('')}
            placeholder="Cari username, ID, jenis, atau role..."
            size="sm"
          />
        </div>
        <div className="text-caption text-gray-500 font-medium">
          Menampilkan <span className="font-bold text-gray-900">{filteredUsers.length}</span> dari{' '}
          <span className="font-bold text-gray-900">{users.length}</span> pengguna
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-caption font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 text-center w-[120px]">Aksi</th>
                <th className="px-6 py-3.5">ID & Username</th>
                <th className="px-6 py-3.5">Jenis & Relasi</th>
                <th className="px-6 py-3.5">Role / Grup Dialokasikan</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Masa Berlaku</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
                    <span className="text-caption text-gray-400 mt-2 block">Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Tidak ada data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canCreateUser && <button
                          onClick={() => handleOpenRolesOnlyModal(user)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Atur Role Pengguna"
                        >
                          <Shield size={16} />
                        </button>}
                        {canUpdateUser && <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit Data Pengguna"
                        >
                          <Pencil size={15} />
                        </button>}
                        {canDeleteUser && <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.username === 'admin'}
                          className={`p-1.5 rounded-md transition-colors ${
                            user.username === 'admin'
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-error-600 hover:bg-error-50'
                          }`}
                          title={user.username === 'admin' ? 'Admin tidak dapat dihapus' : 'Hapus Pengguna'}
                        >
                          <Trash2 size={15} />
                        </button>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-body-sm">{user.username}</div>
                      <div className="font-mono text-caption text-gray-400">{user.id}</div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="neutral" size="sm">
                        {user.jenis || 'pegawai'}
                      </Badge>
                      <div className="text-caption text-gray-500 mt-1">
                        {(() => {
                          const emp = availableKaryawan.find((k) => k.id === user.idRelasi);
                          return emp ? (
                            <span className="font-medium text-primary-700 block truncate max-w-[200px]">
                              {emp.legalName} ({emp.operationUnit?.code || 'OU'})
                            </span>
                          ) : (
                            <span className="text-gray-400 font-mono text-[11px] block">
                              {user.idRelasi ? user.idRelasi.substring(0, 8) + '...' : '-'}
                            </span>
                          );
                        })()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.roles && user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.map((r) => (
                            <Badge key={r.id} variant="primary" size="sm">
                              <Shield size={11} className="mr-1 inline" />
                              {r.nama}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-caption text-gray-400 italic">Belum memiliki role</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge variant={user.aktif === 1 ? 'success' : 'neutral'} dot>
                        {user.aktif === 1 ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-caption text-gray-500 font-mono">
                      <div>Mulai: {user.tgl1 ? user.tgl1.split('T')[0] : '-'}</div>
                      <div>Sampai: {user.tgl2 ? user.tgl2.split('T')[0] : '-'}</div>
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
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? 'Tambah Pengguna Baru'
            : modalMode === 'edit'
            ? `Edit Pengguna: ${selectedUser?.username}`
            : `Atur Hak Akses Role: ${selectedUser?.username}`
        }
        subtitle={
          modalMode === 'create'
            ? 'Lengkapi data identitas pengguna dan alokasikan grup otorisasi.'
            : modalMode === 'edit'
            ? 'Perbarui data akun, password baru, masa berlaku, atau alokasi role.'
            : 'Pilih grup otorisasi yang diberikan untuk pengguna ini.'
        }
        icon={<Shield size={20} className="text-primary-600" />}
        width="max-w-xl"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="role-user-form"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {modalMode === 'create' ? 'Tambah Pengguna' : 'Simpan Data'}
            </Button>
          </>
        }
      >
        <form id="role-user-form" onSubmit={handleSubmit} className="space-y-5">
          {modalMode !== 'rolesOnly' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ID Pengguna"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled
                  required
                  placeholder="UUID otomatis"
                />
                <Input
                  label="Username"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  disabled={isSubmitting}
                  required
                  placeholder="Contoh: jono_admin"
                  prefixIcon={<User size={16} />}
                />
              </div>

              <Input
                label={modalMode === 'edit' ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                disabled={isSubmitting}
                required={modalMode === 'create'}
                placeholder={modalMode === 'edit' ? '••••••••' : 'Masukkan password akun'}
                prefixIcon={<Key size={16} />}
                helperText={
                  modalMode === 'edit'
                    ? 'Kosongkan jika tidak ingin mengubah password yang sudah ada.'
                    : undefined
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Jenis Akun"
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value)}
                  disabled={isSubmitting}
                  options={[
                    { value: 'pegawai', label: 'Pegawai' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'SA', label: 'Super Admin (SA)' },
                  ]}
                />
                <Select
                  label="Status Akun"
                  value={formAktif}
                  onChange={(e) => setFormAktif(Number(e.target.value))}
                  disabled={isSubmitting}
                  options={[
                    { value: 1, label: 'Aktif (Bisa Login)' },
                    { value: 0, label: 'Nonaktif (Ditangguhkan)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Mulai Berlaku (Tgl 1)"
                  value={formTgl1}
                  onChange={(e) => setFormTgl1(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <DatePicker
                  label="Kadaluwarsa (Tgl 2)"
                  value={formTgl2}
                  onChange={(e) => setFormTgl2(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-1">
                  Tautkan ke Karyawan (Profil SDM)
                </label>
                <select
                  value={formIdRelasi}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setFormIdRelasi(selectedId);
                    if (modalMode === 'create' && selectedId && !formUsername) {
                      const emp = availableKaryawan.find((k) => k.id === selectedId);
                      if (emp) {
                        const suggested = emp.email
                          ? emp.email.split('@')[0]
                          : emp.legalName.toLowerCase().replace(/\s+/g, '_');
                        setFormUsername(suggested);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-800 outline-none focus:border-primary-600 transition-colors"
                >
                  <option value="">-- Tanpa Profil Karyawan (Akun Khusus/SA) --</option>
                  {availableKaryawan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.employeeNumber} - {k.legalName} ({k.operationUnit?.name || 'Unit'})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Menghubungkan akun login dengan data Karyawan untuk otomatisasi scope wilayah penempatan.
                </p>
              </div>
            </>
          )}

          {/* Roles Selection Box */}
          <div>
            <label className="block text-caption font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Pilih Role / Grup Otorisasi yang Diberikan:
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-56 overflow-y-auto space-y-2">
              {availableRoles.length === 0 ? (
                <div className="text-caption text-gray-400 italic py-2 text-center">
                  Tidak ada role terdaftar.
                </div>
              ) : (
                availableRoles.map((role) => {
                  const isChecked = selectedRoleIds.includes(role.id);
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleToggleRoleSelection(role.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-primary-50 border-primary-300 text-primary-900 shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleRoleSelection(role.id)}
                        />
                        <div>
                          <div className="text-body-sm font-semibold">{role.nama}</div>
                          <div className="text-caption text-gray-500 font-mono">Kode: {role.id}</div>
                        </div>
                      </div>
                      {isChecked && <Badge variant="primary" size="sm">Dipilih</Badge>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </form>
      </SlideOver>
    </AdminLayout>
  );
};

export default RoleUserPage;
