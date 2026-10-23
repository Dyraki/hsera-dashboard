import { District, OperationUnitOption, SalesmanOption } from '@/core/domain/models/District';
import { Channel } from '@/core/domain/models/Channel';

export interface TerritoryFormData {
  id?: string;
  ouKode: string;
  kode: string;
  karyawanId: string;
  channelIds: string[];
  status: string;
}

export type ModalMode = 'create' | 'edit';

export interface TerritoryState {
  districts: District[];
  operationUnits: OperationUnitOption[];
  salesmen: SalesmanOption[];
  channels: Channel[];
  isLoading: boolean;
  searchKeyword: string;
  filterOu: string;
  filterStatus: string;
  isModalOpen: boolean;
  modalMode: ModalMode;
  selectedDistrict: District | null;
  isDeleteModalOpen: boolean;
  districtToDelete: District | null;
  formData: TerritoryFormData;
  isSubmitting: boolean;
  isDeleting: boolean;
}
