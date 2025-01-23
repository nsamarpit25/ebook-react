import { useEffect, useState } from "react";

export const useAutoHide = (
  initialState: boolean = false,
  delay: number = 3000
) => {
  const [isVisible, setIsVisible] = useState(initialState);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (isVisible) {
      timeoutId = window.setTimeout(() => {
        setIsVisible(false);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isVisible, delay]);

  return {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible((prev) => !prev),
  };
};
