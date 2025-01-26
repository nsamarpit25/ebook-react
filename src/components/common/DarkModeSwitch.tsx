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
      color="warning"
      startContent={<HiOutlineSun size={20} className="text-yellow-500" />}
      endContent={<HiMoon size={18} className="text-blue-500" />}
      isSelected={darkMode}
      onChange={(e) => {
        const { checked } = e.target;
        if (checked) enableDarkMode();
        else disableDarkMode();
      }}
      classNames={{
        wrapper:
          "group-data-[selected=true]:bg-blue-500 group-data-[selected=false]:bg-yellow-500",
        thumb:
          "group-data-[selected=true]:text-blue-500 group-data-[selected=false]:text-yellow-500",
      }}
    />
  );
};

export default DarkModeSwitch;
