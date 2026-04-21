import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function ProtectedRoute() {
  const { token } = useAuthStore();

  // Se não estiver autenticado, redireciona para /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza as rotas filhas
  return <Outlet />;
}