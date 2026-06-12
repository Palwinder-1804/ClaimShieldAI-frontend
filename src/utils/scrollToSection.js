const NAVBAR_OFFSET = 88;

export const scrollToSection = (sectionId, offset = NAVBAR_OFFSET) => {
  const id = sectionId?.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  return true;
};

export const parseNavTarget = (to) => {
  const hashIndex = to.indexOf("#");
  if (hashIndex === -1) {
    return { path: to || "/", hash: null };
  }
  const path = to.slice(0, hashIndex) || "/";
  const hash = to.slice(hashIndex + 1);
  return { path, hash };
};
