import { useMemo, useState } from "react";

import { parishData } from "@/services/parishData";
import schemasData from "@/data/schemas.json";

import ChoirHeader from "./ChoirHeader";
import SongList from "./SongList";
import SongDetail, {
    type Song,
} from "./SongDetail";

import "./choir-songs.css";

type ChoirConfig = {
    choirId: number;
    slugPlayList?: string;
    exceptions?: {
        validFrom: string;
        validTo: string;
        choirId: number;
        slugPlayList?: string;
    }[];
};

type Schedule = {
    serviceHourId: number;
    placeId: number;
    dayName: string;
    startHour: string;
    endHour?: string;
    choir?: ChoirConfig;
};

type SchemaSong = {
    id: number;
    slug: string;
    name: string;
    authors?: {
        name: string;
    }[];
};

type Schema = {
    playId: number;
    slugPlayList: string;
    name: string;
    songs: SchemaSong[];
};

type Place = {
    placeId: number;
    placeName?: string;
};

function getEffectiveChoirConfig(
    config?: ChoirConfig
): ChoirConfig | undefined {
    if (!config) {
        return undefined;
    }

    const today = new Date()
        .toISOString()
        .slice(0, 10);

    const exception =
        config.exceptions?.find(
            (item) =>
                today >= item.validFrom &&
                today <= item.validTo
        );

    if (!exception) {
        return config;
    }

    return {
        ...config,
        choirId: exception.choirId,
        slugPlayList:
            exception.slugPlayList ??
            config.slugPlayList,
    };
}

export function ChoirSongs() {
    const pathParts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const serviceHourId = Number(
        pathParts[pathParts.length - 1]
    );

    const [selectedSong, setSelectedSong] =
        useState<Song | null>(null);

    const [selectedMode, setSelectedMode] =
        useState<"lyrics" | "full">(
            "lyrics"
        );

    /*
     * Servicios
     */
    const services =
        parishData.services as {
            serviceId: number;
            serviceName: string;
            schedules: Schedule[];
        }[];

    /*
     * Lugares
     */
    const places =
        parishData.places as Place[];

    /*
     * Esquemas / playlists
     */
    const schemas =
        schemasData as Schema[];

    /*
     * Encontrar el servicio y horario
     */
    const serviceData = useMemo(() => {
        for (const service of services) {
            const schedule =
                service.schedules.find(
                    (item) =>
                        item.serviceHourId ===
                        serviceHourId
                );

            if (schedule) {
                return {
                    service,
                    schedule,
                };
            }
        }

        return null;
    }, [
        services,
        serviceHourId,
    ]);

    const schedule =
        serviceData?.schedule;

    /*
     * Coro efectivo según la configuración
     * y sus excepciones de fecha.
     */
    const effectiveChoir =
        getEffectiveChoirConfig(
            schedule?.choir
        );

    /*
     * Buscar el coro
     */
    const choir =
        parishData.choirs.find(
            (item) =>
                item.choirId ===
                effectiveChoir?.choirId
        );

    /*
     * Playlist asociada al horario
     */
    const playlistSlug =
        effectiveChoir?.slugPlayList;

    /*
     * Buscar el esquema correspondiente
     */
    const schema = schemas.find(
        (item) =>
            item.slugPlayList ===
            playlistSlug
    );

    /*
     * Construir la lista completa de cantos
     *
     * Primero respetamos el orden del esquema
     * y después buscamos cada canto en songs.json.
     */
    const songs = useMemo<Song[]>(() => {
        if (!schema?.songs) {
            return [];
        }

        const allSongs =
            parishData.songs as Song[];

        return schema.songs
            .map((schemaSong) => {
                return allSongs.find(
                    (song) =>
                        song.slug ===
                        schemaSong.slug ||
                        song.id ===
                        schemaSong.id
                );
            })
            .filter(
                (
                    song
                ): song is Song =>
                    song !== undefined
            );
    }, [schema]);

    /*
     * Lugar
     */
    const place =
        places.find(
            (item) =>
                item.placeId ===
                schedule?.placeId
        );

    /*
     * Seleccionar canto
     */
    const handleSelectSong = (
        song: Song,
        mode: "lyrics" | "full"
    ) => {
        setSelectedSong(song);
        setSelectedMode(mode);
    };

    /*
     * Navegar entre cantos
     * conservando el modo actual.
     */
    const handleNavigate = (
        song: Song,
        mode: "lyrics" | "full"
    ) => {
        setSelectedSong(song);
        setSelectedMode(mode);
    };

    /*
     * Si no existe el horario
     */
    if (!schedule) {
        return (
            <main className="choir-songs-page">
                <div className="choir-songs-container">
                    <div className="choir-songs-error">
                        <h1>
                            Celebración no encontrada
                        </h1>

                        <p>
                            No se encontró el horario
                            solicitado.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="choir-songs-page">
            <div className="choir-songs-container">

                <ChoirHeader
                    choir={choir}
                    dayName={
                        schedule.dayName
                    }
                    startHour={
                        schedule.startHour
                    }
                    endHour={
                        schedule.endHour
                    }
                    placeName={
                        place?.placeName
                    }
                    celebrationName={
                        schema?.name
                    }
                />

                <div className="choir-songs-content">
                    <SongList
                        songs={songs}
                        selectedSongId={
                            selectedSong?.id
                        }
                        selectedMode={
                            selectedMode
                        }
                        onSelectSong={
                            handleSelectSong
                        }
                    />
                </div>

                {selectedSong && (
                    <SongDetail
                        song={selectedSong}
                        songs={songs}
                        mode={selectedMode}
                        onClose={() =>
                            setSelectedSong(
                                null
                            )
                        }
                        onNavigate={
                            handleNavigate
                        }
                    />
                )}
            </div>
        </main>
    );
}

export default ChoirSongs;
