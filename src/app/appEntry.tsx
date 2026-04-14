import React from "react";
import { store } from "./appStore";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "@/shared/index.css";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./appRouter";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={appRouter} />
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);