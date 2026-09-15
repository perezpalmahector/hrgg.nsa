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

function getGalleryLabel(group: Group) {
    const total = group.numberImages ?? 0;

    if (total === 0) {
        return null;
    }

    return `${total} ${total === 1 ? "elemento" : "elementos"}`;
}

export function Pastoral() {
    const groups = getGroups();

    return (
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
                        Somos una comunidad llamada a caminar unida, servir
                        con alegría y anunciar el Evangelio. Conoce los grupos
                        y ministerios de nuestra parroquia que, desde sus
                        diferentes carismas y servicios, hacen vida la misión
                        de Cristo y contribuyen a construir una comunidad de
                        fe, esperanza y amor.
                    </p>
                </header>

                <div className="pastoral-grid">
                    {groups.map((group) => {
                        const groupPath = `/pastoral/${slugify(
                            group.groupName,
                        )}`;

                        return (
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
                                            <span>{group.groupName}</span>
                                        </div>
                                    )}

                                    {getGalleryLabel(group) && (
                                        <span className="pastoral-image-count">
                                            {getGalleryLabel(group)}
                                        </span>
                                    )}
                                </div>

                                <div className="pastoral-card-content">
                                    <h3 className="pastoral-card-title">
                                        {group.groupName}
                                    </h3>

                                    {group.coordinator && (
                                        <p className="pastoral-card-coordinator">
                                            <strong>Coordinador:</strong>{" "}
                                            {group.coordinator}
                                        </p>
                                    )}

                                    {group.description && (
                                        <p className="pastoral-card-description">
                                            {group.description}
                                        </p>
                                    )}

                                    <Link
                                        to={groupPath}
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
