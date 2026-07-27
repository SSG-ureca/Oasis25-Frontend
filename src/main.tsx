import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./app/router.tsx";
import { ToastContainer } from "./components/common/Toast";
import { applyTheme, getTheme } from "./utils/theme";

applyTheme(getTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
