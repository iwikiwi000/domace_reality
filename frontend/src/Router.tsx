import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Reality from "./pages/reality/Reality";
import RealityDetail from "./pages/reality/RealityDetail";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ErrorPage from "./pages/errors/ErrorPage";
import Layout from "./components/Layout";
import MinimalLayout from "./components/MinimalLyout";
import AdminPage from "./pages/admin/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/admin/LoginPage";
import SignupPage from "./pages/admin/SignupPage";
import RealityFormPage from "./pages/reality/RealityFormPage";
import { UserRole } from "./types/user-role.enum";
import RoleGuard from "./components/RoleGuard";
import AboutPage from "./pages/About";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "reality",
        children: [
          { index: true, element: <Reality /> },
          { path: ":id", element: <RealityDetail /> },
        ],
      },
      { path: "about", element: <AboutPage /> },
    ],
  },
  {
    element: <MinimalLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "auth",
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignupPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "reality",
            children: [
              {
                path: "add",
                element: (
                  <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.USER]}>
                    <RealityFormPage />
                  </RoleGuard>
                ),
              },
              {
                path: ":id/edit",
                element: <RealityFormPage />,
              },
            ],
          },
          {
            path: "admin",
            element: (
              <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <AdminPage />
              </RoleGuard>
            ),
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
