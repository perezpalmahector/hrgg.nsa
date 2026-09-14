import { useState } from "react";
import { ChevronRight, X, ArrowLeft, Play } from "lucide-react";
import DOMPurify from "dompurify";

import { parishData } from "@/services/parishData";

import "./pastoral.css";

type Group = {
    groupId: number | string;
    groupName: string;
    coordinator?: string;
    image?: string;
    description?: string;
    numberImages?: number;
    gallery?: string[];
    message?: string;
    choirPlaylist?: string;
    groups?: Group[];
};

function isVideo(fileName: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(fileName);
}

function getAutomaticGallery(group: Group) {
    if (!group.numberImages || group.numberImages <= 0) {
        return [];
    }

    return Array.from(
        { length: group.numberImages },
        (_, index) =>
            `group-${group.groupId}_${index + 1}.jpg`
    );
}

function getGallery(group: Group) {
    const automaticGallery = getAutomaticGallery(group);
    const manualGallery = group.gallery ?? [];

    return [...automaticGallery, ...manualGallery];
}

/**
 * Sanitiza el HTML almacenado en message.
 *
 * Se permiten únicamente las etiquetas y atributos
 * que actualmente utiliza el JSON de grupos.
 */
function sanitizeMessage(message: string) {
    return DOMPurify.sanitize(message, {
        ALLOWED_TAGS: [
            "div",
            "h2",
            "h3",
            "h4",
            "h5",
            "p",
            "strong",
            "b",
            "em",
            "i",
            "br",
            "span",
            "small",
            "ul",
            "ol",
            "li",
            "a",
            "blockquote",
            "footer",
        ],

        ALLOWED_ATTR: [
            "class",
            "href",
            "target",
            "rel",
        ],

        ALLOW_DATA_ATTR: false,

        ALLOWED_URI_REGEXP:
            /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    });
}

