// src/components/Hero.jsx
export default function Hero() {
  return (
    <section
      className="relative w-full"
      style={{
        backgroundImage: "url('/og-image.jpg')", // you already have this asset
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Plan Your Perfect Trip—In Minutes
        </h1>
        <p className="mt-3 md:mt-4 text-lg md:text-xl text-white/90">
          AI‑powered itineraries, tailored to your style, budget, and pace.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="#trip-form"
            className="inline-flex items-center rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 transition"
          >
            Generate My Trip
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center rounded-lg bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition"
          >
            How it works
          </a>
        </div>
      </div>

      {/* soft gradient bottom fade into page bg */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
