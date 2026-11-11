import { useState, useEffect, useCallback } from 'react';
import { securityRepository } from '@/core/di/container';
import { ActiveSession, ChangePasswordPayload } from '../types';
import { useToast } from '@/presentation/context/ToastContext';

export function useAccountSecurity() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState<boolean>(false);

  const { showToast } = useToast();

  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const data = await securityRepository.getActiveSessions();
      setSessions(data);
    } catch (err: any) {
      showToast('error', err.message || 'Gagal memuat sesi aktif.');
    } finally {
      setLoadingSessions(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const changePassword = async (payload: ChangePasswordPayload): Promise<boolean> => {
    setChangingPassword(true);
    try {
      const res = await securityRepository.changePassword(payload);
      showToast('success', res.message || 'Kata sandi berhasil diperbarui.');
      return true;
    } catch (err: any) {
      showToast('error', err.message || 'Gagal memperbarui kata sandi.');
      return false;
    } finally {
      setChangingPassword(false);
    }
  };

  const revokeSession = async (sessionId: string): Promise<boolean> => {
    setRevokingSessionId(sessionId);
    try {
      const res = await securityRepository.revokeSession(sessionId);
      showToast('success', res.message || 'Sesi berhasil dinonaktifkan.');
      await fetchSessions();
      return true;
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menonaktifkan sesi.');
      return false;
    } finally {
      setRevokingSessionId(null);
    }
  };

  const revokeAllSessions = async (): Promise<boolean> => {
    setRevokingAll(true);
    try {
      const res = await securityRepository.revokeAllSessions();
      showToast('success', res.message || 'Seluruh sesi perangkat lain berhasil dicabut.');
      await fetchSessions();
      return true;
    } catch (err: any) {
      showToast('error', err.message || 'Gagal mencabut seluruh sesi.');
      return false;
    } finally {
      setRevokingAll(false);
    }
  };

  return {
    sessions,
    loadingSessions,
    changingPassword,
    revokingSessionId,
    revokingAll,
    fetchSessions,
    changePassword,
    revokeSession,
    revokeAllSessions,
  };
}
