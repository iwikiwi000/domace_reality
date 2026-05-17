import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { UserRole } from "../types/user-role.enum";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
};

function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { hasAnyRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!hasAnyRole(...allowedRoles)) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RoleGuard;
