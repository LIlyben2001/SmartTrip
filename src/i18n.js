// src/i18n.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Add/adjust languages here */
export const DICTS = {
  en: {
    _meta: { nativeName: "English" },
    appTitle: "SmartTrip",
    heroTitle: "Personalized Travel Planner + AI Trip Builder",
    heroSubtitle:
      "Plan smarter, travel better. Create customized itineraries, get instant budgets, and explore hidden gems — for China and worldwide adventures.",
    navFeatures: "Features",
    navDemo: "Demo",
    navGetStarted: "Get Started",

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
    liveAI: "Live AI",
    mock: "Mock",

    styleFoodies: "Foodies",
    styleCulture: "Culture",
    styleNature: "Nature",
    styleLuxury: "Luxury",
    styleBudget: "Budget",
    styleFamily: "Family",
    paceRelaxed: "Relaxed",
    paceBalanced: "Balanced",
    paceFast: "Fast",
  },

  zh: {
    _meta: { nativeName: "中文" },
    appTitle: "SmartTrip",
    heroTitle: "个性化行程规划 + AI 行程助手",
    heroSubtitle:
      "更聪明地规划旅行。快速生成个性化行程、预算估算，并探索全球与中国目的地的隐藏宝藏。",
    navFeatures: "功能",
    navDemo: "演示",
    navGetStarted: "开始使用",

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
      "你的 {days} 天「{style}」之旅（城市：{city}，预算：{budget}）包含地标景点、本地美食与特色体验！",
    errorCountryCity: "请同时选择国家和城市。",
    liveAI: "实时 AI",
    mock: "模拟",

    styleFoodies: "美食",
    styleCulture: "文化",
    styleNature: "自然",
    styleLuxury: "奢华",
    styleBudget: "省钱",
    styleFamily: "亲子",
    paceRelaxed: "悠闲",
    paceBalanced: "适中",
    paceFast: "紧凑",
  },

  es: {
    _meta: { nativeName: "Español" },
    appTitle: "SmartTrip",
    heroTitle: "Planificador de viajes personalizado + Creador de itinerarios con IA",
    heroSubtitle:
      "Planifica mejor y viaja mejor. Crea itinerarios personalizados, obtén presupuestos al instante y descubre joyas ocultas en China y el mundo.",
    navFeatures: "Funciones",
    navDemo: "Demo",
    navGetStarted: "Empezar",

    planYourTrip: "Planifica tu viaje",
    selectCountry: "Selecciona un país",
    selectCountryFirst: "Primero selecciona un país",
    typeOrPickCity: "Escribe o elige una ciudad",
    startDatePH: "dd/mm/aaaa",
    daysPH: "Número de días",
    styleLabel: "Estilo de viaje",
    travelersPH: "Número de viajeros",
    budgetLabel: "Presupuesto total",
    budgetRangeNote: "{min} – {max} • Paso {step}",
    estTier: "Nivel estimado",
    paceLabel: "Ritmo del viaje",
    emailPH: "Email (opcional)",
    ctaGenerate: "Generar mi viaje",
    sampleTitle: "Vista previa del itinerario",
    sampleLine:
      "Tu aventura de {days} días de estilo {style} en {city} con presupuesto de {budget} incluye lugares icónicos, gastronomía local y experiencias únicas.",
    errorCountryCity: "Selecciona un país y una ciudad.",
    liveAI: "IA en vivo",
    mock: "Simulado",

    styleFoodies: "Gastronómico",
    styleCulture: "Cultura",
    styleNature: "Naturaleza",
    styleLuxury: "Lujo",
    styleBudget: "Económico",
    styleFamily: "Familiar",
    paceRelaxed: "Tranquilo",
    paceBalanced: "Equilibrado",
    paceFast: "Rápido",
  },

  fr: {
    _meta: { nativeName: "Français" },
    appTitle: "SmartTrip",
    heroTitle: "Planificateur de voyage personnalisé + Créateur d’itinéraires IA",
    heroSubtitle:
      "Planifiez mieux, voyagez mieux. Créez des itinéraires personnalisés, obtenez des budgets instantanés et découvrez des pépites en Chine et dans le monde.",
    navFeatures: "Fonctions",
    navDemo: "Démo",
    navGetStarted: "Commencer",

    planYourTrip: "Planifier votre voyage",
    selectCountry: "Sélectionnez un pays",
    selectCountryFirst: "Sélectionnez d’abord un pays",
    typeOrPickCity: "Saisissez ou choisissez une ville",
    startDatePH: "jj/mm/aaaa",
    daysPH: "Nombre de jours",
    styleLabel: "Style de voyage",
    travelersPH: "Nombre de voyageurs",
    budgetLabel: "Budget total",
    budgetRangeNote: "{min} – {max} • Pas {step}",
    estTier: "Niveau estimé",
    paceLabel: "Rythme du voyage",
    emailPH: "E‑mail (facultatif)",
    ctaGenerate: "Générer mon voyage",
    sampleTitle: "Aperçu de l’itinéraire",
    sampleLine:
      "Votre aventure de {days} jours (style {style}) à {city} avec un budget de {budget} inclut des sites incontournables, des repas locaux et une expérience authentique.",
    errorCountryCity: "Veuillez sélectionner un pays et une ville.",
    liveAI: "IA en direct",
    mock: "Simulation",

    styleFoodies: "Gastronomie",
    styleCulture: "Culture",
    styleNature: "Nature",
    styleLuxury: "Luxe",
    styleBudget: "Économique",
    styleFamily: "Famille",
    paceRelaxed: "Détendu",
    paceBalanced: "Équilibré",
    paceFast: "Rapide",
  },

  de: {
    _meta: { nativeName: "Deutsch" },
    appTitle: "SmartTrip",
    heroTitle: "Personalisierter Reiseplaner + KI‑Reiseplan",
    heroSubtitle:
      "Planen Sie smarter und reisen Sie besser. Erstellen Sie individuelle Routen, erhalten Sie sofortige Budgets und entdecken Sie Highlights in China und weltweit.",
    navFeatures: "Funktionen",
    navDemo: "Demo",
    navGetStarted: "Loslegen",

    planYourTrip: "Reise planen",
    selectCountry: "Land auswählen",
    selectCountryFirst: "Bitte zuerst ein Land wählen",
    typeOrPickCity: "Stadt eingeben oder wählen",
    startDatePH: "TT.MM.JJJJ",
    daysPH: "Anzahl Tage",
    styleLabel: "Reisestil",
    travelersPH: "Anzahl Reisende",
    budgetLabel: "Gesamtbudget",
    budgetRangeNote: "{min} – {max} • Schritt {step}",
    estTier: "Eingestufte Kategorie",
    paceLabel: "Reisetempo",
    emailPH: "E‑Mail (optional)",
    ctaGenerate: "Reise erstellen",
    sampleTitle: "Routen‑Vorschau",
    sampleLine:
      "Ihre {days}-tägige {style}-Reise in {city} mit einem Budget von {budget} enthält Highlights, lokale Küche und besondere Erlebnisse.",
    errorCountryCity: "Bitte Land und Stadt auswählen.",
    liveAI: "Live‑KI",
    mock: "Simuliert",

    styleFoodies: "Kulinarik",
    styleCulture: "Kultur",
    styleNature: "Natur",
    styleLuxury: "Luxus",
    styleBudget: "Budget",
    styleFamily: "Familie",
    paceRelaxed: "Locker",
    paceBalanced: "Ausgewogen",
    paceFast: "Schnell",
  },

  ja: {
    _meta: { nativeName: "日本語" },
    appTitle: "SmartTrip",
    heroTitle: "パーソナライズ旅行プランナー + AI旅程作成",
    heroSubtitle:
      "もっとスマートに、もっと良い旅を。カスタム旅程の作成、即時の予算見積もり、世界と中国の隠れスポットを発見。",
    navFeatures: "機能",
    navDemo: "デモ",
    navGetStarted: "開始",

    planYourTrip: "旅行を計画",
    selectCountry: "国を選択",
    selectCountryFirst: "まず国を選んでください",
    typeOrPickCity: "都市を入力または選択",
    startDatePH: "yyyy/mm/dd",
    daysPH: "日数",
    styleLabel: "旅行スタイル",
    travelersPH: "人数",
    budgetLabel: "総予算",
    budgetRangeNote: "{min} 〜 {max} • きざみ {step}",
    estTier: "予算カテゴリ",
    paceLabel: "旅のペース",
    emailPH: "メール（任意）",
    ctaGenerate: "旅程を作成",
    sampleTitle: "旅程プレビュー",
    sampleLine:
      "{city}での{days}日間の{style}旅（予算：{budget}）では、名所やローカルフード、体験が含まれます。",
    errorCountryCity: "国と都市を選択してください。",
    liveAI: "ライブAI",
    mock: "モック",

    styleFoodies: "グルメ",
    styleCulture: "文化",
    styleNature: "自然",
    styleLuxury: "ラグジュアリー",
    styleBudget: "節約",
    styleFamily: "ファミリー",
    paceRelaxed: "ゆったり",
    paceBalanced: "ほどよい",
    paceFast: "速い",
  },

  ko: {
    _meta: { nativeName: "한국어" },
    appTitle: "SmartTrip",
    heroTitle: "맞춤 여행 플래너 + AI 일정 빌더",
    heroSubtitle:
      "더 스마트하게 계획하고 더 즐겁게 여행하세요. 맞춤 일정, 즉시 예산 산출, 중국 및 전 세계 숨은 명소 탐색.",
    navFeatures: "기능",
    navDemo: "데모",
    navGetStarted: "시작하기",

    planYourTrip: "여행 계획하기",
    selectCountry: "국가 선택",
    selectCountryFirst: "먼저 국가를 선택하세요",
    typeOrPickCity: "도시 입력 또는 선택",
    startDatePH: "yyyy-mm-dd",
    daysPH: "여행 일수",
    styleLabel: "여행 스타일",
    travelersPH: "여행 인원",
    budgetLabel: "총 예산",
    budgetRangeNote: "{min} – {max} • 단계 {step}",
    estTier: "예상 등급",
    paceLabel: "여행 속도",
    emailPH: "이메일(선택)",
    ctaGenerate: "일정 만들기",
    sampleTitle: "일정 미리보기",
    sampleLine:
      "{city}에서 {days}일간 {style} 여행 (예산 {budget}) — 명소, 로컬 맛집, 특별한 경험 포함.",
    errorCountryCity: "국가와 도시를 선택하세요.",
    liveAI: "실시간 AI",
    mock: "모의",

    styleFoodies: "미식",
    styleCulture: "문화",
    styleNature: "자연",
    styleLuxury: "럭셔리",
    styleBudget: "가성비",
    styleFamily: "가족",
    paceRelaxed: "여유",
    paceBalanced: "보통",
    paceFast: "빠름",
  },

  pt: {
    _meta: { nativeName: "Português" },
    appTitle: "SmartTrip",
    heroTitle: "Planejador de Viagens Personalizado + Roteiros com IA",
    heroSubtitle:
      "Planeje melhor e viaje melhor. Crie roteiros personalizados, obtenha orçamentos instantâneos e descubra joias na China e no mundo.",
    navFeatures: "Recursos",
    navDemo: "Demo",
    navGetStarted: "Começar",

    planYourTrip: "Planeje sua viagem",
    selectCountry: "Selecione o país",
    selectCountryFirst: "Selecione o país primeiro",
    typeOrPickCity: "Digite ou escolha a cidade",
    startDatePH: "dd/mm/aaaa",
    daysPH: "Número de dias",
    styleLabel: "Estilo de viagem",
    travelersPH: "Número de viajantes",
    budgetLabel: "Orçamento total",
    budgetRangeNote: "{min} – {max} • Passo {step}",
    estTier: "Categoria estimada",
    paceLabel: "Ritmo da viagem",
    emailPH: "E‑mail (opcional)",
    ctaGenerate: "Gerar meu roteiro",
    sampleTitle: "Prévia do roteiro",
    sampleLine:
      "Sua viagem de {days} dias, estilo {style}, em {city}, com orçamento de {budget}, inclui pontos icônicos, culinária local e experiências únicas.",
    errorCountryCity: "Selecione um país e uma cidade.",
    liveAI: "IA ao vivo",
    mock: "Simulado",

    styleFoodies: "Gastronomia",
    styleCulture: "Cultura",
    styleNature: "Natureza",
    styleLuxury: "Luxo",
    styleBudget: "Econômico",
    styleFamily: "Família",
    paceRelaxed: "Calmo",
    paceBalanced: "Equilibrado",
    paceFast: "Rápido",
  },

  hi: {
    _meta: { nativeName: "हिन्दी" },
    appTitle: "SmartTrip",
    heroTitle: "व्यक्तिगत यात्रा प्लानर + एआई ट्रिप बिल्डर",
    heroSubtitle:
      "और समझदारी से योजना बनाएं, बेहतर यात्रा करें। कस्टम इटिनरेरी, त्वरित बजट और चीन व दुनिया के छुपे रत्नों की खोज।",
    navFeatures: "विशेषताएँ",
    navDemo: "डेमो",
    navGetStarted: "शुरू करें",

    planYourTrip: "अपनी यात्रा की योजना बनाएं",
    selectCountry: "देश चुनें",
    selectCountryFirst: "पहले देश चुनें",
    typeOrPickCity: "शहर टाइप करें या चुनें",
    startDatePH: "dd/mm/yyyy",
    daysPH: "दिनों की संख्या",
    styleLabel: "यात्रा शैली",
    travelersPH: "यात्रियों की संख्या",
    budgetLabel: "कुल बजट",
    budgetRangeNote: "{min} – {max} • चरण {step}",
    estTier: "अनुमानित श्रेणी",
    paceLabel: "यात्रा की गति",
    emailPH: "ईमेल (वैकल्पिक)",
    ctaGenerate: "मेरा ट्रिप बनाएं",
    sampleTitle: "इटिनरेरी पूर्वावलोकन",
    sampleLine:
      "{city} में {days} दिन की {style} यात्रा (बजट {budget}) — प्रमुख दर्शनीय स्थल, स्थानीय भोजन और विशेष अनुभव शामिल।",
    errorCountryCity: "कृपया देश और शहर दोनों चुनें।",
    liveAI: "लाइव एआई",
    mock: "मॉक",

    styleFoodies: "खान‑पान",
    styleCulture: "संस्कृति",
    styleNature: "प्रकृति",
    styleLuxury: "लक्ज़री",
    styleBudget: "बजट",
    styleFamily: "परिवार",
    paceRelaxed: "आरामदायक",
    paceBalanced: "संतुलित",
    paceFast: "तेज़",
  },
};

/** Order + detection map */
const SUPPORTED = Object.keys(DICTS);
function normalizeLang(input) {
  if (!input) return "en";
  const lc = input.toLowerCase();
  // exact match
  if (SUPPORTED.includes(lc)) return lc;
  // prefix match like "es-ES" -> "es"
  const base = lc.split("-")[0];
  if (SUPPORTED.includes(base)) return base;
  return "en";
}

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const initial = (() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved) return normalizeLang(saved);
    } catch {}
    return normalizeLang(navigator.language || "en");
  })();

  const [lang, setLang] = useState(initial);

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICTS[lang] || DICTS.en;
    return (key, vars = {}) => {
      const s = dict[key] ?? (DICTS.en[key] ?? key);
      return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), s);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, dict: DICTS[lang], DICTS, SUPPORTED }), [lang, t]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
