import "./Hero.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import home from "@/data/home.json";

export function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Video
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Audio
  const [audioPlaying, setAudioPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* =========================================================
     FRASES
     ========================================================= */

  const nextQuote = useCallback(() => {
    setQuoteIndex((current) => {
      if (!home.quotes || home.quotes.length === 0) {
        return 0;
      }

      return (current + 1) % home.quotes.length;
    });
  }, []);

  useEffect(() => {
    if (!home.quotes || home.quotes.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      nextQuote();
    }, 20000);

    return () => {
      window.clearInterval(timer);
    };
  }, [nextQuote]);

  /* =========================================================
     VIDEO
     ========================================================= */

  const handleVideoLoadStart = () => {
    setVideoLoading(true);
    setVideoReady(false);
    setVideoError(false);
  };

  /*
   * IMPORTANTE:
   * No ocultamos "Cargando video..." aquí.
   * Esperamos a onCanPlay.
   */
  const handleVideoLoadedData = () => {
    // El video ya tiene datos, pero esperamos a que pueda reproducirse.
  };

  const handleVideoCanPlay = () => {
    setVideoLoading(false);
    setVideoReady(true);
    setVideoError(false);

    const video = videoRef.current;

    if (video) {
      video.play().catch(() => {
        // Algunos navegadores pueden retrasar la reproducción.
      });
    }
  };

  const handleVideoError = () => {
    setVideoLoading(false);
    setVideoReady(false);
    setVideoError(true);
  };

  /* =========================================================
     AUDIO
     ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.35;

    let started = false;

    const startAudio = () => {
      if (started) {
        return;
      }

      audio
        .play()
        .then(() => {
          started = true;
          setAudioPlaying(true);

          window.removeEventListener("click", startAudio);
          window.removeEventListener("touchstart", startAudio);
          window.removeEventListener("keydown", startAudio);
        })
        .catch(() => {
          /*
           * El navegador puede bloquear autoplay con sonido.
           * Esperamos al primer click/toque/tecla.
           */
        });
    };

    // Primer intento automático
    startAudio();

    // Fallback para navegadores que bloquean autoplay
    window.addEventListener("click", startAudio);
    window.addEventListener("touchstart", startAudio);
    window.addEventListener("keydown", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("keydown", startAudio);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(() => {
          setAudioPlaying(false);
        });
    } else {
      audio.pause();
      setAudioPlaying(false);
    }
  };

  const handleAudioPlay = () => {
    setAudioPlaying(true);
  };

  const handleAudioPause = () => {
    setAudioPlaying(false);
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  /* =========================================================
     FRASE ACTUAL
     ========================================================= */

  const quote =
    home.quotes && home.quotes.length > 0
      ? home.quotes[quoteIndex]
      : null;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section id="inicio" className="hero">

      {/* =====================================================
          FONDO
          ===================================================== */}

      <div className="hero-media">

        {/* IMAGEN: aparece primero */}
        <picture
          className={`hero-fallback-image ${videoReady ? "hero-fallback-hidden" : ""
            }`}
        >
          <source
            media="(max-width: 639px)"
            srcSet="/images/parish/carrousel1-550.jpg"
          />

          <img
            src="/images/parish/carrousel1-800.jpg"
            alt=""
            className="hero-photo"
          />
        </picture>

        {/* VIDEO: aparece encima de la imagen cuando está listo */}
        <video
          ref={videoRef}
          className={`hero-video ${videoReady ? "hero-video-ready" : ""
            }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/parish/carrousel1-800.jpg"
          onLoadStart={handleVideoLoadStart}
          onLoadedData={handleVideoLoadedData}
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
          aria-hidden="true"
        >
          <source
            src="/images/parish/nsa.mp4"
            type="video/mp4"
          />

          Tu navegador no soporta video.
        </video>

        {/* =================================================
            INDICADOR DE CARGA
            ================================================= */}

        {videoLoading && !videoError && !videoReady && (
          <div className="hero-video-loading">
            <span className="hero-video-spinner" />

            <span>Cargando video…</span>
          </div>
        )}

        {/* =================================================
            ERROR
            ================================================= */}

        {videoError && (
          <div className="hero-video-loading hero-video-error">
            <span>Presentación en imagen</span>
          </div>
        )}

        {/* =================================================
            CAPAS VISUALES
            ================================================= */}

        <div className="hero-overlay" />
        <div className="hero-light" />
        <div className="hero-glow" />
        <div className="hero-shimmer" />
      </div>

      {/* =====================================================
          AUDIO
          ===================================================== */}

      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
      >
        <source
          src="/images/parish/start.mp3"
          type="audio/mpeg"
        />

        Tu navegador no soporta audio.
      </audio>

      {/* =====================================================
          CONTROL DE AUDIO
          MUY POR ENCIMA DE TODO
          ===================================================== */}

      <div className="hero-audio-control">
        <button
          type="button"
          className="hero-audio-button"
          onClick={toggleAudio}
          aria-label={
            audioPlaying
              ? "Pausar canto"
              : "Reproducir canto"
          }
        >
          <span
            className="hero-audio-icon"
            aria-hidden="true"
          >
            {audioPlaying ? "❚❚" : "▶"}
          </span>

          <span className="hero-audio-label">
            {audioPlaying
              ? "Pausar canto"
              : "Reproducir canto"}
          </span>
        </button>
      </div>

      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <div className="hero-content">

        <div className="hero-copy">

          <p className="hero-location">
            Mineral de la Reforma · Hidalgo · México
          </p>

          <h1>
            {home.hero.title}
          </h1>

          <p className="hero-description">
            La Casa de Dios, en Mineral de la Reforma,
            Hidalgo, México.
          </p>

          {/* =================================================
              FRASE
              ================================================= */}

          {quote && (
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
          )}

          {/* =================================================
              BOTONES
              ================================================= */}

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

          {/* =================================================
              INFORMACIÓN DEL CANTO
              ================================================= */}

          {home.song && (
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
          )}

        </div>
      </div>
    </section>
  );
}