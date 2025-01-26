import { Switch } from "@nextui-org/react";
import { FC, useCallback, useEffect, useState } from "react";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";

interface Props {}

const DarkModeSwitch: FC<Props> = () => {
  const [darkMode, setDarkMode] = useState(false);

  const updateLocalStorage = (themeMode?: "dark") => {
    if (themeMode) {
      localStorage.setItem("theme", themeMode);
    } else {
      localStorage.removeItem("theme");
    }
  };

  const enableDarkMode = useCallback(() => {
    document.documentElement.classList.add("dark");
    updateLocalStorage("dark");
    setDarkMode(true);
  }, []);

  const disableDarkMode = useCallback(() => {
    document.documentElement.classList.remove("dark");
    updateLocalStorage();
    setDarkMode(false);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (!theme && systemPrefersDark)) enableDarkMode();
    else disableDarkMode();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) enableDarkMode();
        else disableDarkMode();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableDarkMode, disableDarkMode]);

  return (
    <Switch
      size="lg"
      isSelected={darkMode}
      onChange={(e) => {
        const { checked } = e.target;
        if (checked) enableDarkMode();
        else disableDarkMode();
      }}
      classNames={{
        wrapper: `group-data-[selected=true]:bg-gradient-to-r from-primary to-danger
          group-data-[selected=false]:bg-gradient-to-r from-warning to-danger/50
          transition-all duration-300`,
        thumb: `group-data-[selected=true]:bg-background
          group-data-[selected=false]:bg-background
          shadow-lg backdrop-blur-sm
          transition-transform duration-300
          group-hover:scale-110`,
        base: "hover:opacity-90 cursor-pointer",
      }}
      startContent={
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <HiOutlineSun
            size={20}
            className="relative text-yellow-500 transition-transform group-hover:scale-110"
          />
        </div>
      }
      endContent={
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <HiMoon
            size={18}
            className="relative text-blue-500 transition-transform group-hover:scale-110"
          />
        </div>
      }
    />
  );
};

export default DarkModeSwitch;
