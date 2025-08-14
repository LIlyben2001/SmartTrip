import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Extend languages here */
const MESSAGES = {
  en: {
    nav: { features: "Features", demo: "Demo", getStarted: "Get Started" },
    hero: {
      title: "Personalized Travel Planner + AI Trip Builder",
      subtitle:
        "Plan smarter, travel better. Create customized itineraries, get instant budgets, and explore hidden gems — for China and worldwide adventures.",
    },
    cta: { planNow: "Plan My Trip Now" },
    planner: { title: "Plan Your Trip", live: "Live AI" },
    form: {
      country: "Select Country",
      cityPickFirst: "Select Country First",
      cityTypeOrPick: "Type or pick a city",
      startDate: "mm/dd/yyyy",
      days: "Number of Days",
      style: "Travel Style",
      travelers: "Number of Travelers",
      budgetLabel: "Total Budget",
      budgetRange: "Step",
      tier: "Estimated tier",
      pace: "Trip Pace",
      email: "Email (optional)",
      generate: "Generate My Trip",
      sampleTitle: "Sample Itinerary Preview",
      sampleLine:
        "Your {days}-day {style} Adventure in {city} with a budget of {budget} includes iconic sites, neighborhood dining, and a local experience!",
      needCountryCity: "Please select both a country and a city.",
    },
    style: {
      Foodies: "Foodies",
      Culture: "Culture",
      Nature: "Nature",
      Luxury: "Luxury",
      Budget: "Budget",
      Family: "Family",
    },
    pace: { Relaxed: "Relaxed", Balanced: "Balanced", Fast: "Fast" },
    langLabel: "Language",
  },

  "zh-CN": {
    nav: { features: "功能", demo: "演示", getStarted: "开始使用" },
    hero: {
      title: "个性化旅行规划 + AI 行程生成器",
      subtitle:
        "更聪明地规划，更轻松地出行。自定义行程、即时预算、探索隐藏的宝藏——适用于中国及全球旅行。",
    },
    cta: { planNow: "立即规划行程" },
    planner: { title: "规划你的行程", live: "实时 AI" },
    form: {
      country: "选择国家",
      cityPickFirst: "请先选择国家",
      cityTypeOrPick: "输入或选择城市",
      startDate: "yyyy/mm/dd",
      days: "天数",
      style: "旅行风格",
      travelers: "出行人数",
      budgetLabel: "总预算",
      budgetRange: "步进",
      tier: "预估档位",
      pace: "行程节奏",
      email: "邮箱（可选）",
      generate: "生成行程",
      sampleTitle: "行程示例预览",
      sampleLine:
        "你的 {days} 天{style}之旅（目的地 {city}，预算 {budget}）将包含地标景点、街巷美食与本地体验！",
      needCountryCity: "请同时选择国家和城市。",
    },
    style: {
      Foodies: "美食",
      Culture: "文化",
      Nature: "自然",
      Luxury: "高端",
      Budget: "经济",
      Family: "亲子",
    },
    pace: { Relaxed: "悠闲", Balanced: "均衡", Fast: "紧凑" },
    langLabel: "语言",
  },

  es: {
    nav: { features: "Funciones", demo: "Demo", getStarted: "Comenzar" },
    hero: {
      title: "Planificador de Viajes Personalizado + Generador de Itinerarios con IA",
      subtitle:
        "Planifica mejor y viaja mejor. Crea itinerarios a medida, obtén presupuestos al instante y descubre joyas ocultas — para China y destinos en todo el mundo.",
    },
    cta: { planNow: "Planear mi viaje ahora" },
    planner: { title: "Planifica tu viaje", live: "IA en vivo" },
    form: {
      country: "Seleccionar país",
      cityPickFirst: "Primero selecciona un país",
      cityTypeOrPick: "Escribe o elige una ciudad",
      startDate: "dd/mm/aaaa",
      days: "Número de días",
      style: "Estilo de viaje",
      travelers: "Número de viajeros",
      budgetLabel: "Presupuesto total",
      budgetRange: "Paso",
      tier: "Nivel estimado",
      pace: "Ritmo del viaje",
      email: "Correo (opcional)",
      generate: "Generar mi itinerario",
      sampleTitle: "Vista previa del itinerario",
      sampleLine:
        "Tu aventura de {days} días de {style} en {city} con un presupuesto de {budget} incluye sitios icónicos, comida local y experiencias auténticas.",
      needCountryCity: "Selecciona país y ciudad.",
    },
    style: {
      Foodies: "Gastronomía",
      Culture: "Cultura",
      Nature: "Naturaleza",
      Luxury: "Lujo",
      Budget: "Económico",
      Family: "Familiar",
    },
    pace: { Relaxed: "Tranquilo", Balanced: "Equilibrado", Fast: "Rápido" },
    langLabel: "Idioma",
  },
};

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = MESSAGES[lang] || MESSAGES.en;
    return (k, vars) => {
      const val = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), dict);
      if (!val) return k;
      if (!vars) return val;
      return String(val).replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
