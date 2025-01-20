import { useTheme } from "@/app/providers/ThemeProvider";
import { themeIcons } from "@/shared/assets";

const ThemeButton = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <img 
            src={isDarkMode ? themeIcons.light : themeIcons.dark} 
            width={30} 
            alt='theme' 
            onClick={toggleTheme}
        />
    )
}

export default ThemeButton;