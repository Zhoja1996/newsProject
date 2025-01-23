import { createBrowserRouter } from "react-router-dom";
import { NewsPage } from "@/pages/news";
import BaseLayout from "./layouts/BaseLayout";
import MainPage from "@/pages/main/ui/Page";

export const appRouter = createBrowserRouter([
    {
        element: <BaseLayout/>,
        errorElement: <div>Error</div>,
        children: [
            {path: "/", element: <MainPage/>},
            {path: "/news/:id", element: <NewsPage/>}
        ]
    }
]);