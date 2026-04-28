import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { Role } from "@/types/common.types";

type RoleGuardProps = {
  allowedRoles: Role[];
};

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}