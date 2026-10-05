import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SYSTEM_MENU_IDS } from '../core/constants/MenuConstants';
import { ComingSoonPage } from '../presentation/pages/System/ComingSoonPage';
import { ProtectedRoute } from './ProtectedRoute';
import { routePaths } from './routePaths';

const LoginPage = lazy(() => import('../presentation/pages/Login/LoginPage').then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('../presentation/pages/Dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const UnauthorizedPage = lazy(() => import('../presentation/pages/Unauthorized/UnauthorizedPage').then((module) => ({ default: module.UnauthorizedPage })));
const MenuListPage = lazy(() => import('../presentation/pages/Settings/Menu/MenuListPage').then((module) => ({ default: module.MenuListPage })));
const MenuFormPage = lazy(() => import('../presentation/pages/Settings/Menu/MenuFormPage').then((module) => ({ default: module.MenuFormPage })));
const RoleListPage = lazy(() => import('../presentation/pages/Settings/Role/RoleListPage').then((module) => ({ default: module.RoleListPage })));
const RoleFormPage = lazy(() => import('../presentation/pages/Settings/Role/RoleFormPage').then((module) => ({ default: module.RoleFormPage })));
const RoleUserPage = lazy(() => import('../presentation/pages/Settings/RoleUser/RoleUserPage').then((module) => ({ default: module.RoleUserPage })));
const OperationUnitListPage = lazy(() => import('../presentation/pages/Master/OperationUnit/OperationUnitListPage').then((module) => ({ default: module.OperationUnitListPage })));
const KaryawanListPage = lazy(() => import('../presentation/pages/Master/Karyawan/KaryawanListPage').then((module) => ({ default: module.KaryawanListPage })));
const DesignSystemShowcasePage = lazy(() => import('../presentation/pages/DesignSystem/DesignSystemShowcasePage').then((module) => ({ default: module.DesignSystemShowcasePage })));

const protectedElement = (menuId: string, minLevel: number, page: React.ReactNode) => (
  <ProtectedRoute menuId={menuId} minLevel={minLevel}>{page}</ProtectedRoute>
);

export const AppRoutes: React.FC = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-600">Memuat halaman...</div>}>
    <Routes>
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.unauthorized} element={<UnauthorizedPage />} />
      <Route path={routePaths.dashboard} element={protectedElement(SYSTEM_MENU_IDS.DASHBOARD, 1, <DashboardPage />)} />
      <Route path={routePaths.menuList} element={protectedElement(SYSTEM_MENU_IDS.SETTINGS, 1, <MenuListPage />)} />
      <Route path={routePaths.menuCreate} element={protectedElement(SYSTEM_MENU_IDS.SETTINGS, 2, <MenuFormPage />)} />
      <Route path={routePaths.menuEdit} element={protectedElement(SYSTEM_MENU_IDS.SETTINGS, 3, <MenuFormPage />)} />
      <Route path={routePaths.roleList} element={protectedElement(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 1, <RoleListPage />)} />
      <Route path={routePaths.roleCreate} element={protectedElement(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 2, <RoleFormPage />)} />
      <Route path={routePaths.roleEdit} element={protectedElement(SYSTEM_MENU_IDS.ROLE_MANAGEMENT, 3, <RoleFormPage />)} />
      <Route path={routePaths.roleUsers} element={protectedElement(SYSTEM_MENU_IDS.ROLE_USER, 1, <RoleUserPage />)} />
      <Route path={routePaths.roleUsersAlias} element={protectedElement(SYSTEM_MENU_IDS.ROLE_USER, 1, <RoleUserPage />)} />
      <Route path={routePaths.operationUnits} element={protectedElement(SYSTEM_MENU_IDS.OPERATION_UNIT, 1, <OperationUnitListPage />)} />
      <Route path={routePaths.karyawan} element={protectedElement(SYSTEM_MENU_IDS.KARYAWAN, 1, <KaryawanListPage />)} />
      {import.meta.env.DEV && <Route path={routePaths.designSystem} element={protectedElement(SYSTEM_MENU_IDS.DASHBOARD, 1, <DesignSystemShowcasePage />)} />}
      <Route path={routePaths.fallback} element={<ComingSoonPage />} />
    </Routes>
  </Suspense>
);
