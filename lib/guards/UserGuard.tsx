
import React from 'react';
import type { RoleGuardProps } from './types';
import { RoleGuard } from './RoleGuard';

export const UserGuard = ({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) => (
  <RoleGuard {...props} allowedRoles={['user']}>
    {children}
  </RoleGuard>
);