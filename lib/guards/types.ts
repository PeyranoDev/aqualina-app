import { ReactNode } from 'react';

export type RoleGuardProps = {
  allowedRoles: ('user' | 'security' | 'admin')[];
  children: ReactNode;
  fallbackRoute?: string;
  loadingComponent?: ReactNode;
};