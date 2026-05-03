import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (en: string, ar: string) => string;
  isAr: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (en) => en,
  isAr: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ar" : "en"));
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const isAr = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isAr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
