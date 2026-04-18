import React from "react";
import { store } from "./appStore";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "@/shared/index.css";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./appRouter";
import { LanguageProvider } from "./providers/LanguageProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={appRouter} />
        </AuthProvider>
      </LanguageProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);