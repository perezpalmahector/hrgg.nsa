import "./history.css";

export function History() {
    return (
        <section className="history-section" id="historia">
            <div className="history-container">
                <header className="history-header">
                    <span className="history-eyebrow">
                        Nuestra comunidad
                    </span>

                    <h2 className="history-title">
                        Historia
                    </h2>

                    <p className="history-description">
                        El siguiente video habla acerca de los orígenes de
                        Nuestra Señora de los Ángeles, de nuestra parroquia y
                        de la parroquia de Tulancingo. Te invitamos a conocer
                        nuestra historia.
                    </p>
                </header>

                <div className="history-video-wrapper">
                    <video
                        className="history-video"
                        controls
                        preload="metadata"
                    >
                        <source
                            src="/images/history/historia.mp4"
                            type="video/mp4"
                        />

                        Tu navegador no puede reproducir este video.
                    </video>
                </div>
            </div>
        </section>
    );
}

export default History;