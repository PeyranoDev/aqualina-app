import { useEffect } from 'react';
import { router } from 'expo-router';
import { RoleGuardProps } from './types';
import { useAuth } from '../context/auth-context';

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  unauthorizedRedirect,
}) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Si está cargando o no hay usuario, no hacemos nada.
    // El layout principal se encargará de redirigir a /login si es necesario.
    if (isLoading || !user) {
      return;
    }

    // El único trabajo de este guard es verificar el ROL.
    const userRole = user.role.toUpperCase();
    if (!allowedRoles.includes(userRole)) {
      // Si el rol no es permitido, redirige a la página de no autorizado.
      router.replace(unauthorizedRedirect);
    }
  }, [user, isLoading, allowedRoles, unauthorizedRedirect]);

  // No mostramos nada mientras se verifica la autenticación y autorización.
  if (isLoading || !user || !allowedRoles.includes(user.role.toUpperCase())) {
    return null;
  }

  // Si todas las validaciones pasan, se muestra el contenido protegido.
  return <>{children}</>;
};
