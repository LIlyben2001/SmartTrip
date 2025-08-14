import { useLanguage } from "./i18n";
import NavBar from "./components/NavBar";
import TripPlanner from "./components/TripPlanner";

export default function App() {
  const { t } = useLanguage();

  return (
    <>
      <NavBar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{t("hero.title")}</h1>
        <p className="text-gray-700">{t("hero.subtitle")}</p>
        <div className="mt-6">
          <a
            href="#planner"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            {t("cta.planNow")}
          </a>
        </div>
      </section>

      {/* Planner */}
      <section id="planner" className="py-6">
        <TripPlanner />
      </section>
    </>
  );
}
