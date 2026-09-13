import { Clock3, MapPin, Navigation } from "lucide-react";
import "./contact.css";

export function Contact() {
    const address =
        "Monumentos Coloniales No. 5, Sahop Chacón, Mineral de la Reforma, Hidalgo";

    const mapUrl =
        "https://www.google.com/maps/search/?api=1&query=Parroquia+de+Nuestra+Se%C3%B1ora+de+los+Angeles%2C+Monumentos+Coloniales+5%2C+Sahop+Chac%C3%B3n%2C+Mineral+de+la+Reforma%2C+Hidalgo";

    return (
        <section className="contact-section" id="contacto">
            <div className="contact-container">
                {/* ENCABEZADO */}
                <header className="contact-header">
                    <span className="contact-eyebrow">Nuestra comunidad</span>

                    <h2 className="contact-title">Contacto</h2>

                    <p className="contact-description">
                        Encuentra nuestra parroquia y consulta nuestros horarios de
                        atención.
                    </p>
                </header>

                {/* CONTENIDO */}
                <div className="contact-content">
                    {/* MAPA */}
                    <div className="contact-map-card">
                        <div className="contact-map">
                            <iframe
                                title="Ubicación de la Parroquia de Nuestra Señora de los Ángeles"
                                src="https://www.google.com/maps?q=Parroquia+de+Nuestra+Se%C3%B1ora+de+los+Angeles%2C+Monumentos+Coloniales+5%2C+Sahop+Chac%C3%B3n%2C+Mineral+de+la+Reforma%2C+Hidalgo&output=embed"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="contact-details">
                        {/* UBICACIÓN */}
                        <div className="contact-detail">
                            <div className="contact-detail-icon">
                                <MapPin size={22} strokeWidth={2} />
                            </div>

                            <div className="contact-detail-text">
                                <h3>Ubicación</h3>

                                <p>{address}</p>
                            </div>
                        </div>

                        {/* HORARIO */}
                        <div className="contact-detail">
                            <div className="contact-detail-icon">
                                <Clock3 size={22} strokeWidth={2} />
                            </div>

                            <div className="contact-detail-text">
                                <h3>Horario de atención</h3>

                                <div className="contact-schedule">
                                    <div className="contact-schedule-row">
                                        <strong>Martes – Sábado</strong>

                                        <span>
                                            10:00 a.m. – 2:00 p.m.
                                            <br />
                                            4:00 p.m. – 6:30 p.m.
                                        </span>
                                    </div>

                                    <div className="contact-schedule-row">
                                        <strong>Domingo</strong>

                                        <span>10:30 a.m. – 1:00 p.m.</span>
                                    </div>

                                    <div className="contact-schedule-place">
                                        <MapPin size={16} strokeWidth={2} />
                                        <span>Parroquia</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CÓMO LLEGAR */}
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-directions"
                        >
                            <Navigation size={19} strokeWidth={2} />
                            <span>Cómo llegar</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;