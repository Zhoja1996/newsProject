import React from "react";
import Header from "./components/Header/Header";
import Main from "./pages/Main/Main";
import { useTheme } from "./context/ThemeContext";

function App() {
    const {isDarkMode} = useTheme();
    return (
        <div className={`app ${isDarkMode ? "dark" : "light"}`}>
            <Header />
            <div className="container">
                <Main />
            </div>
        </div>
    );
}

export default App;