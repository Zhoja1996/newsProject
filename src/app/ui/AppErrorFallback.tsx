import { Link } from "react-router-dom";
import { useLanguage } from "@/app/providers/LanguageProvider";

const AppErrorFallback = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 12 }}>{t.main.failedToLoad}</h1>
      <p style={{ marginBottom: 16 }}>{t.main.tryLater}</p>
      <Link to="/">{t.news.goHome}</Link>
    </div>
  );
};

export default AppErrorFallback;