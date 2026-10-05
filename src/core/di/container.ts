import { AuthenticateUser } from '../use-cases/AuthenticateUser';
import { DeleteKaryawan } from '../use-cases/karyawan/DeleteKaryawan';
import { GetKaryawanById } from '../use-cases/karyawan/GetKaryawanById';
import { GetKaryawanPage } from '../use-cases/karyawan/GetKaryawanPage';
import { SaveKaryawan } from '../use-cases/karyawan/SaveKaryawan';
import { DeleteOperationUnit } from '../use-cases/operation-unit/DeleteOperationUnit';
import { GetOperationUnitById } from '../use-cases/operation-unit/GetOperationUnitById';
import { GetOperationUnitTree } from '../use-cases/operation-unit/GetOperationUnitTree';
import { GetOperationUnits } from '../use-cases/operation-unit/GetOperationUnits';
import { SaveOperationUnit } from '../use-cases/operation-unit/SaveOperationUnit';
import { GetDashboardStatus } from '../use-cases/management/GetDashboardStatus';
import { ManageMenus } from '../use-cases/management/ManageMenus';
import { ManageRoles } from '../use-cases/management/ManageRoles';
import { ManageUsers } from '../use-cases/management/ManageUsers';
import { HttpAuthRepository } from '../infrastructure/repositories/HttpAuthRepository';
import { HttpDashboardRepository } from '../infrastructure/repositories/HttpDashboardRepository';
import { HttpKaryawanRepository } from '../infrastructure/repositories/HttpKaryawanRepository';
import { HttpManagedUserRepository } from '../infrastructure/repositories/HttpManagedUserRepository';
import { HttpMenuRepository } from '../infrastructure/repositories/HttpMenuRepository';
import { HttpOperationUnitRepository } from '../infrastructure/repositories/HttpOperationUnitRepository';
import { HttpRoleRepository } from '../infrastructure/repositories/HttpRoleRepository';

const authRepository = new HttpAuthRepository();
const karyawanRepository = new HttpKaryawanRepository();
const operationUnitRepository = new HttpOperationUnitRepository();
const menuRepository = new HttpMenuRepository();
const roleRepository = new HttpRoleRepository();
const managedUserRepository = new HttpManagedUserRepository();
const dashboardRepository = new HttpDashboardRepository();

export const useCases = {
  authenticateUser: new AuthenticateUser(authRepository),
  getKaryawanPage: new GetKaryawanPage(karyawanRepository),
  getKaryawanById: new GetKaryawanById(karyawanRepository),
  saveKaryawan: new SaveKaryawan(karyawanRepository),
  deleteKaryawan: new DeleteKaryawan(karyawanRepository),
  getOperationUnitTree: new GetOperationUnitTree(operationUnitRepository),
  getOperationUnits: new GetOperationUnits(operationUnitRepository),
  getOperationUnitById: new GetOperationUnitById(operationUnitRepository),
  saveOperationUnit: new SaveOperationUnit(operationUnitRepository),
  deleteOperationUnit: new DeleteOperationUnit(operationUnitRepository),
  manageMenus: new ManageMenus(menuRepository),
  manageRoles: new ManageRoles(roleRepository),
  manageUsers: new ManageUsers(managedUserRepository),
  getDashboardStatus: new GetDashboardStatus(dashboardRepository)
};