export function Pastoral() {
    const groups = parishData.groups as Group[];

    const [selectedGroup, setSelectedGroup] =
        useState<Group | null>(null);

    const [selectedSubGroup, setSelectedSubGroup] =
        useState<Group | null>(null);

    const openGroup = (group: Group) => {
        setSelectedGroup(group);
        setSelectedSubGroup(null);
    };

    const closeModal = () => {
        setSelectedGroup(null);
        setSelectedSubGroup(null);
    };

    const openSubGroup = (group: Group) => {
        setSelectedSubGroup(group);
    };

    const goBackToGroup = () => {
        setSelectedSubGroup(null);
    };

    const detailGroup =
        selectedSubGroup ?? selectedGroup;

    return (
        <>
            <section
                className="pastoral-section"
                id="pastoral"
            >
                <div className="pastoral-container">
                    <header className="pastoral-header">
                        <span className="pastoral-eyebrow">
                            Vida parroquial
                        </span>

                        <h2 className="pastoral-title">
                            Pastoral
                        </h2>

                        <p className="pastoral-subtitle">
                            Somos una comunidad llamada a caminar unida,
                            servir con alegría y anunciar el Evangelio.
                            Conoce los grupos y ministerios de nuestra
                            parroquia que, desde sus diferentes carismas
                            y servicios, hacen vida la misión de Cristo
                            y contribuyen a construir una comunidad de
                            fe, esperanza y amor.
                        </p>
                    </header>

                    <div className="pastoral-grid">
                        {groups.map((group) => (
                            <article
                                key={String(group.groupId)}
                                className="pastoral-card"
                            >
                                <div className="pastoral-card-image-wrapper">
                                    {group.image ? (
                                        <img
                                            src={`/images/groups/${group.image}`}
                                            alt={group.groupName}
                                            className="pastoral-card-image"
                                        />
                                    ) : (
                                        <div className="pastoral-card-image-placeholder">
                                            <span>
                                                {group.groupName}
                                            </span>
                                        </div>
                                    )}

                                    {getGalleryLabel(group) && (
                                        <span className="pastoral-image-count">
                                            {getGalleryLabel(group)}
                                        </span>
                                    )}

                                    {group.groups &&
                                        group.groups.length > 0 && (
                                            <span className="pastoral-subgroup-count">
                                                {group.groups.length}{" "}
                                                {group.groups.length === 1
                                                    ? "grupo"
                                                    : "grupos"}
                                            </span>
                                        )}
                                </div>

                                <div className="pastoral-card-content">
                                    <h3 className="pastoral-card-title">
                                        {group.groupName}
                                    </h3>

                                    {group.coordinator && (
                                        <p className="pastoral-card-coordinator">
                                            <strong>
                                                Coordinador:
                                            </strong>{" "}
                                            {group.coordinator}
                                        </p>
                                    )}

                                    {group.description && (
                                        <p className="pastoral-card-description">
                                            {group.description}
                                        </p>
                                    )}

                                    {(group.message ||
                                        (group.groups &&
                                            group.groups.length > 0) ||
                                        getGalleryLabel(group)) && (
                                            <button
                                                type="button"
                                                className="pastoral-card-button"
                                                onClick={() =>
                                                    openGroup(group)
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

            {detailGroup && (
                <div
                    className="pastoral-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={detailGroup.groupName}
                    onClick={closeModal}
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
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        {selectedSubGroup && (
                            <button
                                type="button"
                                className="pastoral-modal-back"
                                onClick={goBackToGroup}
                            >
                                <ArrowLeft size={17} />
                                Volver a{" "}
                                {selectedGroup?.groupName}
                            </button>
                        )}

                        <div className="pastoral-modal-header">
                            {detailGroup.image ? (
                                <img
                                    src={`/images/groups/${detailGroup.image}`}
                                    alt={detailGroup.groupName}
                                    className="pastoral-modal-image"
                                />
                            ) : (
                                <div className="pastoral-modal-image-placeholder">
                                    <span>
                                        {detailGroup.groupName}
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3>
                                    {detailGroup.groupName}
                                </h3>

                                {detailGroup.coordinator && (
                                    <p>
                                        <strong>
                                            Coordinador:
                                        </strong>{" "}
                                        {detailGroup.coordinator}
                                    </p>
                                )}
                            </div>
                        </div>

                        {selectedGroup?.groups &&
                            !selectedSubGroup &&
                            selectedGroup.groups.length > 0 && (
                                <div className="pastoral-subgroups">
                                    <div className="pastoral-subgroups-heading">
                                        <span>
                                            Música Sacra
                                        </span>

                                        <h4>
                                            Grupos que forman parte
                                        </h4>
                                    </div>

                                    <div className="pastoral-subgroups-grid">
                                        {selectedGroup.groups.map(
                                            (subGroup) => (
                                                <button
                                                    type="button"
                                                    key={String(
                                                        subGroup.groupId
                                                    )}
                                                    className="pastoral-subgroup-card"
                                                    onClick={() =>
                                                        openSubGroup(
                                                            subGroup
                                                        )
                                                    }
                                                >
                                                    <div className="pastoral-subgroup-image">
                                                        {subGroup.image ? (
                                                            <img
                                                                src={`/images/groups/${subGroup.image}`}
                                                                alt={
                                                                    subGroup.groupName
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="pastoral-subgroup-placeholder">
                                                                <span>
                                                                    {
                                                                        subGroup.groupName
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pastoral-subgroup-content">
                                                        <h5>
                                                            {
                                                                subGroup.groupName
                                                            }
                                                        </h5>

                                                        {subGroup.description && (
                                                            <p>
                                                                {
                                                                    subGroup.description
                                                                }
                                                            </p>
                                                        )}

                                                        <span className="pastoral-subgroup-link">
                                                            Ver detalle
                                                            <ChevronRight
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {selectedSubGroup &&
                            detailGroup.choirPlaylist && (
                                <div className="pastoral-playlist">
                                    <a
                                        href={
                                            detailGroup.choirPlaylist
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver playlist en YouTube
                                        <ChevronRight
                                            size={17}
                                        />
                                    </a>
                                </div>
                            )}

                        {detailGroup.message && (
                            <div
                                className="pastoral-modal-message"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeMessage(
                                        detailGroup.message
                                    ),
                                }}
                            />
                        )}

                        {getGallery(detailGroup).length > 0 && (
                            <section className="pastoral-gallery-section">
                                <div className="pastoral-gallery-header">
                                    <div>
                                        <span>
                                            Galería
                                        </span>

                                        <h4>
                                            Momentos del grupo
                                        </h4>
                                    </div>

                                    <strong>
                                        {
                                            getGallery(
                                                detailGroup
                                            ).length
                                        }{" "}
                                        {getGallery(
                                            detailGroup
                                        ).length === 1
                                            ? "elemento"
                                            : "elementos"}
                                    </strong>
                                </div>

                                <div className="pastoral-gallery">
                                    {getGallery(detailGroup).map(
                                        (fileName, index) => {
                                            const src =
                                                selectedSubGroup
                                                    ? `/images/groups/gallery/${fileName}`
                                                    : `/images/groups/gallery/${fileName}`;

                                            return (
                                                <div
                                                    className={`pastoral-gallery-item ${isVideo(
                                                        fileName
                                                    )
                                                            ? "is-video"
                                                            : ""
                                                        }`}
                                                    key={`${fileName}-${index}`}
                                                >
                                                    {isVideo(
                                                        fileName
                                                    ) ? (
                                                        <>
                                                            <video
                                                                src={src}
                                                                controls
                                                                preload="metadata"
                                                            />

                                                            <span className="pastoral-video-badge">
                                                                <Play
                                                                    size={
                                                                        13
                                                                    }
                                                                    fill="currentColor"
                                                                />
                                                                Video
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <img
                                                            src={src}
                                                            alt={`${detailGroup.groupName} - ${index +
                                                                1
                                                                }`}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function getGalleryLabel(group: Group) {
    const automaticCount = group.numberImages ?? 0;
    const manualCount = group.gallery?.length ?? 0;
    const total = automaticCount + manualCount;

    if (total === 0) {
        return null;
    }

    return `${total} ${total === 1 ? "elemento" : "elementos"
        }`;
}

export default Pastoral;