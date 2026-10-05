import { useKaryawanForm } from './useKaryawanForm';
import { useKaryawanList } from './useKaryawanList';
import { useToast } from '@/presentation/context/ToastContext';

type NotificationType = 'success' | 'error';

export const useKaryawan = () => {
  const { showToast } = useToast();
  const notify = (type: NotificationType, message: string) => showToast(type, message);
  const list = useKaryawanList({ onError: (message) => notify('error', message) });
  const form = useKaryawanForm({
    availableUnitId: list.availableUnits[0]?.id,
    totalCount: list.totalCount,
    currentPage: list.page,
    onNotify: notify,
    onRefreshList: list.fetchKaryawan,
    onRefreshLookups: list.fetchLookups
  });

  return { ...list, ...form };
};