import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import { RetrospectPage } from "../pages/RetrospectPage";
import { MyPage } from "../pages/MyPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "/retrospect", element: <RetrospectPage /> },
            { path: "/stats", element: <Dashboard /> },
            { path: "/mypage", element: <MyPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
