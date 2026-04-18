import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { Role } from "@/features/auth/stores/auth.store";

type RoleGuardProps = {
  allowedRoles: Role[];
};

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore();

  const hasRole = user?.roles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}