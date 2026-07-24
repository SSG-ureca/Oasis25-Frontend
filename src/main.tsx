import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { ToastContainer } from "./components/common/Toast";
import { applyTheme, getTheme } from "./utils/theme";

applyTheme(getTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>,
);
