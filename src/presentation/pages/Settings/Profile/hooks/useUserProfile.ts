import { useState, useEffect, useCallback } from 'react';
import { profileRepository } from '@/core/di/container';
import { UserProfileResponse, UpdateContactPayload } from '../types';
import { useToast } from '@/presentation/context/ToastContext';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileRepository.getProfile();
      setProfile(data);
    } catch (err: any) {
      const msg = err.message || 'Gagal memuat profil pengguna.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateContact = async (payload: UpdateContactPayload): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await profileRepository.updateContact(payload);
      showToast('success', res.message || 'Data kontak berhasil diperbarui.');
      // Refresh profile data
      await fetchProfile();
      return true;
    } catch (err: any) {
      showToast('error', err.message || 'Gagal memperbarui data kontak.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    refreshProfile: fetchProfile,
    updateContact,
  };
}
