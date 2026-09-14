import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import "./gallery.css";

const galleryImages = [
    {
        src: "/images/gallery/carrousel1.png",
        title: "Nuestra Señora de los Ángeles",
    },
    {
        src: "/images/gallery/carrousel2.png",
        title: "Nuestra Señora de Guadalupe",
    },
    {
        src: "/images/gallery/carrousel3.png",
        title: "Mural principal del templo parroquial",
    },
    {
        src: "/images/gallery/carrousel4.png",
        title: "Fallada Principal de la Parroquia",
    },
    {
        src: "/images/gallery/carrousel5.png",
        title: "Cristo crucificado",
    },
    {
        src: "/images/gallery/carrousel6.png",
        title: "Nuestra Señora de Fátima"
    },
    {
        src: "/images/gallery/carrousel7.png",
        title: "Nuestra Señora del Carmen"
    },
    {
        src: "/images/gallery/carrousel8.png",
        title: "Santos Óleos",
    },
    {
        src: "/images/gallery/carrousel9.png",
        title: "Interior de la Parroquia",
    },
    {
        src: "/images/gallery/carrousel10.png",
        title: "Bautisterio",
    },
    {
        src: "/images/gallery/carrousel11.png",
        title: "Cristo crucificado, la Virgen Dolorosa y San Juan Evangelista",
    },
    {
        src: "/images/gallery/carrousel12.png",
        title: "Santa Maria en la advocacion de la Inmaculada Concepcion",
    },
    {
        src: "/images/gallery/carrousel13.png",
        title: "La Santisima Trinidad",
    },
    {
        src: "/images/gallery/carrousel14.png",
        title: "San Antonio de Padua",
    },
];

export function Gallery() {
    const [current, setCurrent] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const nextImage = () => {
        setCurrent((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

    const previousImage = () => {
        setCurrent((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    const image = galleryImages[current];

    return (
        <>
            <section className="gallery-section" id="galeria">
                <div className="gallery-container">
                    <header className="gallery-header">
                        <span className="gallery-eyebrow">
                            Nuestra comunidad
                        </span>

                        <h2 className="gallery-title">
                            Galería
                        </h2>

                        <p className="gallery-subtitle">
                            Conoce algunos de los espacios, imágenes y momentos
                            que forman parte de nuestra comunidad parroquial.
                        </p>
                    </header>

                    <div className="gallery-main">
                        <button
                            type="button"
                            className="gallery-arrow gallery-arrow-left"
                            onClick={previousImage}
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft size={28} />
                        </button>

                        <button
                            type="button"
                            className="gallery-image-button"
                            onClick={() => setLightboxOpen(true)}
                            aria-label={`Ver ${image.title}`}
                        >
                            <div className="gallery-image-wrapper">
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="gallery-main-image"
                                />

                                <div className="gallery-image-overlay">
                                    <span>Ver imagen</span>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="gallery-arrow gallery-arrow-right"
                            onClick={nextImage}
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    <div className="gallery-caption">
                        <h3>{image.title}</h3>

                        <span>
                            {current + 1} / {galleryImages.length}
                        </span>
                    </div>

                    <div className="gallery-dots">
                        {galleryImages.map((item, index) => (
                            <button
                                key={item.src}
                                type="button"
                                className={`gallery-dot ${current === index
                                    ? "gallery-dot-active"
                                    : ""
                                    }`}
                                onClick={() => setCurrent(index)}
                                aria-label={`Ver imagen ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className="gallery-thumbnails">
                        {galleryImages.map((item, index) => (
                            <button
                                key={item.src}
                                type="button"
                                className={`gallery-thumbnail ${current === index
                                    ? "gallery-thumbnail-active"
                                    : ""
                                    }`}
                                onClick={() => setCurrent(index)}
                                aria-label={`Seleccionar ${item.title}`}
                            >
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="gallery-thumbnail-image"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {lightboxOpen && (
                <div
                    className="gallery-lightbox"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        className="gallery-lightbox-close"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Cerrar galería"
                    >
                        <X size={28} />
                    </button>

                    <button
                        type="button"
                        className="gallery-lightbox-arrow gallery-lightbox-left"
                        onClick={(event) => {
                            event.stopPropagation();
                            previousImage();
                        }}
                        aria-label="Imagen anterior"
                    >
                        <ChevronLeft size={34} />
                    </button>

                    <div
                        className="gallery-lightbox-content"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={image.src}
                            alt={image.title}
                            className="gallery-lightbox-img"
                        />

                        <div className="gallery-lightbox-info">
                            <h3>{image.title}</h3>

                            <span>
                                {current + 1} / {galleryImages.length}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="gallery-lightbox-arrow gallery-lightbox-right"
                        onClick={(event) => {
                            event.stopPropagation();
                            nextImage();
                        }}
                        aria-label="Imagen siguiente"
                    >
                        <ChevronRight size={34} />
                    </button>
                </div>
            )}
        </>
    );
}

export default Gallery;