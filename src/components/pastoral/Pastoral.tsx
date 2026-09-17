import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getGroups(): Group[] {
    const data = parishData.groups as unknown;

    if (Array.isArray(data)) {
        return data as Group[];
    }

    if (
        data &&
        typeof data === "object" &&
        "groups" in data &&
        Array.isArray((data as { groups?: unknown }).groups)
    ) {
        return (data as { groups: Group[] }).groups;
    }

    return [];
}

function getGroupImage(image?: string) {
    if (!image) return "";

    if (
        image.startsWith("/") ||
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return `/images/groups/${image}`;
}

function getGalleryLabel(group: Group) {
    if (!group.numberImages) {
        return null;
    }

    return `${group.numberImages} ${group.numberImages === 1 ? "imagen" : "imágenes"
        }`;
}

export function Pastoral() {
    const groups = getGroups();

    return (
        <section
            id="pastoral"
            className="pastoral-section"
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
                        Somos una comunidad llamada a caminar
                        unida, servir con alegría y anunciar el
                        Evangelio. Conoce los grupos y ministerios
                        de nuestra parroquia que, desde sus
                        diferentes carismas y servicios, hacen
                        vida la misión de Cristo.
                    </p>
                </header>

                <div className="pastoral-grid">
                    {groups.map((group) => {
                        const imageSrc = getGroupImage(group.image);
                        const galleryLabel =
                            getGalleryLabel(group);

                        return (
                            <article
                                key={String(group.groupId)}
                                className="pastoral-card"
                            >
                                <div className="pastoral-card-image-wrapper">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
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

                                    {galleryLabel && (
                                        <span className="pastoral-image-count">
                                            {galleryLabel}
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

                                    <Link
                                        to={`/pastoral/${slugify(
                                            group.groupName
                                        )}`}
                                        className="pastoral-card-button"
                                    >
                                        Conocer más
                                        <ChevronRight size={18} />
                                    </Link>

                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Pastoral;