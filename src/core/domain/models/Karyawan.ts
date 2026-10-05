export interface KaryawanOperationUnit {
  id: string;
  code: string;
  name: string;
  type: string;
  hierarchyPath?: string;
}

export interface KaryawanSupervisor {
  id: string;
  employeeNumber: string;
  legalName: string;
}

export interface KaryawanAccount {
  id: string;
  username: string;
  aktif: number;
}

export interface Karyawan {
  id: string;
  operationUnitId: string;
  divisionId?: string | null;
  supervisorId?: string | null;
  employeeNumber: string;
  nik: string;
  legalName: string;
  email?: string | null;
  phone?: string | null;
  sex?: string | null;
  maritalStatus?: string | null;
  religion?: string | null;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  lastEducation?: string | null;
  address?: string | null;
  provinceId?: string | null;
  cityId?: string | null;
  districtId?: string | null;
  villageId?: string | null;
  postalCode?: string | null;
  originalDateOfHire?: string | null;
  permanentDate?: string | null;
  actualTerminationDate?: string | null;
  bankId?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  status: boolean;
  operationUnit?: KaryawanOperationUnit;
  supervisor?: KaryawanSupervisor | null;
  userAccount?: KaryawanAccount | null;
  lineage?: {
    breadcrumb: string;
  };
}

export interface KaryawanListQuery {
  page: number;
  limit: number;
  search?: string;
  operationUnitId?: string;
  status?: boolean;
}

export interface KaryawanPage {
  data: Karyawan[];
  page: number;
  totalPages: number;
  total: number;
}

export interface KaryawanWriteData {
  operationUnitId: string;
  supervisorId: string | null;
  employeeNumber: string;
  nik: string;
  legalName: string;
  email: string | null;
  phone: string | null;
  sex: string | null;
  maritalStatus: string | null;
  religion: string | null;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  lastEducation: string | null;
  address: string | null;
  postalCode: string | null;
  originalDateOfHire: string | null;
  permanentDate: string | null;
  actualTerminationDate: string | null;
  accountName: string | null;
  accountNumber: string | null;
  status: boolean;
}
