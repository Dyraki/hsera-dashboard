export interface KaryawanDto {
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
  operationUnit?: {
    id: string;
    code: string;
    name: string;
    type: string;
    hierarchyPath?: string;
  };
  supervisor?: {
    id: string;
    employeeNumber: string;
    legalName: string;
  } | null;
  userAccount?: {
    id: string;
    username: string;
    aktif: number;
  } | null;
  lineage?: { breadcrumb: string };
}

export interface KaryawanPageDto {
  data: KaryawanDto[];
  page: number;
  totalPages: number;
  total: number;
}

export interface KaryawanWriteDto {
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
