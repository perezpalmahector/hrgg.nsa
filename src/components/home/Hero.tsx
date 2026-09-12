import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import home from "@/data/home.json";

export function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);

  const quote = home.quotes[quoteIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsQuoteVisible(false);

      window.setTimeout(() => {
        setQuoteIndex((current) => (current + 1) % home.quotes.length);
        setIsQuoteVisible(true);
      }, 500);
    }, 20000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="hero relative isolate overflow-hidden text-white">
      {/* =====================================================
          IMAGE
         ===================================================== */}

      <div className="absolute inset-0">
        {/* Background image used as atmospheric fill */}
        <img
          src={home.hero.images.desktop}
          alt=""
          aria-hidden="true"
          className="hero-background absolute inset-0 h-full w-full"
        />

        <picture className="relative z-10 block h-full w-full">
          {/* Mobile image */}
          <source
            media="(max-width: 639px)"
            srcSet={home.hero.images.mobile}
          />

          {/* Desktop image */}
          <img
            src={home.hero.images.desktop}
            alt="Nuestra Señora de los Ángeles"
            className="hero-image"
          />
        </picture>

        {/* Color atmosphere */}
        <div className="hero-color absolute inset-0 z-20" />

        {/* Text readability */}
        <div className="hero-gradient absolute inset-0 z-20" />

        {/* Cinematic light */}
        <div className="cinematic-light absolute inset-y-[-20%] left-[-45%] z-30 w-[38%]" />

        {/* Warm light */}
        <div className="hero-glow absolute right-[-10%] top-[15%] z-30" />
      </div>

      {/* =====================================================
          CONTENT
         ===================================================== */}

      <div className="relative z-40 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div
            className="mb-6 h-1 w-16 rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          />

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
            Mineral de la Reforma, Hidalgo
          </p>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-2xl sm:text-5xl lg:text-6xl">
            Nuestra Señora
            <span className="block">de los Ángeles</span>
          </h1>

          <p className="mt-5 text-lg font-medium leading-relaxed text-white/95 drop-shadow-xl sm:text-xl">
            Parroquia de Nuestra Señora de los Ángeles
          </p>

          {/* =================================================
              QUOTE
             ================================================= */}

          <div
            className={`mt-8 min-h-[130px] transition-all duration-500 ${
              isQuoteVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            <div className="border-l-2 border-white/70 pl-5">
              <p className="max-w-lg text-xl font-medium leading-relaxed drop-shadow-xl sm:text-2xl">
                “{quote.text}”
              </p>

              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/80">
                {quote.reference}
              </p>
            </div>
          </div>

          {/* =================================================
              ACTIONS
             ================================================= */}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="rounded-full border border-white/80 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
            >
              Conoce nuestros servicios
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              Contáctanos
            </Link>
          </div>

          {/* =================================================
              SONG
             ================================================= */}

          {home.song.audio && (
            <div className="mt-8 flex items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {home.song.title}
                </p>

                <p className="mt-1 text-xs text-white/75">
                  {home.song.description}
                </p>
              </div>

              <audio
                controls
                preload="none"
                className="h-9 max-w-[220px]"
                aria-label={home.song.title}
              >
                <source
                  src={home.song.audio}
                  type="audio/mpeg"
                />

                Tu navegador no soporta audio.
              </audio>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 h-1"
        style={{
          backgroundColor: "rgba(255,255,255,0.75)",
        }}
      />
    </section>
  );
}
