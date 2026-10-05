export const routePaths = {
  login: '/login',
  unauthorized: '/unauthorized',
  dashboard: '/',
  menuList: '/settings/menu',
  menuCreate: '/settings/menu/new',
  menuEdit: '/settings/menu/edit/:id',
  roleList: '/settings/role',
  roleCreate: '/settings/role/new',
  roleEdit: '/settings/role/edit/:id',
  roleUsers: '/settings/roleuser',
  roleUsersAlias: '/settings/role-user',
  operationUnits: '/master/operation-unit',
  karyawan: '/master/karyawan',
  designSystem: '/design-system',
  fallback: '/*'
} as const;
