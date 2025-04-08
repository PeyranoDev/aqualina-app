import { RoleGuard } from './RoleGuard';
import type { RoleGuardProps } from './types';

export const SecurityGuard = ({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) => (
  <RoleGuard {...props} allowedRoles={['security']}>
    {children}
  </RoleGuard>
);