import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FastForward,
    Music2,
    Pause,
    Play,
    RotateCcw,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type SongLink = {
    linkId: number;
    platformName: string;
    linkUrl: string;
};

type SongAuthor = {
    name: string;
};

type SongPerformer = {
    name: string;
};

type SongCategory = {
    id?: number;
    name?: string;
};

type SongLine = {
    id: number;
    type: string;
    order: number;
    text: string;
};

type SongSection = {
    id: number;
    type: string;
    order: number;
    number?: number;
    lines: SongLine[];
};

export type Song = {
    id: number;
    slug: string;
    name: string;
    tonality?: string;
    songlinks?: SongLink[];
    authors?: SongAuthor[];
    performers?: SongPerformer[];
    categories?: SongCategory[];
    sections?: SongSection[];
};

type SongDetailProps = {
    song: Song | null;
    songs?: Song[];
    mode?: "lyrics" | "full";
    onClose: () => void;
    onNavigate?: (
        song: Song,
        mode: "lyrics" | "full"
    ) => void;
};

export function SongDetail({
    song,
    songs = [],
    mode = "lyrics",
    onClose,
    onNavigate,
}: SongDetailProps) {
    const scrollRef =
        useRef<HTMLDivElement | null>(null);

    const animationRef =
        useRef<number | null>(null);

    const lastTimeRef =
        useRef<number | null>(null);

    const [isAutoScrolling, setIsAutoScrolling] =
        useState(false);

    const [speed, setSpeed] = useState(20);

    const currentIndex = useMemo(() => {
        if (!song) {
            return -1;
        }

        return songs.findIndex(
            (item) =>
                item.id === song.id ||
                item.slug === song.slug
        );
    }, [song, songs]);

    /*
     * Navegación circular
     *
     * Primero -> Anterior -> Último
     * Último -> Siguiente -> Primero
     */
    const hasPrevious =
        currentIndex >= 0 &&
        songs.length > 1;

    const hasNext =
        currentIndex >= 0 &&
        songs.length > 1;

    const previousIndex =
        currentIndex === 0
            ? songs.length - 1
            : currentIndex - 1;

    const nextIndex =
        currentIndex === songs.length - 1
            ? 0
            : currentIndex + 1;

    const filteredSections = useMemo(() => {
        if (!song?.sections) {
            return [];
        }

        return song.sections
            .map((section) => {
                /*
                 * Algunos cantos pueden tener una sección
                 * sin lines. En ese caso usamos [] para
                 * evitar que el componente truene.
                 */
                const sectionLines =
                    Array.isArray(section.lines)
                        ? section.lines
                        : [];

                const lines =
                    mode === "lyrics"
                        ? sectionLines.filter(
                            (line) =>
                                line.type
                                    .toUpperCase() ===
                                "L"
                        )
                        : sectionLines;

                return {
                    ...section,
                    lines,
                };
            })
            .filter(
                (section) =>
                    section.lines.length > 0
            );
    }, [song, mode]);

    const estimatedMinutes = useMemo(() => {
        const element = scrollRef.current;

        if (!element) {
            return 0;
        }

        const distance =
            Math.max(
                0,
                element.scrollHeight -
                element.clientHeight
            );

        if (distance <= 0) {
            return 0;
        }

        return Math.max(
            1,
            Math.ceil(
                distance / speed / 60
            )
        );
    }, [
        song,
        mode,
        speed,
        filteredSections,
    ]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        setIsAutoScrolling(false);
        lastTimeRef.current = null;

        if (animationRef.current !== null) {
            cancelAnimationFrame(
                animationRef.current
            );

            animationRef.current = null;
        }

        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [song?.id, mode]);

    useEffect(() => {
        if (!isAutoScrolling) {
            if (
                animationRef.current !== null
            ) {
                cancelAnimationFrame(
                    animationRef.current
                );

                animationRef.current = null;
            }

            lastTimeRef.current = null;
            return;
        }

        const scroll = (
            timestamp: number
        ) => {
            const element =
                scrollRef.current;

            if (!element) {
                return;
            }

            if (
                lastTimeRef.current === null
            ) {
                lastTimeRef.current =
                    timestamp;
            }

            const delta =
                timestamp -
                lastTimeRef.current;

            lastTimeRef.current =
                timestamp;

            const amount =
                (speed * delta) / 1000;

            element.scrollTop += amount;

            const reachedBottom =
                element.scrollTop +
                element.clientHeight >=
                element.scrollHeight - 2;

            if (reachedBottom) {
                setIsAutoScrolling(false);
                lastTimeRef.current =
                    null;
                animationRef.current = null;
                return;
            }

            animationRef.current =
                requestAnimationFrame(
                    scroll
                );
        };

        animationRef.current =
            requestAnimationFrame(scroll);

        return () => {
            if (
                animationRef.current !== null
            ) {
                cancelAnimationFrame(
                    animationRef.current
                );

                animationRef.current = null;
            }

            lastTimeRef.current = null;
        };
    }, [isAutoScrolling, speed]);

    if (!song) {
        return null;
    }

    const handlePrevious = () => {
        if (
            !hasPrevious ||
            !onNavigate
        ) {
            return;
        }

        const previousSong =
            songs[previousIndex];

        if (!previousSong) {
            return;
        }

        onNavigate(
            previousSong,
            mode
        );
    };

    const handleNext = () => {
        if (
            !hasNext ||
            !onNavigate
        ) {
            return;
        }

        const nextSong =
            songs[nextIndex];

        if (!nextSong) {
            return;
        }

        onNavigate(
            nextSong,
            mode
        );
    };

    const handleResetScroll = () => {
        setIsAutoScrolling(false);

        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const toggleAutoScroll = () => {
        const element =
            scrollRef.current;

        if (!element) {
            return;
        }

        const canScroll =
            element.scrollHeight >
            element.clientHeight + 2;

        if (!canScroll) {
            return;
        }

        if (
            element.scrollTop +
            element.clientHeight >=
            element.scrollHeight - 2
        ) {
            element.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            window.setTimeout(() => {
                setIsAutoScrolling(true);
            }, 250);

            return;
        }

        setIsAutoScrolling(
            (value) => !value
        );
    };

    return (
        <div
            className="choir-song-detail-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle del canto ${song.name}`}
            onClick={onClose}
        >
            <div
                className="choir-song-detail"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <header className="choir-song-detail-header">
                    <div className="choir-song-detail-heading">
                        <div className="choir-song-detail-icon">
                            {mode === "lyrics" ? (
                                <BookOpen
                                    size={24}
                                    aria-hidden="true"
                                />
                            ) : (
                                <Music2
                                    size={24}
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        <div>
                            <span>
                                {mode === "lyrics"
                                    ? "Letra del canto"
                                    : "Detalle del canto"}
                            </span>

                            <h2>
                                {song.name}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="choir-song-detail-close"
                        onClick={onClose}
                        aria-label="Cerrar detalle"
                        title="Cerrar"
                    >
                        <X
                            size={24}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                {songs.length > 1 && (
                    <div className="choir-song-navigation">
                        <button
                            type="button"
                            onClick={
                                handlePrevious
                            }
                            disabled={!hasPrevious}
                            className="choir-song-navigation-button"
                        >
                            <ChevronLeft
                                size={18}
                                aria-hidden="true"
                            />

                            <span>
                                Anterior
                            </span>
                        </button>

                        <span className="choir-song-navigation-position">
                            {currentIndex + 1} /{" "}
                            {songs.length}
                        </span>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!hasNext}
                            className="choir-song-navigation-button"
                        >
                            <span>
                                Siguiente
                            </span>

                            <ChevronRight
                                size={18}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                )}

                <div className="choir-song-detail-toolbar">
                    <div className="choir-song-detail-mode">
                        <span>
                            {mode === "lyrics"
                                ? "Solo letra"
                                : "Letra + armonía + melodía"}
                        </span>
                    </div>

                    <div className="choir-song-scroll-controls">
                        <button
                            type="button"
                            className="choir-song-scroll-button"
                            onClick={
                                handleResetScroll
                            }
                            title="Volver al inicio"
                            aria-label="Volver al inicio"
                        >
                            <RotateCcw
                                size={17}
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            className={`choir-song-scroll-play ${isAutoScrolling
                                ? "is-running"
                                : ""
                                }`}
                            onClick={
                                toggleAutoScroll
                            }
                        >
                            {isAutoScrolling ? (
                                <>
                                    <Pause
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Pausar
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Play
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Desplazar
                                    </span>
                                </>
                            )}
                        </button>

                        <div className="choir-song-speed">
                            <FastForward
                                size={16}
                                aria-hidden="true"
                            />

                            <input
                                type="range"
                                min="8"
                                max="48"
                                step="4"
                                value={speed}
                                onChange={(event) =>
                                    setSpeed(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                }
                                aria-label="Velocidad de desplazamiento"
                            />

                            <span>
                                {estimatedMinutes > 0
                                    ? `~${estimatedMinutes} min`
                                    : "Sin desplazamiento"}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="choir-song-detail-body"
                >
                    {mode === "full" && (
                        <>
                            <div className="choir-song-meta">
                                {song.tonality && (
                                    <div className="choir-song-meta-item">
                                        <span>
                                            Tonalidad
                                        </span>

                                        <strong>
                                            {
                                                song.tonality
                                            }
                                        </strong>
                                    </div>
                                )}

                                {song.authors &&
                                    song.authors.length >
                                    0 && (
                                        <div className="choir-song-meta-item">
                                            <span>
                                                Autor
                                            </span>

                                            <strong>
                                                {song.authors
                                                    .map(
                                                        (
                                                            author
                                                        ) =>
                                                            author.name
                                                    )
                                                    .join(
                                                        ", "
                                                    )}
                                            </strong>
                                        </div>
                                    )}
                            </div>

                            {song.categories &&
                                song.categories.length >
                                0 && (
                                    <div className="choir-song-categories">
                                        {song.categories.map(
                                            (
                                                category,
                                                index
                                            ) => (
                                                <span
                                                    key={
                                                        category.id ??
                                                        `${category.name}-${index}`
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                            {song.songlinks &&
                                song.songlinks.length >
                                0 && (
                                    <div className="choir-song-links">
                                        {song.songlinks.map(
                                            (
                                                link
                                            ) => (
                                                <a
                                                    key={
                                                        link.linkId
                                                    }
                                                    href={
                                                        link.linkUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="choir-song-link"
                                                >
                                                    <ExternalLink
                                                        size={
                                                            16
                                                        }
                                                        aria-hidden="true"
                                                    />

                                                    <span>
                                                        {
                                                            link.platformName
                                                        }
                                                    </span>
                                                </a>
                                            )
                                        )}
                                    </div>
                                )}
                        </>
                    )}

                    <div className="choir-song-content">
                        {filteredSections.map(
                            (section) => (
                                <section
                                    key={
                                        section.id
                                    }
                                    className="choir-song-section"
                                >
                                    <div className="choir-song-section-title">
                                        {mode ===
                                            "lyrics"
                                            ? section.type ===
                                                "chorus"
                                                ? "Coro"
                                                : section.number
                                                    ? `Verso ${section.number - 1}`
                                                    : "Letra"
                                            : section.type ===
                                                "chorus"
                                                ? "Coro"
                                                : section.number
                                                    ? `Verso ${section.number - 1}`
                                                    : "Sección"}
                                    </div>

                                    <div className="choir-song-lines">
                                        {section.lines.map(
                                            (
                                                line
                                            ) => (
                                                <div
                                                    key={
                                                        line.id
                                                    }
                                                    className={`choir-song-line choir-song-line-${line.type.toLowerCase()}`}
                                                >
                                                    {
                                                        line.text
                                                    }
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SongDetail;
