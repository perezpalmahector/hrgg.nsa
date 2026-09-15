import { ChevronLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

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

function findGroup(
    groups: Group[],
    groupSlug: string,
    categorySlug?: string,
): {
    group: Group;
    parent?: Group;
} | null {
    for (const group of groups) {
        const groupSlugValue = slugify(group.groupName);

        if (
            groupSlugValue === groupSlug &&
            !categorySlug
        ) {
            return {
                group,
            };
        }

        if (group.groups) {
            for (const subgroup of group.groups) {
                const subgroupSlug = slugify(
                    subgroup.groupName,
                );

                if (subgroupSlug !== groupSlug) {
                    continue;
                }

                if (
                    categorySlug &&
                    groupSlugValue !== categorySlug
                ) {
                    continue;
                }

                return {
                    group: subgroup,
                    parent: group,
                };
            }
        }
    }

    return null;
}

function getGroupPath(
    group: Group,
    parent?: Group,
) {
    if (parent) {
        return `/pastoral/${slugify(
            parent.groupName,
        )}/${slugify(group.groupName)}`;
    }

    return `/pastoral/${slugify(
        group.groupName,
    )}`;
}

function getAutomaticGalleryImages(
    group: Group,
) {
    const numberImages = group.numberImages ?? 0;

    return Array.from(
        { length: numberImages },
        (_, index) =>
            `/images/groups/gallery/group-${group.groupId}_${index + 1}.jpg`,
    );
}

function getSpecificGalleryImages(
    group: Group,
) {
    if (
        !group.gallery ||
        group.gallery.length === 0
    ) {
        return [];
    }

    return group.gallery.map((image) => {
        if (
            image.startsWith("/") ||
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `/images/groups/gallery/${image}`;
    });
}

function getGalleryImages(group: Group) {
    const automaticImages =
        getAutomaticGalleryImages(group);

    const specificImages =
        getSpecificGalleryImages(group);

    return [
        ...automaticImages,
        ...specificImages,
    ];
}

function GroupImage({
    group,
    className = "",
}: {
    group: Group;
    className?: string;
}) {
    if (!group.image) {
        return (
            <div
                className={`pastoral-group-image-placeholder ${className}`}
            >
                <span>{group.groupName}</span>
            </div>
        );
    }

    return (
        <img
            src={`/images/groups/${group.image}`}
            alt={group.groupName}
            className={className}
        />
    );
}

function GroupGallery({
    group,
}: {
    group: Group;
}) {
    const images = getGalleryImages(group);

    if (images.length === 0) {
        return null;
    }

    return (
        <section className="pastoral-gallery">
            <h2 className="pastoral-gallery-title">
                Galería
            </h2>

            <div className="pastoral-gallery-grid">
                {images.map((source, index) => (
                    <div
                        className="pastoral-gallery-item"
                        key={`${source}-${index}`}
                    >
                        <img
                            src={source}
                            alt={`${group.groupName} ${index + 1
                                }`}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function SubGroups({
    group,
}: {
    group: Group;
}) {
    if (
        !group.groups ||
        group.groups.length === 0
    ) {
        return null;
    }

    return (
        <section className="pastoral-subgroups-section">
            <div className="pastoral-subgroups-header">
                <span className="pastoral-group-eyebrow">
                    {group.groupName}
                </span>

                <h2 className="pastoral-subgroups-title">
                    Grupos que forman parte
                </h2>
            </div>

            <div className="pastoral-detail-subgroups">
                {group.groups.map((subgroup) => (
                    <Link
                        key={String(subgroup.groupId)}
                        to={getGroupPath(
                            subgroup,
                            group,
                        )}
                        className="pastoral-detail-subgroup"
                    >
                        <div className="pastoral-detail-subgroup-image">
                            {subgroup.image ? (
                                <img
                                    src={`/images/groups/${subgroup.image}`}
                                    alt={subgroup.groupName}
                                />
                            ) : (
                                <div className="pastoral-detail-subgroup-placeholder">
                                    <span>
                                        {subgroup.groupName}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pastoral-detail-subgroup-content">
                            <h3>
                                {subgroup.groupName}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function PastoralGroupPage() {
    const {
        categorySlug,
        groupSlug,
    } = useParams<{
        categorySlug?: string;
        groupSlug?: string;
    }>();

    const groups = getGroups();

    const currentSlug =
        groupSlug ?? categorySlug ?? "";

    const result = findGroup(
        groups,
        currentSlug,
        groupSlug
            ? categorySlug
            : undefined,
    );

    if (!result) {
        return (
            <section className="pastoral-group-page">
                <div className="pastoral-group-container">
                    <Link
                        to="/#pastoral"
                        className="pastoral-group-back"
                    >
                        <ChevronLeft size={18} />
                        Volver a Pastoral
                    </Link>

                    <div className="pastoral-group-not-found">
                        <h1>Grupo no encontrado</h1>

                        <p>
                            No encontramos la información
                            del grupo solicitado.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const {
        group,
        parent,
    } = result;

    return (
        <section className="pastoral-group-page">
            <div className="pastoral-group-container">
                <Link
                    to="/#pastoral"
                    className="pastoral-group-back"
                >
                    <ChevronLeft size={18} />
                    Volver a Pastoral
                </Link>

                <header className="pastoral-group-header">
                    <div className="pastoral-group-image">
                        <GroupImage
                            group={group}
                            className="pastoral-group-main-image"
                        />
                    </div>

                    <div className="pastoral-group-info">
                        <span className="pastoral-group-eyebrow">
                            {parent?.groupName ??
                                "Pastoral"}
                        </span>

                        <h1 className="pastoral-group-title">
                            {group.groupName}
                        </h1>

                        {group.coordinator && (
                            <p className="pastoral-group-coordinator">
                                <strong>
                                    Coordinador:
                                </strong>{" "}
                                {group.coordinator}
                            </p>
                        )}

                        {group.description && (
                            <p className="pastoral-group-description">
                                {group.description}
                            </p>
                        )}

                        {group.choirPlaylist && (
                            <div className="pastoral-playlist">
                                <a
                                    href={group.choirPlaylist}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Escuchar repertorio
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        )}
                    </div>
                </header>

                {group.message && (
                    <div
                        className="group-message"
                        dangerouslySetInnerHTML={{
                            __html: group.message,
                        }}
                    />
                )}

                <SubGroups group={group} />

                <GroupGallery group={group} />
            </div>
        </section>
    );
}
