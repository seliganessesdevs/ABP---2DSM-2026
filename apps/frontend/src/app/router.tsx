import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes";
import LoginPage from "./routes/login";
import AdminPage from "./routes/admin";
import SecretaryPage from "./routes/secretary";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { RoleGuard } from "@/components/shared/RoleGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />, // Protege todas as rotas filhas
    children: [
      {
        path: "/admin",
        element: (
          <RoleGuard allowedRoles={["ADMIN"]}>
            <AdminPage />
          </RoleGuard>
        ),
      },
      {
        path: "/secretary",
        element: (
          <RoleGuard allowedRoles={["SECRETARIA"]}>
            <SecretaryPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}