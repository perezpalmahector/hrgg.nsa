import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

import { parishData } from "@/services/parishData";

import "./pastoral.css";

type Group = {
    groupId: number;
    groupName: string;
    coordinator: string;
    image: string;
    description: string;
    numberImages?: number;
    message?: string;
};

export function Pastoral() {
    const groups = parishData.groups as Group[];

    const [selectedGroup, setSelectedGroup] =
        useState<Group | null>(null);

    return (
        <>
            <section className="pastoral-section" id="pastoral">
                <div className="pastoral-container">
                    <header className="pastoral-header">
                        <span className="pastoral-eyebrow">
                            Vida parroquial
                        </span>

                        <h2 className="pastoral-title">
                            Pastoral
                        </h2>

                        <p className="pastoral-subtitle">
                            Somos una comunidad llamada a caminar unida, servir con alegría y anunciar el Evangelio. Conoce los grupos y ministerios de nuestra parroquia que, desde sus diferentes carismas y servicios, hacen vida la misión de Cristo y contribuyen a construir una comunidad de fe, esperanza y amor.
                        </p>
                    </header>

                    <div className="pastoral-grid">
                        {groups.map((group) => (
                            <article
                                key={group.groupId}
                                className="pastoral-card"
                            >
                                <div className="pastoral-card-image-wrapper">
                                    <img
                                        src={`/images/groups/${group.image}`}
                                        alt={group.groupName}
                                        className="pastoral-card-image"
                                    />

                                    {group.numberImages && (
                                        <span className="pastoral-image-count">
                                            {group.numberImages} imágenes
                                        </span>
                                    )}
                                </div>

                                <div className="pastoral-card-content">
                                    <h3 className="pastoral-card-title">
                                        {group.groupName}
                                    </h3>

                                    <p className="pastoral-card-coordinator">
                                        <strong>Coordinador:</strong>{" "}
                                        {group.coordinator}
                                    </p>

                                    <p className="pastoral-card-description">
                                        {group.description}
                                    </p>

                                    {group.message && (
                                        <button
                                            type="button"
                                            className="pastoral-card-button"
                                            onClick={() =>
                                                setSelectedGroup(group)
                                            }
                                        >
                                            Conocer más
                                            <ChevronRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {selectedGroup && (
                <div
                    className="pastoral-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedGroup.groupName}
                    onClick={() => setSelectedGroup(null)}
                >
                    <div
                        className="pastoral-modal-content"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="pastoral-modal-close"
                            onClick={() =>
                                setSelectedGroup(null)
                            }
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        <div className="pastoral-modal-header">
                            <img
                                src={`/images/groups/${selectedGroup.image}`}
                                alt={selectedGroup.groupName}
                                className="pastoral-modal-image"
                            />

                            <div>
                                <h3>
                                    {selectedGroup.groupName}
                                </h3>

                                <p>
                                    <strong>Coordinador:</strong>{" "}
                                    {selectedGroup.coordinator}
                                </p>
                            </div>
                        </div>

                        <div
                            className="pastoral-modal-message"
                            dangerouslySetInnerHTML={{
                                __html: selectedGroup.message || "",
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Pastoral;