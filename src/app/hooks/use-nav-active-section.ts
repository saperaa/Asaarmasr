import { useEffect, useState } from "react";

const SECTION_ORDER = [
  "home",
  "prices",
  "currency",
  "table",
  "chart",
  "calculator",
  "learn",
  "blog",
  "faq",
  "contact",
] as const;

export type NavSectionId = (typeof SECTION_ORDER)[number];

function getActiveSection(): NavSectionId {
  if (typeof document === "undefined") return "home";
  const headerPad = 96;
  const y = window.scrollY + headerPad;
  let current: NavSectionId = "home";
  for (const id of SECTION_ORDER) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= y + 1) current = id;
  }
  return current;
}

export function useNavActiveSection(): NavSectionId {
  const [active, setActive] = useState<NavSectionId>("home");

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      setActive(getActiveSection());
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}
