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
        wrapper: `${
          darkMode
            ? "bg-gradient-to-r from-primary to-danger"
            : "bg-gradient-to-r from-warning to-danger/50"
        } group-data-[selected=true]:bg-gradient-to-r group-data-[selected=true]:from-primary group-data-[selected=true]:to-danger
          transition-all duration-300 shadow-lg`,
        thumb: `group-data-[selected=true]:bg-white
          group-data-[selected=false]:bg-white
          shadow-lg backdrop-blur-sm
          transform transition-all duration-300
          group-hover:scale-110`,
        base: "hover:opacity-90 cursor-pointer group",
      }}
      startContent={
        <div className="relative">
          <div className="absolute -inset-1 bg-yellow-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <HiOutlineSun
            size={20}
            className="relative text-yellow-500 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
          />
        </div>
      }
      endContent={
        <div className="relative">
          <div className="absolute -inset-1 bg-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <HiMoon
            size={18}
            className="relative text-blue-500 transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12"
          />
        </div>
      }
    />
  );
};

export default DarkModeSwitch;
