import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { parishData } from "../../services/parishData";

type ScheduleGroup = {
  days: string[];
  placeId: number;
  startHour: string;
  endHour?: string;
};

function getServiceEmoji(serviceName: string) {
  const name = serviceName.toLowerCase();

  if (name.includes("misa")) return "✝️";
  if (name.includes("confesion")) return "🤍";
  if (name.includes("hora santa")) return "🕯️";
  if (name.includes("bautismo")) return "💧";
  if (name.includes("trámite") || name.includes("oficina")) return "📋";

  return "⛪";
}

function getServiceDescription(serviceName: string) {
  const name = serviceName.toLowerCase();

  if (name.includes("misa")) {
    return "Celebraciones de la Eucaristía";
  }

  if (name.includes("confesion")) {
    return "Sacramento de la Reconciliación";
  }

  if (name.includes("hora santa")) {
    return "Adoración y oración ante el Santísimo";
  }

  if (name.includes("bautismo")) {
    return "Celebración comunitaria del Bautismo";
  }

  if (name.includes("trámite") || name.includes("oficina")) {
    return "Atención de trámites parroquiales";
  }

  return "Servicio de nuestra parroquia";
}

function groupSchedules(
  placeHours: typeof parishData.services[number]["placeHours"]
) {
  const groups: ScheduleGroup[] = [];

  let currentDay = "";

  for (const hour of placeHours) {
    const dayName = hour.dayName?.trim();

    // Si el registro tiene día, lo guardamos.
    if (dayName) {
      currentDay = dayName;
    }

    // Los registros sin día heredan el día anterior.
    const day = currentDay || "Todos los días";

    const existing = groups.find(
      (group) =>
        group.placeId === hour.placeId &&
        group.startHour === hour.startHour &&
        group.endHour === hour.endHour
    );

    if (existing) {
      if (!existing.days.includes(day)) {
        existing.days.push(day);
      }
    } else {
      groups.push({
        days: [day],
        placeId: hour.placeId,
        startHour: hour.startHour,
        endHour: hour.endHour,
      });
    }
  }

  return groups;
}

function formatDays(days: string[]) {
  return days.join(" · ");
}

export default function Services() {
  /*
   * Misas se abre por defecto.
   *
   * Se busca por nombre y no por posición dentro del JSON,
   * para que siga funcionando aunque cambie el orden de los servicios.
   */
  const misaService = parishData.services.find((service) =>
    service.serviceName.toLowerCase().includes("misa")
  );

  const [openService, setOpenService] = useState<number | null>(
    misaService?.serviceId ?? null
  );

  function toggleService(serviceId: number) {
    setOpenService((current) =>
      current === serviceId ? null : serviceId
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =========================================================
          CONTENIDO PRINCIPAL
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        {/* =======================================================
            TÍTULO
        ======================================================= */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Servicios parroquiales
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Consulta los horarios de las celebraciones, sacramentos
            y servicios de nuestra parroquia y sus capillas.
          </p>

        </div>


        {/* =======================================================
            TARJETAS DE SERVICIOS
        ======================================================= */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">

          {parishData.services.map((service) => {

            const isOpen =
              openService === service.serviceId;

            const emoji =
              getServiceEmoji(service.serviceName);

            const description =
              getServiceDescription(service.serviceName);

            const schedules =
              groupSchedules(service.placeHours);

            const isConfession =
              service.serviceName
                .toLowerCase()
                .includes("confesion");

            return (
              <article
                key={service.serviceId}
                className={`min-w-0 overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-[#00a8c6]/40 shadow-md lg:col-span-3"
                    : "border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-[#00a8c6]/30 hover:shadow-md"
                }`}
              >

                {/* =================================================
                    CABECERA DE LA CARD
                ================================================= */}
                <button
                  type="button"
                  onClick={() =>
                    toggleService(service.serviceId)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full min-w-0 items-center gap-3 p-4 text-left sm:gap-4 sm:p-6"
                >

                  {/* ICONO */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition sm:h-14 sm:w-14 sm:text-2xl ${
                      isOpen
                        ? "bg-[#00a8c6] text-white"
                        : "bg-[#00a8c6]/10"
                    }`}
                  >
                    {emoji}
                  </div>


                  {/* INFORMACIÓN DEL SERVICIO */}
                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00a8c6] sm:text-[11px] sm:tracking-[0.15em]">
                      Servicio parroquial
                    </p>

                    <h2 className="mt-1 break-words text-base font-bold text-slate-900 sm:text-xl">
                      {service.serviceName}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      {description}
                    </p>

                  </div>


                  {/* FLECHA */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
                      isOpen
                        ? "bg-[#00a8c6]/10 text-[#00a8c6]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                </button>


                {/* =================================================
                    CONTENIDO DESPLEGABLE
                ================================================= */}
                {isOpen && (
                  <div className="border-t border-slate-100">

                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-7">

                      <div className="grid gap-x-10 lg:grid-cols-2">

                        {schedules.map(
                          (schedule, index) => {

                            const place =
                              parishData.places.find(
                                (item) =>
                                  item.placeId ===
                                  schedule.placeId
                              );

                            return (
                              <div
                                key={`${service.serviceId}-${index}`}
                                className="flex min-w-0 flex-col gap-1.5 border-b border-slate-100 py-4 sm:gap-2 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-5"
                              >

                                {/* =================================================
                                    DÍA Y LUGAR
                                ================================================= */}
                                <div className="min-w-0">

                                  <p className="break-words text-sm font-semibold leading-5 text-slate-800">
                                    {formatDays(
                                      schedule.days
                                    )}
                                  </p>

                                  <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                                    {place?.placeName ??
                                      "Lugar no especificado"}
                                  </p>

                                </div>


                                {/* =================================================
                                    HORARIO
                                ================================================= */}
                                <p className="text-sm font-semibold leading-5 text-slate-900 sm:text-base lg:whitespace-nowrap">
                                  {schedule.startHour}

                                  {schedule.endHour && (
                                    <>
                                      {" "}
                                      –{" "}
                                      {schedule.endHour}
                                    </>
                                  )}
                                </p>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>


                    {/* =================================================
                        GUÍA DE CONFESIÓN
                    ================================================= */}
                    {isConfession && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-5 sm:px-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          {/* TEXTO */}
                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-slate-800">
                              ¿Quieres prepararte para la Confesión?
                            </p>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              Consulta nuestra guía para prepararte
                              y realizar una buena Confesión.
                            </p>

                          </div>


                          {/* BOTÓN */}
                          <Link
                            to="/services/guide-confession"
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00a8c6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008da5] sm:w-auto"
                          >
                            Guía para la Confesión

                            <span aria-hidden="true">
                              →
                            </span>
                          </Link>

                        </div>

                      </div>
                    )}

                  </div>
                )}

              </article>
            );
          })}

        </div>


        {/* =========================================================
            NOTA
        ========================================================= */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center sm:mt-10">

          <p className="text-xs leading-5 text-slate-500 sm:text-sm">
            Los horarios pueden estar sujetos a cambios por
            celebraciones o actividades parroquiales.
          </p>

        </div>

      </section>

    </main>
  );
}