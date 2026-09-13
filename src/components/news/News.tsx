import { useEffect, useMemo, useState } from "react";
import { parishData } from "@/services/parishData";
import "./news.css";

type NewsItem = {
  newId: number;
  newDate: string;
  newDates: string;
  newShort: string;
  newDescription: string;
  groupId?: number;
  media?: string;
  cropImages?: boolean;
};

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".webm",
  ".ogg",
  ".ogv",
  ".mov",
  ".m4v",
];

function isVideo(media?: string) {
  if (!media) return false;

  const lower = media.toLowerCase();

  return VIDEO_EXTENSIONS.some((extension) =>
    lower.endsWith(extension)
  );
}

function isImage(media?: string) {
  if (!media) return false;

  const lower = media.toLowerCase();

  return IMAGE_EXTENSIONS.some((extension) =>
    lower.endsWith(extension)
  );
}

function getMediaUrl(media: string) {
  return `/images/news/${encodeURIComponent(media)}`;
}

export function News() {
  const [selectedNews, setSelectedNews] =
    useState<NewsItem | null>(null);

  const [openYears, setOpenYears] =
    useState<number[]>([]);

  const news = useMemo(() => {
    return [...(parishData.news as NewsItem[])].sort(
      (a, b) =>
        new Date(b.newDate).getTime() -
        new Date(a.newDate).getTime()
    );
  }, []);

  const newsByYear = useMemo(() => {
    const groups = new Map<number, NewsItem[]>();

    news.forEach((item) => {
      const year = new Date(item.newDate).getFullYear();

      if (!groups.has(year)) {
        groups.set(year, []);
      }

      groups.get(year)!.push(item);
    });

    return Array.from(groups.entries()).sort(
      ([yearA], [yearB]) => yearB - yearA
    );
  }, [news]);

  useEffect(() => {
    if (
      newsByYear.length > 0 &&
      openYears.length === 0
    ) {
      setOpenYears([newsByYear[0][0]]);
    }
  }, [newsByYear, openYears.length]);

  if (news.length === 0) {
    return null;
  }

  const toggleYear = (year: number) => {
    setOpenYears((current) =>
      current.includes(year)
        ? current.filter((item) => item !== year)
        : [...current, year]
    );
  };

  return (
    <section
      className="news-section"
      id="noticias"
    >
      <div className="news-container">

        <header className="news-header">
          <div>
            <span className="news-eyebrow">
              Mantente informado
            </span>

            <h2 className="news-title">
              Noticias de nuestra parroquia
            </h2>

            <p className="news-subtitle">
              Conoce las actividades, celebraciones y
              acontecimientos de nuestra comunidad
              parroquial.
            </p>
          </div>

          <div
            className="news-header-icon"
            aria-hidden="true"
          >
            ✦
          </div>
        </header>

        <div className="news-years">
          {newsByYear.map(
            ([year, yearNews]) => {
              const isOpen =
                openYears.includes(year);

              return (
                <div
                  className="news-year"
                  key={year}
                >
                  <button
                    type="button"
                    className={`news-year-header ${
                      isOpen
                        ? "news-year-header-open"
                        : ""
                    }`}
                    onClick={() =>
                      toggleYear(year)
                    }
                    aria-expanded={isOpen}
                  >
                    <span className="news-year-title">
                      {year}
                    </span>

                    <span className="news-year-count">
                      {yearNews.length}{" "}
                      {yearNews.length === 1
                        ? "noticia"
                        : "noticias"}
                    </span>

                    <span
                      className={`news-year-arrow ${
                        isOpen
                          ? "news-year-arrow-open"
                          : ""
                      }`}
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="news-grid">
                      {yearNews.map((item) => (
                        <article
                          className="news-card"
                          key={item.newId}
                        >
                          <div className="news-image-wrapper">

                            {item.media &&
                            isVideo(item.media) ? (
                              <video
                                className="news-image news-video"
                                controls
                                preload="metadata"
                              >
                                <source
                                  src={getMediaUrl(
                                    item.media
                                  )}
                                />

                                Tu navegador no
                                puede reproducir
                                este video.
                              </video>
                            ) : item.media &&
                              isImage(
                                item.media
                              ) ? (
                              <img
                                src={getMediaUrl(
                                  item.media
                                )}
                                alt={item.newShort}
                                className={`news-image ${
                                  item.cropImages
                                    ? "news-image-crop"
                                    : ""
                                }`}
                                loading="lazy"
                              />
                            ) : (
                              <div className="news-image-placeholder">
                                ✝
                              </div>
                            )}

                            <div className="news-date">
                              {item.newDates}
                            </div>
                          </div>

                          <div className="news-content">
                            <h3 className="news-card-title">
                              {item.newShort}
                            </h3>

                            <p className="news-card-text">
                              {getPreview(
                                item.newDescription
                              )}
                            </p>

                            <button
                              type="button"
                              className="news-button"
                              onClick={() =>
                                setSelectedNews(
                                  item
                                )
                              }
                            >
                              Leer noticia
                              <span>→</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {selectedNews && (
        <div
          className="news-modal-backdrop"
          onClick={() =>
            setSelectedNews(null)
          }
        >
          <div
            className="news-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="news-modal-close"
              aria-label="Cerrar noticia"
              onClick={() =>
                setSelectedNews(null)
              }
            >
              ×
            </button>

            {selectedNews.media &&
              isVideo(
                selectedNews.media
              ) && (
                <div className="news-modal-image-wrapper">
                  <video
                    className="news-modal-image news-modal-video"
                    controls
                    preload="metadata"
                  >
                    <source
                      src={getMediaUrl(
                        selectedNews.media
                      )}
                    />

                    Tu navegador no puede
                    reproducir este video.
                  </video>
                </div>
              )}

            {selectedNews.media &&
              isImage(
                selectedNews.media
              ) && (
                <div className="news-modal-image-wrapper">
                  <img
                    src={getMediaUrl(
                      selectedNews.media
                    )}
                    alt={selectedNews.newShort}
                    className={`news-modal-image ${
                      selectedNews.cropImages
                        ? "news-image-crop"
                        : ""
                    }`}
                  />
                </div>
              )}

            <div className="news-modal-content">
              <span className="news-modal-date">
                {selectedNews.newDates}
              </span>

              <h3 id="news-modal-title">
                {selectedNews.newShort}
              </h3>

              <div
                className="news-modal-description"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedNews.newDescription,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function getPreview(
  html: string,
  maxLength = 150
) {
  const text = html
    .replace(
      /<br\s*\/?>/gi,
      " "
    )
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text
    .substring(0, maxLength)
    .trim()}…`;
}