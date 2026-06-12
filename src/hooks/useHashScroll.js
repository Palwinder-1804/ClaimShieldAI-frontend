import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../utils/scrollToSection";

/** Scroll to hash target after route navigation (e.g. /about → /#features). */
export const useHashScroll = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const timer = setTimeout(() => scrollToSection(id), 120);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);
};
