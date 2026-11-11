export interface UserAccountData {
  id: string;
  username: string;
  jenis: string;
  aktif: number;
  tgl1: string;
  tgl2: string;
  roleName: string | null;
  roles: Array<{ id: string; nama: string; aktif: number }>;
}

export interface EmployeeData {
  id: string;
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
  bankId: string | null;
  accountName: string | null;
  accountNumber: string | null;
  status: boolean;
  operationUnit: {
    id: string;
    code: string;
    name: string;
    type: string;
    breadcrumb: string;
  } | null;
  supervisor: {
    id: string;
    employeeNumber: string;
    legalName: string;
  } | null;
}

export interface UserProfileResponse {
  user: UserAccountData;
  karyawan: EmployeeData | null;
}

export interface UpdateContactPayload {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  postalCode?: string | null;
}

export interface IProfileRepository {
  getProfile(): Promise<UserProfileResponse>;
  updateContact(payload: UpdateContactPayload): Promise<{ message: string }>;
}
