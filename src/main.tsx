import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import "./styles/index.css";
import { LanguageProvider } from "./app/context/language-context.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>
);
