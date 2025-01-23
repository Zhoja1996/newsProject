import { useTheme } from "../providers/ThemeProvider";
import { Header } from "@/widgets/header/ui";
import { Outlet } from "react-router-dom";

function BaseLayout() {
    const {isDarkMode} = useTheme();
    return (
        <div className={`app ${isDarkMode ? "dark" : "light"}`}>
            <Header />
            <div className="container">
                <Outlet/>
            </div>
        </div>
    );
}

export default BaseLayout;