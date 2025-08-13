import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const DICTS = {
  en: {
    appTitle: "SmartTrip",
    heroTitle: "Personalized Travel Planner + AI Trip Builder",
    heroSubtitle:
      "Plan smarter, travel better. Create customized itineraries, get instant budgets, and explore hidden gems — for China and worldwide adventures.",
    navFeatures: "Features",
    navDemo: "Demo",
    navGetStarted: "Get Started",

    // TripPlanner
    planYourTrip: "Plan Your Trip",
    selectCountry: "Select Country",
    selectCountryFirst: "Select Country First",
    typeOrPickCity: "Type or pick a city",
    startDatePH: "mm/dd/yyyy",
    daysPH: "Number of Days",
    styleLabel: "Travel Style",
    travelersPH: "Number of Travelers",
    budgetLabel: "Total Budget",
    budgetRangeNote: "{min} – {max} • Step {step}",
    estTier: "Estimated tier",
    paceLabel: "Trip Pace",
    emailPH: "Email (optional)",
    ctaGenerate: "Generate My Trip",
    sampleTitle: "Sample Itinerary Preview",
    sampleLine:
      "Your {days}-day {style} Adventure in {city} with a budget of {budget} includes iconic sites, neighborhood dining, and a local experience!",
    errorCountryCity: "Please select both a country and a city.",

    // styles / paces
    styleFoodies: "Foodies",
    styleCulture: "Culture",
    styleNature: "Nature",
    styleLuxury: "Luxury",
    styleBudget: "Budget",
    styleFamily: "Family",
    paceRelaxed: "Relaxed",
    paceBalanced: "Balanced",
    paceFast: "Fast",

    // mode badge
    liveAI: "Live AI",
    mock: "Mock",
  },
  zh: {
    appTitle: "SmartTrip",
    heroTitle: "个性化行程规划 + AI 行程助手",
    heroSubtitle:
      "更聪明地规划旅行。快速生成个性化行程、预算估算，并探索全球与中国目的地的隐藏宝藏。",
    navFeatures: "功能",
    navDemo: "演示",
    navGetStarted: "开始使用",

    // TripPlanner
    planYourTrip: "规划你的旅程",
    selectCountry: "选择国家",
    selectCountryFirst: "请先选择国家",
    typeOrPickCity: "输入或选择城市",
    startDatePH: "年/月/日",
    daysPH: "旅行天数",
    styleLabel: "旅行风格",
    travelersPH: "出行人数",
    budgetLabel: "总预算",
    budgetRangeNote: "{min} – {max} • 步长 {step}",
    estTier: "预算档次",
    paceLabel: "行程节奏",
    emailPH: "邮箱（可选）",
    ctaGenerate: "生成行程",
    sampleTitle: "示例行程预览",
    sampleLine:
      "你的 {days} 天 {style} 之旅（城市：{city}，预算：{budget}）包含地标景点、本地美食与特色体验！",
    errorCountryCity: "请同时选择国家和城市。",

    // styles / paces
    styleFoodies: "美食",
    styleCulture: "文化",
    styleNature: "自然",
    styleLuxury: "奢华",
    styleBudget: "省钱",
    styleFamily: "亲子",
    paceRelaxed: "悠闲",
    paceBalanced: "适中",
    paceFast: "紧凑",

    liveAI: "实时 AI",
    mock: "模拟",
  },
};

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const initial = (() => {
    const saved = localStorage.getItem("lang");
    if (saved && DICTS[saved]) return saved;
    return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  })();

  const [lang, setLang] = useState(initial);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICTS[lang] || DICTS.en;
    return (key, vars = {}) => {
      const s = dict[key] ?? key;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
        s
      );
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, dict: DICTS[lang] }), [lang, t]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
