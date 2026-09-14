import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import home from "@/data/home.json";

export function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = useCallback(() => {
    setQuoteIndex((current) => {
      return (current + 1) % home.quotes.length;
    });
  }, []);

  /*
   * Cambia automáticamente la frase cada 20 segundos.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      nextQuote();
    }, 20000);

    return () => {
      window.clearInterval(timer);
    };
  }, [nextQuote]);

  const quote = home.quotes[quoteIndex];

  return (
    <section
      id="inicio"
      className="hero"
    >
      {/* ======================================================
          IMAGEN
          ====================================================== */}

      <div className="hero-media">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet="/images/parish/carrousel1-550.jpg"
          />

          <img
            src="/images/parish/carrousel1-800.jpg"
            alt="Nuestra Señora de los Ángeles"
            className="hero-photo"
          />
        </picture>

        {/* Capas visuales muy suaves.
            La iluminación principal pertenece a la imagen. */}
        <div className="hero-overlay" />

        <div className="hero-light" />

        <div className="hero-glow" />

        <div className="hero-shimmer" />
      </div>

      {/* ======================================================
          CONTENIDO — LADO IZQUIERDO
          ====================================================== */}

      <div className="hero-content">
        <div className="hero-copy">

          {/* Lugar */}
          <p className="hero-location">
            Mineral de la Reforma · Hidalgo · México
          </p>

          {/* Título */}
          <h1>
            {home.hero.title}
          </h1>

          {/* Texto */}
          <p className="hero-description">
            La Casa de Dios, en Mineral de la Reforma, Hidalgo, México,
          </p>

          {/* ==================================================
              FRASE
              ================================================== */}

          <button
            type="button"
            className="hero-quote"
            onClick={nextQuote}
            aria-label="Mostrar siguiente frase"
          >
            <span className="hero-quote-text">
              “{quote.text}”
            </span>

            <span className="hero-quote-reference">
              {quote.reference}
            </span>

            <span className="hero-quote-hint">
              Haz clic para leer otra frase
            </span>
          </button>

          {/* ==================================================
              ACCIONES
              ================================================== */}

          <div className="hero-actions">
            <Link
              to="/services"
              className="hero-button hero-button-primary"
            >
              Conoce nuestros servicios
            </Link>

            <Link
              to="/contact"
              className="hero-button hero-button-secondary"
            >
              Contáctanos
            </Link>
          </div>

          {/* ==================================================
              CANTO
              ================================================== */}

          {home.song.audio && (
            <div className="hero-song">
              <div className="hero-song-info">
                <span
                  className="hero-song-icon"
                  aria-hidden="true"
                >
                  ♪
                </span>

                <div>
                  <p className="hero-song-title">
                    {home.song.title}
                  </p>

                  <p className="hero-song-description">
                    {home.song.description}
                  </p>
                </div>
              </div>

              <audio
                className="hero-audio"
                controls
                loop
                preload="none"
                aria-label={home.song.title}
              >
                <source
                  src={`/images/parish/${home.song.audio}`}
                  type="audio/mpeg"
                />

                Tu navegador no soporta audio.
              </audio>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}