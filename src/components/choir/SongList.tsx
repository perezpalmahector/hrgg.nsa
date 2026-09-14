import {
    BookOpen,
    Music2,
} from "lucide-react";

type SongAuthor = {
    name: string;
};

export type Song = {
    id: number;
    slug: string;
    name: string;
    tonality?: string;
    authors?: SongAuthor[];
};

type SongListProps = {
    songs: Song[];
    selectedSongId?: number | null;
    selectedMode?: "lyrics" | "full";
    onSelectSong?: (
        song: Song,
        mode: "lyrics" | "full"
    ) => void;
};

export function SongList({
    songs,
    selectedSongId,
    selectedMode,
    onSelectSong,
}: SongListProps) {
    if (!songs.length) {
        return (
            <div className="choir-songs-empty">
                <Music2
                    size={28}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />

                <p>
                    No hay cantos registrados para este esquema.
                </p>
            </div>
        );
    }

    return (
        <section className="choir-song-list-section">
            <div className="choir-song-list-header">
                <div>
                    <span className="choir-song-list-eyebrow">
                        Repertorio
                    </span>

                    <h2 className="choir-song-list-title">
                        Cantos del esquema
                    </h2>
                </div>

                <span className="choir-song-list-count">
                    {songs.length}{" "}
                    {songs.length === 1
                        ? "canto"
                        : "cantos"}
                </span>
            </div>

            <div className="choir-song-list">
                {songs.map((song, index) => {
                    const isSelected =
                        selectedSongId === song.id;

                    return (
                        <div
                            key={`${song.id}-${song.slug}`}
                            className={`choir-song-card ${isSelected
                                    ? "is-selected"
                                    : ""
                                }`}
                        >
                            <button
                                type="button"
                                className="choir-song-card-main"
                                onClick={() =>
                                    onSelectSong?.(
                                        song,
                                        "lyrics"
                                    )
                                }
                            >
                                <span className="choir-song-number">
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <span className="choir-song-card-content">
                                    <strong>
                                        {song.name}
                                    </strong>

                                    {song.authors &&
                                        song.authors.length >
                                        0 && (
                                            <span>
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
                                            </span>
                                        )}
                                </span>
                            </button>

                            <div className="choir-song-actions">
                                <button
                                    type="button"
                                    className={`choir-song-action ${isSelected &&
                                            selectedMode ===
                                            "lyrics"
                                            ? "is-active"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        onSelectSong?.(
                                            song,
                                            "lyrics"
                                        )
                                    }
                                    aria-label={`Ver letra de ${song.name}`}
                                    title="Ver letra"
                                >
                                    <BookOpen
                                        size={19}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>

                                <button
                                    type="button"
                                    className={`choir-song-action ${isSelected &&
                                            selectedMode ===
                                            "full"
                                            ? "is-active"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        onSelectSong?.(
                                            song,
                                            "full"
                                        )
                                    }
                                    aria-label={`Ver detalle completo de ${song.name}`}
                                    title="Detalle completo"
                                >
                                    <Music2
                                        size={19}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default SongList;