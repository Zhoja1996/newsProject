import React, { useContext, useState } from "react";

interface ThemeContext {
    isDarkMode: boolean;
    toggleTheme: () => void;
} 

export const ThemeContext = React.createContext<ThemeContext | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if(!context) {
        throw new Error('context error');
    }

    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    }

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}