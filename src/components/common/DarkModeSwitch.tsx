import { Switch } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";
import { set } from "zod";

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

  const enableDarkMode = () => {
    document.documentElement.classList.add("dark");
    updateLocalStorage("dark");
    setDarkMode(true);
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove("dark");
    updateLocalStorage();
    setDarkMode(false);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") enableDarkMode();
    else disableDarkMode();
  }, [])

  return (
    <Switch
      size="sm"
      color="success"
      startContent={<IoSunnyOutline />}
      endContent={<IoMoon />}
      isSelected={darkMode}
      onChange={(e) => {
        const { checked } = e.target;
        if (checked) enableDarkMode();
        else disableDarkMode();
      }}
    />
  );
};

export default DarkModeSwitch;
