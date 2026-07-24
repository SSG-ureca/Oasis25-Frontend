import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import { RetrospectPage } from "../pages/RetrospectPage";
import { StatsPage } from "../pages/StatsPage";
import { MyPage } from "../pages/MyPage";
import { SplashPage } from "../pages/SplashPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/main",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "retrospect", element: <RetrospectPage /> },
          { path: "stats", element: <StatsPage /> },
          { path: "mypage", element: <MyPage /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
