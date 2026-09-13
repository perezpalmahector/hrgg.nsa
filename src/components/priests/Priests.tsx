import { useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Heart,
    X,
} from "lucide-react";

import { parishData } from "@/services/parishData";

import "./priests.css";

type ParishAssignment = {
    numberParish: number;
    nameParish: string;
    dateParish: string;
};

type Priest = {
    nameComplete: string;
    order: number;
    period: string;
    photo: string;
    description: string;
    message?: string;
    deceased?: boolean;
    dateBirth: string;
    datePlaceBirth: string;
    onomastic: string;
    baptism: string;
    confirmation: string;
    diaconate: string;
    presbyterate: string;
    parishAssigment: ParishAssignment[];
    death?: string;
    retirement?: string;
};

export function Priests() {
    const priests = parishData.priests as Priest[];

    // Más reciente → más antiguo
    const sortedPriests = useMemo(() => {
        return [...priests].sort((a, b) => b.order - a.order);
    }, [priests]);

    const [selectedPriest, setSelectedPriest] = useState<Priest | null>(null);
    const [expandedPriest, setExpandedPriest] = useState<number | null>(null);

    const toggleExpanded = (order: number) => {
        setExpandedPriest((current) =>
            current === order ? null : order
        );
    };

    // Calcula los años que estuvo como párroco.
    // Ejemplos:
    // "2018 - 2024"     → 6 años
    // "2020 - Actualidad" → años transcurridos hasta el año actual
    const getYearsServed = (period: string) => {
        const years = period.match(/\d{4}/g);

        if (!years || years.length === 0) {
            return null;
        }

        const start = Number(years[0]);

        // Párroco actual
        if (/actualidad/i.test(period)) {
            const currentYear = new Date().getFullYear();
            return currentYear - start;
        }

        // Párroco que ya terminó su periodo
        if (years.length >= 2) {
            const end = Number(years[1]);
            return end - start;
        }

        return null;
    };

    return (
        <>
            <section className="priests-section" id="parrocos">
                <div className="priests-container">
                    <header className="priests-header">
                        <span className="priests-eyebrow">
                            Nuestra comunidad
                        </span>

                        <h2 className="priests-title">
                            Párrocos
                        </h2>

                        <p className="priests-subtitle">
                            Conoce a los sacerdotes que han acompañado y
                            servido a nuestra comunidad parroquial a lo largo
                            de los años.
                        </p>
                    </header>

                    <div className="priests-list">
                        {sortedPriests.map((priest) => {
                            const isCurrent = priest.order === 5;
                            const isExpanded =
                                expandedPriest === priest.order;

                            const yearsServed = getYearsServed(
                                priest.period
                            );

                            return (
                                <article
                                    key={priest.order}
                                    className={`priest-card ${isCurrent
                                            ? "priest-card-current"
                                            : ""
                                        }`}
                                >
                                    <div className="priest-card-main">
                                        <div className="priest-photo-wrapper">
                                            <img
                                                src={`/images/priests/${priest.photo}`}
                                                alt={priest.nameComplete}
                                                className="priest-photo"
                                            />
                                        </div>

                                        <div className="priest-info">
                                            <div className="priest-top">
                                                <div>
                                                    {isCurrent && (
                                                        <span className="priest-current-badge">
                                                            Párroco actual
                                                        </span>
                                                    )}

                                                    {priest.deceased && (
                                                        <span className="priest-deceased-badge">
                                                            + En memoria
                                                        </span>
                                                    )}

                                                    <h3 className="priest-name">
                                                        {priest.nameComplete}
                                                    </h3>

                                                    <p className="priest-period">
                                                        <CalendarDays
                                                            size={16}
                                                        />
                                                        {priest.period}
                                                    </p>

                                                    {yearsServed !== null && (
                                                        <p className="priest-years">
                                                            {yearsServed}{" "}
                                                            {yearsServed === 1
                                                                ? "año"
                                                                : "años"}{" "}
                                                            de servicio
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="priest-actions">
                                                <button
                                                    type="button"
                                                    className="priest-details-button"
                                                    onClick={() =>
                                                        setSelectedPriest(
                                                            priest
                                                        )
                                                    }
                                                >
                                                    Ver información
                                                </button>

                                                <button
                                                    type="button"
                                                    className="priest-expand-button"
                                                    onClick={() =>
                                                        toggleExpanded(
                                                            priest.order
                                                        )
                                                    }
                                                    aria-expanded={isExpanded}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Ocultar trayectoria
                                                            <ChevronUp
                                                                size={18}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Ver trayectoria
                                                            <ChevronDown
                                                                size={18}
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="priest-assignments">
                                            <h4>
                                                Trayectoria parroquial
                                            </h4>

                                            <div className="priest-timeline">
                                                {priest.parishAssigment.map(
                                                    (assignment) => (
                                                        <div
                                                            className="priest-timeline-item"
                                                            key={
                                                                assignment.numberParish
                                                            }
                                                        >
                                                            <div className="priest-timeline-number">
                                                                {
                                                                    assignment.numberParish
                                                                }
                                                            </div>

                                                            <div className="priest-timeline-content">
                                                                <strong>
                                                                    {
                                                                        assignment.nameParish
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        assignment.dateParish
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {selectedPriest && (
                <div
                    className="priest-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Información de ${selectedPriest.nameComplete}`}
                    onClick={() => setSelectedPriest(null)}
                >
                    <div
                        className="priest-modal-content"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="priest-modal-close"
                            onClick={() => setSelectedPriest(null)}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        <div className="priest-modal-header">
                            <img
                                src={`/images/priests/${selectedPriest.photo}`}
                                alt={selectedPriest.nameComplete}
                                className="priest-modal-photo"
                            />

                            <div>
                                {selectedPriest.deceased && (
                                    <span className="priest-deceased-badge">
                                        + En memoria
                                    </span>
                                )}

                                <h3>
                                    {selectedPriest.nameComplete}
                                </h3>

                                <p>
                                    {selectedPriest.period}
                                </p>

                                {getYearsServed(
                                    selectedPriest.period
                                ) !== null && (
                                        <span className="priest-years">
                                            {getYearsServed(
                                                selectedPriest.period
                                            )}{" "}
                                            {getYearsServed(
                                                selectedPriest.period
                                            ) === 1
                                                ? "año"
                                                : "años"}{" "}
                                            de servicio
                                        </span>
                                    )}
                            </div>
                        </div>

                        {selectedPriest.message && (
                            <blockquote
                                className="priest-message"
                                dangerouslySetInnerHTML={{
                                    __html: selectedPriest.message,
                                }}
                            />
                        )}

                        <div className="priest-data-grid">
                            <div>
                                <span>Fecha de nacimiento</span>
                                <strong>
                                    {selectedPriest.datePlaceBirth}
                                </strong>
                            </div>

                            <div>
                                <span>Onomástico</span>
                                <strong>
                                    {selectedPriest.onomastic}
                                </strong>
                            </div>

                            <div>
                                <span>Bautismo</span>
                                <strong>
                                    {selectedPriest.baptism}
                                </strong>
                            </div>

                            <div>
                                <span>Confirmación</span>
                                <strong>
                                    {selectedPriest.confirmation}
                                </strong>
                            </div>

                            <div>
                                <span>Diaconado</span>
                                <strong>
                                    {selectedPriest.diaconate}
                                </strong>
                            </div>

                            <div>
                                <span>Presbiterado</span>
                                <strong>
                                    {selectedPriest.presbyterate}
                                </strong>
                            </div>

                            {selectedPriest.death && (
                                <div>
                                    <span>Fallecimiento</span>
                                    <strong>
                                        {selectedPriest.death}
                                    </strong>
                                </div>
                            )}

                            {selectedPriest.retirement && (
                                <div>
                                    <span>Retiro</span>
                                    <strong>
                                        {selectedPriest.retirement}
                                    </strong>
                                </div>
                            )}
                        </div>

                        <div className="priest-modal-footer">
                            <Heart size={18} />

                            <span>
                                Agradecemos el servicio y entrega de quienes
                                han acompañado a nuestra comunidad.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Priests;