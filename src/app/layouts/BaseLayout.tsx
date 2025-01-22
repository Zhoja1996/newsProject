import { MainPage } from "@/pages/news";
import { useTheme } from "../providers/ThemeProvider";
import { Header } from "@/widgets/header/ui";

function BaseLayout() {
    const {isDarkMode} = useTheme();
    return (
        <div className={`app ${isDarkMode ? "dark" : "light"}`}>
            <Header />
            <div className="container">
                <MainPage />
            </div>
        </div>
    );
}

export default BaseLayout;