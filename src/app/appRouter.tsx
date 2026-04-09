import { createBrowserRouter } from "react-router-dom";
import { NewsPage } from "@/pages/news";
import BaseLayout from "./layouts/BaseLayout";
import MainPage from "@/pages/main/ui/Page";
import LoginPage from "@/pages/login/ui/Page";
import RegisterPage from "@/pages/register/ui/Page";
import ProfilePage from "@/pages/profile/ui/Page";
import FavoritesPage from "@/pages/favorites/ui/Page";
import HistoryPage from "@/pages/history/ui/Page";

export const appRouter = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <div>Error</div>,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/news/:id", element: <NewsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/favorites", element: <FavoritesPage /> },
      { path: "/history", element: <HistoryPage /> },
    ],
  },
]);