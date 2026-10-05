export interface KaryawanFormValues {
  operationUnitId: string;
  supervisorId: string;
  employeeNumber: string;
  nik: string;
  legalName: string;
  email: string;
  phone: string;
  sex: string;
  maritalStatus: string;
  religion: string;
  placeOfBirth: string;
  dateOfBirth: string;
  lastEducation: string;
  address: string;
  postalCode: string;
  originalDateOfHire: string;
  permanentDate: string;
  actualTerminationDate: string;
  accountName: string;
  accountNumber: string;
  status: boolean;
}

export interface OperationUnitOption {
  id: string;
  code: string;
  name: string;
  type: string;
}