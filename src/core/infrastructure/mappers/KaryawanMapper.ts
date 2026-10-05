import { Karyawan, KaryawanPage, KaryawanWriteData } from '../../domain/models/Karyawan';
import { KaryawanDto, KaryawanPageDto, KaryawanWriteDto } from '../dto/KaryawanDto';

export const toKaryawan = (dto: KaryawanDto): Karyawan => ({
  ...dto,
  operationUnit: dto.operationUnit ? { ...dto.operationUnit } : undefined,
  supervisor: dto.supervisor ? { ...dto.supervisor } : dto.supervisor,
  userAccount: dto.userAccount ? { ...dto.userAccount } : dto.userAccount,
  lineage: dto.lineage ? { ...dto.lineage } : undefined
});

export const toKaryawanPage = (dto: KaryawanPageDto): KaryawanPage => ({
  data: dto.data.map(toKaryawan),
  page: dto.page,
  totalPages: dto.totalPages,
  total: dto.total
});

export const toKaryawanWriteDto = (data: KaryawanWriteData): KaryawanWriteDto => ({
  operationUnitId: data.operationUnitId,
  supervisorId: data.supervisorId,
  employeeNumber: data.employeeNumber,
  nik: data.nik,
  legalName: data.legalName,
  email: data.email,
  phone: data.phone,
  sex: data.sex,
  maritalStatus: data.maritalStatus,
  religion: data.religion,
  placeOfBirth: data.placeOfBirth,
  dateOfBirth: data.dateOfBirth,
  lastEducation: data.lastEducation,
  address: data.address,
  postalCode: data.postalCode,
  originalDateOfHire: data.originalDateOfHire,
  permanentDate: data.permanentDate,
  actualTerminationDate: data.actualTerminationDate,
  accountName: data.accountName,
  accountNumber: data.accountNumber,
  status: data.status
});
