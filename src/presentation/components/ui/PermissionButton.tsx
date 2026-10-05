import React from 'react';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { useAuth } from '@/presentation/context/AuthContext';
import { Button, ButtonProps } from './Button';

type ManagedMenuId = typeof SYSTEM_MENU_IDS[keyof typeof SYSTEM_MENU_IDS];

interface PermissionButtonProps extends ButtonProps {
  menuId: ManagedMenuId | string;
  minLevel: number;
}

/** Renders an action only when the current user has the matching ACL level. */
export const PermissionButton: React.FC<PermissionButtonProps> = ({ menuId, minLevel, ...buttonProps }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(menuId, minLevel)) return null;
  return <Button {...buttonProps} />;
};
