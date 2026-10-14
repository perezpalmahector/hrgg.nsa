import { useState } from "react";

interface SongSource {
    title: string;
    url: string;
}

interface SongResult {
    ok: boolean;
    songName: string;
    result: string;
    sources?: SongSource[];
}

export default function SongFinder() {
    const [songName, setSongName] = useState("");
    const [result, setResult] = useState<SongResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch() {
        const name = songName.trim();

        if (!name) {
            setError("Escribe el nombre del canto.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                "http://localhost:3001/api/song-search",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        songName: name,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "No se pudo realizar la búsqueda."
                );
            }

            setResult(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al buscar el canto."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">
                {/* ENCABEZADO */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        🎵 Buscador de Cantos
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Busca un canto en Internet y prepara la
                        información para generar posteriormente
                        tu script SQL.
                    </p>
                </div>

                {/* BUSCADOR */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <label
                        htmlFor="songName"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Nombre del canto
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            id="songName"
                            type="text"
                            value={songName}
                            onChange={(event) => {
                                setSongName(event.target.value);
                                setError("");
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Ej. Cristo está conmigo"
                            disabled={loading}
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
                        />

                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={loading}
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "🔎 Buscando..." : "🔎 Buscar"}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                            Buscando información del canto en Internet...
                        </div>
                    )}
                </div>

                {/* RESULTADO */}
                {result && (
                    <div className="mt-8 space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Resultado
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Búsqueda: {result.songName}
                                    </p>
                                </div>
                            </div>

                            <textarea
                                value={result.result}
                                readOnly
                                rows={25}
                                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-950 p-5 font-mono text-sm leading-6 text-green-300 outline-none"
                            />
                        </section>

                        {/* FUENTES */}
                        {result.sources &&
                            result.sources.length > 0 && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-bold text-slate-900">
                                        🔗 Fuentes
                                    </h2>

                                    <div className="space-y-2">
                                        {result.sources.map(
                                            (source, index) => (
                                                <a
                                                    key={`${source.url}-${index}`}
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block rounded-xl border border-slate-200 bg-slate-50 p-4 text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
                                                >
                                                    {source.title ||
                                                        source.url}
                                                </a>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}