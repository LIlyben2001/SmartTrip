import { useLanguage } from "../i18n";

export default function NavBar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="text-xl font-semibold">SmartTrip</div>
      <nav className="flex items-center gap-6 text-gray-700">
        <a href="#features">{t("nav.features")}</a>
        <a href="#demo">{t("nav.demo")}</a>
        <a href="#get-started" className="text-orange-600 font-semibold">
          {t("nav.getStarted")}
        </a>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label={t("langLabel")}
        >
          <option value="en">English</option>
          <option value="zh-CN">中文 (Chinese)</option>
          <option value="es">Español (Spanish)</option>
          {/* Add more here if you add messages */}
        </select>
      </nav>
    </header>
  );
}
