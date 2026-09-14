import { Clock3, MapPin, Music2 } from "lucide-react";

type Choir = {
    choirId: number;
    choirName: string;
    choirImage?: string;
    choirDescription?: string;
    choirPlaylist?: string;
};

type ChoirHeaderProps = {
    choir?: Choir | null;
    dayName?: string;
    startHour?: string;
    endHour?: string;
    placeName?: string;
    celebrationName?: string;
};

export function ChoirHeader({
    choir,
    dayName,
    startHour,
    endHour,
    placeName,
    celebrationName,
}: ChoirHeaderProps) {
    return (
        <header className="choir-header">
            <div className="choir-header-main">
                <div className="choir-header-image-wrap">
                    {choir?.choirImage ? (
                        <img
                            src={`/images/groups/${choir.choirImage}`}
                            alt={choir.choirName}
                            className="choir-header-image"
                        />
                    ) : (
                        <div className="choir-header-image-placeholder">
                            <Music2
                                size={48}
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>

                <div className="choir-header-info">
                    <span className="choir-header-eyebrow">
                        Cantos de la celebración
                    </span>

                    <h1 className="choir-header-title">
                        {choir?.choirName ?? "Coro parroquial"}
                    </h1>

                    {choir?.choirDescription && (
                        <p className="choir-header-description">
                            {choir.choirDescription}
                        </p>
                    )}

                    <div className="choir-header-schedule">
                        {dayName && (
                            <div className="choir-header-schedule-item">
                                <Clock3
                                    size={18}
                                    aria-hidden="true"
                                />

                                <span>
                                    <strong>{dayName}</strong>

                                    {startHour && (
                                        <>
                                            {" · "}
                                            {startHour}
                                        </>
                                    )}

                                    {endHour && (
                                        <>
                                            {" - "}
                                            {endHour}
                                        </>
                                    )}
                                </span>
                            </div>
                        )}

                        {placeName && (
                            <div className="choir-header-schedule-item">
                                <MapPin
                                    size={18}
                                    aria-hidden="true"
                                />

                                <span>{placeName}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="choir-header-message">
                <p>
                    ¡Querida comunidad parroquial! Compartimos con ustedes
                    los cantos que estaremos entonando en la próxima
                    celebración. Que estas melodías los ayuden a orar,
                    meditar y alabar al Señor con el corazón. ¡Los invitamos
                    a cantar con nosotros!
                </p>
            </div>

            <div className="choir-header-quote">
                <Music2
                    size={20}
                    aria-hidden="true"
                />

                <blockquote>
                    “Canten al Señor un cántico nuevo…”
                    <cite>— Salmo 96:1</cite>
                </blockquote>
            </div>

            {celebrationName && (
                <div className="choir-header-celebration">
                    <span>Información de la celebración</span>
                    <strong>{celebrationName}</strong>
                </div>
            )}
        </header>
    );
}

export default ChoirHeader;