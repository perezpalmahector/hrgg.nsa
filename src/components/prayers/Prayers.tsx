import { useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    Heart,
    Search,
    X,
} from "lucide-react";

import prayersData from "@/data/prayers.json";
import "./prayers.css";

interface Prayer {
    id: number;
    nombre: string;
    categoria: string;
    texto: string;
}

const prayers = prayersData as Prayer[];

export default function Prayers() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [selectedPrayer, setSelectedPrayer] =
        useState<Prayer | null>(null);

    const detailRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Posición del listado antes de abrir una oración.
    const previousScrollY = useRef(0);

    const categories = useMemo(
        () => [
            "Todas",
            ...Array.from(
                new Set(prayers.map((prayer) => prayer.categoria))
            ).sort((a, b) => a.localeCompare(b, "es")),
        ],
        []
    );

    const filteredPrayers = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLocaleLowerCase("es");

        return prayers.filter((prayer) => {
            const matchesCategory =
                category === "Todas" ||
                prayer.categoria === category;

            const matchesSearch = [
                prayer.nombre,
                prayer.categoria,
                prayer.texto,
            ].some((value) =>
                value.toLocaleLowerCase("es").includes(normalizedSearch)
            );

            return matchesCategory && matchesSearch;
        });
    }, [search, category]);

    // Abrir el detalle y guardar la posición actual.
    const openPrayer = (prayer: Prayer) => {
        previousScrollY.current = window.scrollY;
        setSelectedPrayer(prayer);
    };

    // Cuando aparece el detalle, llevarlo a la vista.
    useEffect(() => {
        if (!selectedPrayer) return;

        const frame = window.requestAnimationFrame(() => {
            detailRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [selectedPrayer]);

    // Cerrar el detalle y recuperar la posición del listado.
    const closePrayer = () => {
        setSelectedPrayer(null);

        window.requestAnimationFrame(() => {
            window.scrollTo({
                top: previousScrollY.current,
                behavior: "auto",
            });
        });
    };

    return (
        <section className="prayers-page" id="oraciones">
            <div className="prayers-container">
                <header className="prayers-header">
                    <span className="prayers-eyebrow">
                        <Heart size={15} />
                        Nuestra vida espiritual
                    </span>

                    <h2 className="prayers-title">Oraciones</h2>

                    <p className="prayers-description">
                        Encuentra un momento de paz, fortalece tu fe
                        y dedica unos minutos a la oración.
                    </p>
                </header>

                {selectedPrayer ? (
                    /* DETALLE DE LA ORACIÓN */
                    <section
                        ref={detailRef}
                        className="prayer-detail-section"
                        aria-label={`Detalle de ${selectedPrayer.nombre}`}
                        tabIndex={-1}
                    >
                        <article className="prayer-reading">
                            <button
                                type="button"
                                className="prayer-back"
                                onClick={closePrayer}
                            >
                                <ArrowLeft size={18} />
                                Volver a las oraciones
                            </button>

                            <div className="prayer-reading-card">
                                <div className="prayer-reading-icon">
                                    <BookOpen size={30} strokeWidth={1.5} />
                                </div>

                                <span className="prayer-category-label">
                                    {selectedPrayer.categoria}
                                </span>

                                <h2>{selectedPrayer.nombre}</h2>

                                <div className="prayer-ornament">
                                    <span />
                                    <Heart size={15} />
                                    <span />
                                </div>

                                <p className="prayer-reading-text">
                                    {selectedPrayer.texto}
                                </p>

                                <button
                                    type="button"
                                    className="prayer-back prayer-back-bottom"
                                    onClick={closePrayer}
                                >
                                    <ArrowLeft size={18} />
                                    Ver todas las oraciones
                                </button>
                            </div>
                        </article>
                    </section>
                ) : (
                    /* LISTADO DE ORACIONES */
                    <div ref={listRef}>
                        <section className="prayers-toolbar">
                            <label
                                className="prayers-search"
                                htmlFor="prayers-search-input"
                            >
                                <Search size={20} />

                                <input
                                    id="prayers-search-input"
                                    type="search"
                                    placeholder="Buscar una oración..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        className="prayers-clear"
                                        aria-label="Limpiar búsqueda"
                                        onClick={() => setSearch("")}
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </label>

                            <p className="prayers-count">
                                {filteredPrayers.length}{" "}
                                {filteredPrayers.length === 1
                                    ? "oración encontrada"
                                    : "oraciones encontradas"}
                            </p>
                        </section>

                        <nav
                            className="prayers-filters"
                            aria-label="Filtrar oraciones por categoría"
                        >
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`prayers-filter ${category === item ? "active" : ""
                                        }`}
                                    aria-pressed={category === item}
                                    onClick={() => setCategory(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>

                        {filteredPrayers.length > 0 ? (
                            <section
                                className="prayers-grid"
                                aria-label="Listado de oraciones"
                            >
                                {filteredPrayers.map((prayer) => (
                                    <article
                                        className="prayer-card"
                                        key={prayer.id}
                                    >
                                        <div className="prayer-card-top">
                                            <div className="prayer-card-icon">
                                                <BookOpen
                                                    size={23}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            <span className="prayer-card-category">
                                                {prayer.categoria}
                                            </span>
                                        </div>

                                        <h3>{prayer.nombre}</h3>

                                        <p className="prayer-card-excerpt">
                                            {prayer.texto}
                                        </p>

                                        <button
                                            type="button"
                                            className="prayer-card-button"
                                            onClick={() => openPrayer(prayer)}
                                        >
                                            Leer oración
                                            <BookOpen size={17} />
                                        </button>
                                    </article>
                                ))}
                            </section>
                        ) : (
                            <div className="prayers-empty">
                                <Search size={34} />

                                <h3>No encontramos oraciones</h3>

                                <p>
                                    Intenta con otro nombre o selecciona
                                    una categoría diferente.
                                </p>

                                <button
                                    type="button"
                                    className="prayers-reset"
                                    onClick={() => {
                                        setSearch("");
                                        setCategory("Todas");
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}