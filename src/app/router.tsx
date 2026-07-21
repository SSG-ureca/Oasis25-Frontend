import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "/retrospect", element: <Dashboard /> },
            { path: "/stats", element: <Dashboard /> },
            { path: "/mypage", element: <Dashboard /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
