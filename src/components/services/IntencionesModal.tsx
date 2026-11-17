import { useState, useEffect } from "react";
import { X, CheckCircle2, Clock, MapPin } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { detectActiveMisaPlace } from "@/utils/misaScheduleValidator";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function IntencionesModal({ isOpen, onClose }: Props) {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("Difunto");
    const [folio, setFolio] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const [abiertoPorAdmin, setAbiertoPorAdmin] = useState<boolean>(true);
    const [modoPrueba, setModoPrueba] = useState<boolean>(false);
    const [misaActiva, setMisaActiva] = useState<{
        disponible: boolean;
        placeId: number | null;
        placeName: string;
        horaMisa: string;
        horariosHoy: string[];
    }>({
        disponible: false,
        placeId: null,
        placeName: "",
        horaMisa: "",
        horariosHoy: [],
    });

    useEffect(() => {
        if (!isOpen) return;

        setFolio(null);

        // 1. Leer configuración actual de Supabase (recepción abierta y modo prueba)
        supabase
            .from("configuracion_misa")
            .select("recepcion_abierta, modo_prueba")
            .eq("id", 1)
            .single()
            .then(({ data }) => {
                const abierta = data ? data.recepcion_abierta : true;
                const prueba = data ? data.modo_prueba : false;

                setAbiertoPorAdmin(abierta);
                setModoPrueba(prueba);
                setMisaActiva(detectActiveMisaPlace(prueba));
            });

        // 2. Escuchar cambios en tiempo real desde el panel admin
        const canal = supabase
            .channel("config-misa-modal")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "configuracion_misa" },
                (payload) => {
                    const abierta = payload.new.recepcion_abierta;
                    const prueba = payload.new.modo_prueba;

                    setAbiertoPorAdmin(abierta);
                    setModoPrueba(prueba);
                    setMisaActiva(detectActiveMisaPlace(prueba));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(canal);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const registroHabilitado = misaActiva.disponible && abiertoPorAdmin;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !registroHabilitado) return;
        setLoading(true);

        const { data, error } = await supabase
            .from("intenciones_misa")
            .insert([
                {
                    nombre: nombre.trim(),
                    tipo,
                    lugar: misaActiva.placeName,
                    status: "pendiente",
                },
            ])
            .select("id")
            .single();

        setLoading(false);
        if (!error && data) {
            setFolio(data.id);
            setNombre("");
        }
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#00a8c6]">
                            Misas Comunitarias
                        </p>
                        <h3 className="text-lg font-bold text-slate-900">
                            Registrar Intención
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {!registroHabilitado ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Clock size={18} className="shrink-0 text-amber-600" />
                                <span>
                                    {!abiertoPorAdmin
                                        ? "Recepción cerrada por sacristía"
                                        : "Registro cerrado en este momento"}
                                </span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-amber-800">
                                {!abiertoPorAdmin
                                    ? "El registro de intenciones para esta celebración ya fue cerrado. Si necesitas anotar algo urgente, acércate directamente con el encargado."
                                    : "Las intenciones en línea se reciben desde 30 minutos antes y hasta iniciar la celebración."}
                            </p>
                            <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs">
                                <span className="font-semibold">Celebraciones de hoy: </span>
                                {misaActiva.horariosHoy.length > 0
                                    ? misaActiva.horariosHoy.join(" · ")
                                    : "Sin misas programadas hoy"}
                            </div>
                        </div>
                    ) : folio ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                            <CheckCircle2 className="mx-auto mb-2 text-emerald-600" size={32} />
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                Tu número de folio
                            </p>
                            <p className="my-1 text-4xl font-extrabold text-slate-900">
                                #{folio}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-slate-600">
                                Acércate con el encargado en la entrada de{" "}
                                <strong>{misaActiva.placeName}</strong> con este folio y tu{" "}
                                <strong>cooperación voluntaria</strong> para confirmar tu intención.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Lugar detectado automáticamente */}
                            <div className="flex items-center justify-between rounded-xl border border-[#00a8c6]/25 bg-[#00a8c6]/5 px-3.5 py-2.5 text-xs text-slate-700">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="shrink-0 text-[#00a8c6]" />
                                    <div>
                                        <span className="font-semibold text-slate-900">
                                            {misaActiva.placeName}
                                        </span>
                                        <span className="ml-1.5 text-slate-500">
                                            · Misa {misaActiva.horaMisa}
                                        </span>
                                    </div>
                                </div>
                                {modoPrueba && (
                                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
                                        Prueba
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Motivo de la intención
                                </label>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-[#00a8c6] focus:bg-white focus:outline-none"
                                >
                                    <option value="Difunto">Por un Difunto</option>
                                    <option value="Salud">Por la Salud</option>
                                    <option value="Acción de Gracias">
                                        Acción de Gracias / Cumpleaños
                                    </option>
                                    <option value="Aniversario">Aniversario</option>
                                </select>
                            </div>

                            <div>
                                <div className="mb-1.5 flex justify-between text-xs">
                                    <label className="font-semibold uppercase tracking-wider text-slate-600">
                                        Nombre(s) claro(s)
                                    </label>
                                    <span className="text-slate-400">{nombre.length}/65</span>
                                </div>
                                <input
                                    type="text"
                                    maxLength={65}
                                    required
                                    placeholder="Ej. Juan Pérez Hernández"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-[#00a8c6] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-[#00a8c6] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#008da5] disabled:opacity-50"
                            >
                                {loading ? "Generando folio..." : "Obtener Folio de Intención"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
