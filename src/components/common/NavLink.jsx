import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { parseNavTarget, scrollToSection } from "../../utils/scrollToSection";

/**
 * Handles route links and same-page / cross-page hash anchors (e.g. /#features).
 */
const NavLink = ({ to, children, className, onNavigate, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { path, hash } = parseNavTarget(to);

  const handleHashNav = () => {
    if (hash) {
      const scrolled = scrollToSection(hash);
      if (scrolled) {
        window.history.replaceState(null, "", `${path}#${hash}`);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", path);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    onNavigate?.();

    if (hash) {
      if (location.pathname === path) {
        handleHashNav();
      } else {
        navigate({ pathname: path, hash });
      }
      return;
    }

    if (path === "/" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
  };

  if (!hash && path !== "/") {
    return (
      <Link to={path} className={className} onClick={onNavigate} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default NavLink;
