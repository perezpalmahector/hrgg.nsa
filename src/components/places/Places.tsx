import { MapPin, Navigation, X } from "lucide-react";
import { useState } from "react";

import { parishData } from "@/services/parishData";

import "./places.css";

type Place = {
    placeId?: number;
    placeName: string;
    image?: string;
    description?: string;
    address?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
};

export function Places() {
    const places = parishData.places as Place[];

    const [selectedPlace, setSelectedPlace] =
        useState<Place | null>(null);

    const getMapUrl = (place: Place) => {
        if (place.latitude && place.longitude) {
            return `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
        }

        const query = [
            place.placeName,
            place.address,
            "Mineral de la Reforma, Hidalgo",
        ]
            .filter(Boolean)
            .join(", ");

        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            query
        )}`;
    };

    return (
        <>
            <section className="places-section" id="lugares">
                <div className="places-container">
                    <header className="places-header">
                        <span className="places-eyebrow">
                            Nuestra comunidad
                        </span>

                        <h2 className="places-title">
                            Lugares
                        </h2>

                        <p className="places-subtitle">
                            Conoce los templos, capillas y espacios que forman
                            parte de nuestra comunidad parroquial.
                        </p>
                    </header>

                    <div className="places-grid">
                        {places.map((place, index) => (
                            <article
                                key={place.placeId ?? index}
                                className="place-card"
                            >
                                <div className="place-card-image-wrapper">
                                    {place.image ? (
                                        <img
                                            src={`/images/places/${place.image}`}
                                            alt={place.placeName}
                                            className="place-card-image"
                                        />
                                    ) : (
                                        <div className="place-card-image-placeholder">
                                            <MapPin size={42} />
                                        </div>
                                    )}
                                </div>

                                <div className="place-card-content">
                                    <h3 className="place-card-title">
                                        {place.placeName}
                                    </h3>

                                    {place.address && (
                                        <div className="place-card-address">
                                            <MapPin size={17} />
                                            <span>{place.address}</span>
                                        </div>
                                    )}

                                    {place.description && (
                                        <p className="place-card-description">
                                            {place.description}
                                        </p>
                                    )}

                                    <div className="place-card-actions">
                                        <button
                                            type="button"
                                            className="place-details-button"
                                            onClick={() =>
                                                setSelectedPlace(place)
                                            }
                                        >
                                            Ver información
                                        </button>

                                        <a
                                            href={getMapUrl(place)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="place-map-button"
                                        >
                                            <Navigation size={17} />
                                            Cómo llegar
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {selectedPlace && (
                <div
                    className="place-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Información de ${selectedPlace.placeName}`}
                    onClick={() => setSelectedPlace(null)}
                >
                    <div
                        className="place-modal-content"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="place-modal-close"
                            onClick={() =>
                                setSelectedPlace(null)
                            }
                            aria-label="Cerrar"
                        >
                            <X size={23} />
                        </button>

                        {selectedPlace.image && (
                            <img
                                src={`/images/places/${selectedPlace.image}`}
                                alt={selectedPlace.placeName}
                                className="place-modal-image"
                            />
                        )}

                        <div className="place-modal-body">
                            <span className="place-modal-eyebrow">
                                Lugar parroquial
                            </span>

                            <h3>{selectedPlace.placeName}</h3>

                            {selectedPlace.address && (
                                <div className="place-modal-address">
                                    <MapPin size={18} />
                                    <span>{selectedPlace.address}</span>
                                </div>
                            )}

                            {selectedPlace.description && (
                                <p>{selectedPlace.description}</p>
                            )}

                            <a
                                href={getMapUrl(selectedPlace)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="place-modal-map-button"
                            >
                                <Navigation size={18} />
                                Abrir en Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Places;