export interface User {
  id: string;
  username: string;
  jenis: string;
  idRelasi?: string | null;
  karyawan?: {
    id: string;
    employeeNumber: string;
    nik: string;
    legalName: string;
    operationUnitId: string;
    unitName?: string;
    unitType?: string;
    breadcrumb?: string;
  } | null;
  scope?: {
    isSuperAdmin: boolean;
    unitId?: string | null;
    unitCode?: string | null;
    unitName?: string | null;
    unitType?: string | null;
    allowedUnitIds: string[];
  } | null;
}

export interface Permission {
  menuId: string;
  enable: boolean;
  level: number;
}
