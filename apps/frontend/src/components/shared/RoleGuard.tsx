import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { Role } from "@/types/common.types";

type RoleGuardProps = {
  allowedRoles: Role[];
  children?: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
