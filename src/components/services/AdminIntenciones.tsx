import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import {
    Check,
    Plus,
    BookOpen,
    ArrowLeft,
    LogOut,
    Trash2,
    Search,
    Lock,
    Unlock,
    FlaskConical,
} from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { parishData } from "@/services/parishData";

interface Intencion {
    id: number;
    nombre: string;
    tipo: string;
    lugar: string;
    status: "pendiente" | "aprobada";
    created_at: string;
}

export default function AdminIntenciones() {
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    const [intenciones, setIntenciones] = useState<Intencion[]>([]);
    const [recepcionAbierta, setRecepcionAbierta] = useState<boolean>(true);
    const [modoPrueba, setModoPrueba] = useState<boolean>(false);
    const [busquedaFolio, setBusquedaFolio] = useState("");
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevoTipo, setNuevoTipo] = useState("Difunto");
    const [nuevoLugar, setNuevoLugar] = useState(
        parishData.places?.at(0)?.placeName || "Parroquia"
    );
    const [vistaPadre, setVistaPadre] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) =>
            setSession(sess)
        );
        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session) return;
        cargarIntenciones();

        const canal = supabase
            .channel("intenciones-misa-admin")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "intenciones_misa" },
                () => cargarIntenciones()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(canal);
        };
    }, [session]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setAuthError("");
        setAuthLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setAuthLoading(false);
        if (error) setAuthError("Correo o contraseña incorrectos.");
    }

    async function cargarIntenciones() {
        const dosHorasAtras = new Date(
            Date.now() - 2 * 60 * 60 * 1000
        ).toISOString();
        await supabase
            .from("intenciones_misa")
            .delete()
            .lt("created_at", dosHorasAtras);

        const { data } = await supabase
            .from("intenciones_misa")
            .select("*")
            .order("id", { ascending: true });

        if (data) setIntenciones(data as Intencion[]);

        const { data: config } = await supabase
            .from("configuracion_misa")
            .select("recepcion_abierta, modo_prueba")
            .eq("id", 1)
            .single();

        if (config) {
            setRecepcionAbierta(config.recepcion_abierta);
            setModoPrueba(config.modo_prueba);
        }
    }

    async function toggleRecepcion() {
        const nuevoEstado = !recepcionAbierta;
        setRecepcionAbierta(nuevoEstado);
        await supabase
            .from("configuracion_misa")
            .update({
                recepcion_abierta: nuevoEstado,
                updated_at: new Date().toISOString(),
            })
            .eq("id", 1);
    }

    async function toggleModoPrueba() {
        const nuevoModo = !modoPrueba;
        setModoPrueba(nuevoModo);
        await supabase
            .from("configuracion_misa")
            .update({
                modo_prueba: nuevoModo,
                updated_at: new Date().toISOString(),
            })
            .eq("id", 1);
    }

    async function aprobarIntencion(id: number) {
        await supabase
            .from("intenciones_misa")
            .update({ status: "aprobada" })
            .eq("id", id);
    }

    async function eliminarIntencion(id: number) {
        await supabase.from("intenciones_misa").delete().eq("id", id);
    }

    async function agregarDirecto(e: React.FormEvent) {
        e.preventDefault();
        if (!nuevoNombre.trim()) return;
        await supabase.from("intenciones_misa").insert([
            {
                nombre: nuevoNombre.trim(),
                tipo: nuevoTipo,
                lugar: nuevoLugar,
                status: "aprobada",
            },
        ]);
        setNuevoNombre("");
    }
    if (!session) {
        return (
            <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#00a8c6]">
                        Administración Parroquial
                    </p>
                    <h1 className="mt-1 text-xl font-bold text-slate-900">
                        Acceso a Intenciones
                    </h1>
                    <p className="mt-1 mb-5 text-sm text-slate-500">
                        Inicia sesión para recibir y validar intenciones de misa.
                    </p>

                    {authError && (
                        <p className="mb-3 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                            {authError}
                        </p>
                    )}

                    <div className="space-y-3">
                        <input
                            type="email"
                            required
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-[#00a8c6] focus:bg-white focus:outline-none"
                        />
                        <input
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-[#00a8c6] focus:bg-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full rounded-xl bg-[#00a8c6] py-2.5 text-sm font-semibold text-white transition hover:bg-[#008da5] disabled:opacity-50"
                        >
                            {authLoading ? "Verificando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </main>
        );
    }

    const pendientes = intenciones
        .filter((i) => i.status === "pendiente")
        .filter((i) =>
            busquedaFolio.trim()
                ? i.id.toString().includes(busquedaFolio.trim()) ||
                i.nombre.toLowerCase().includes(busquedaFolio.toLowerCase())
                : true
        );

    const aprobadas = intenciones.filter((i) => i.status === "aprobada");

    return (
        <main className="min-h-[75vh] bg-slate-50 py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#00a8c6]">
                            Panel de Sacristía
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Intenciones de Misa
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleModoPrueba}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${modoPrueba
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <FlaskConical size={15} />
                            {modoPrueba ? "Modo Prueba: ON" : "Modo Prueba: OFF"}
                        </button>

                        <button
                            type="button"
                            onClick={toggleRecepcion}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${recepcionAbierta
                                    ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                        >
                            {recepcionAbierta ? (
                                <>
                                    <Lock size={15} /> Cerrar registro
                                </>
                            ) : (
                                <>
                                    <Unlock size={15} /> Reabrir registro
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setVistaPadre(!vistaPadre)}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:text-sm"
                        >
                            {vistaPadre ? (
                                <>
                                    <ArrowLeft size={16} /> Volver a Recepción
                                </>
                            ) : (
                                <>
                                    <BookOpen size={16} /> Lectura Sacerdote ({aprobadas.length})
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => supabase.auth.signOut()}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100"
                            title="Cerrar sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {vistaPadre ? (
                    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Intenciones Confirmadas para la Celebración
                            </h2>
                            <p className="text-xs text-slate-500">
                                Lista actualizada en tiempo real
                            </p>
                        </div>

                        {["Difunto", "Salud", "Acción de Gracias", "Aniversario"].map(
                            (categoria) => {
                                const items = aprobadas.filter((i) => i.tipo === categoria);
                                if (items.length === 0) return null;

                                return (
                                    <div key={categoria}>
                                        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#00a8c6]">
                                            {categoria}
                                        </h3>
                                        <ul className="space-y-2.5 text-xl font-medium text-slate-900 sm:text-2xl">
                                            {items.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="flex items-center justify-between border-b border-slate-100 pb-2"
                                                >
                                                    <span>• {item.nombre}</span>
                                                    <span className="text-xs font-normal text-slate-400">
                                                        {item.lugar}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            }
                        )}

                        {aprobadas.length === 0 && (
                            <p className="py-8 text-center text-sm text-slate-400">
                                Aún no hay intenciones confirmadas para esta misa.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <form
                            onSubmit={agregarDirecto}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5"
                        >
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                                + Registro directo en entrada (pasa directo a confirmadas)
                            </p>
                            <div className="grid gap-2.5 sm:grid-cols-[150px_180px_1fr_auto]">
                                <select
                                    value={nuevoTipo}
                                    onChange={(e) => setNuevoTipo(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                                >
                                    <option value="Difunto">Difunto</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Acción de Gracias">Acción de Gracias</option>
                                    <option value="Aniversario">Aniversario</option>
                                </select>

                                <select
                                    value={nuevoLugar}
                                    onChange={(e) => setNuevoLugar(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                                >
                                    {parishData.places?.map((p) => (
                                        <option key={p.placeId} value={p.placeName}>
                                            {p.placeName}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    maxLength={65}
                                    required
                                    placeholder="Nombre completo..."
                                    value={nuevoNombre}
                                    onChange={(e) => setNuevoNombre(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#00a8c6] focus:bg-white focus:outline-none"
                                />

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00a8c6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008da5]"
                                >
                                    <Plus size={16} /> Agregar
                                </button>
                            </div>
                        </form>

                        <div>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-base font-bold text-slate-900">
                                    Por confirmar en puerta ({pendientes.length})
                                </h2>

                                <div className="relative w-full sm:w-64">
                                    <Search
                                        size={15}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar por folio o nombre..."
                                        value={busquedaFolio}
                                        onChange={(e) => setBusquedaFolio(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs focus:border-[#00a8c6] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {pendientes.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-lg bg-[#00a8c6]/15 px-2.5 py-0.5 text-xs font-extrabold text-[#008da5]">
                                                    Folio #{item.id}
                                                </span>
                                                <span className="text-xs font-semibold uppercase text-slate-500">
                                                    {item.tipo}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    · {item.lugar}
                                                </span>
                                            </div>
                                            <p className="mt-1 break-words text-base font-bold text-slate-900">
                                                {item.nombre}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => eliminarIntencion(item.id)}
                                                className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                title="Descartar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => aprobarIntencion(item.id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:text-sm"
                                            >
                                                <Check size={16} /> Aceptar
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {pendientes.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
                                        No hay folios pendientes en este momento.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
