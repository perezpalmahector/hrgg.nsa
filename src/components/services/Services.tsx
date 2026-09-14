import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Music2 } from "lucide-react";

import { parishData } from "../../services/parishData";

import "./services.css";

type ChoirException = {
  validFrom: string;
  validTo: string;
  choirId: number;
  slugPlayList?: string;
};

type ChoirConfig = {
  choirId: number;
  slugPlayList: string;
  exceptions: ChoirException[];
};

type Schedule = {
  serviceHourId: number;
  placeId: number;
  dayName?: string;
  startHour: string;
  endHour?: string;
  choir?: ChoirConfig;
};

type ScheduleGroup = {
  serviceHourIds: number[];
  days: string[];
  placeId: number;
  startHour: string;
  endHour?: string;
  choir?: ChoirConfig;
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

function getServiceImage(serviceName: string) {
  const name = serviceName.toLowerCase();

  if (name.includes("bautismo")) {
    return "/images/services/Bautismo.jpg";
  }

  if (name.includes("confesion")) {
    return "/images/services/Confesion.jpg";
  }

  if (name.includes("hora santa")) {
    return "/images/services/Hora Santa.jpg";
  }

  if (name.includes("misa")) {
    return "/images/services/Misas.jpg";
  }

  if (name.includes("trámite") || name.includes("oficina")) {
    return "/images/services/Tramites.jpg";
  }

  return null;
}

function sameChoirConfig(
  first?: ChoirConfig,
  second?: ChoirConfig
) {
  if (!first && !second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  if (
    first.choirId !== second.choirId ||
    first.slugPlayList !== second.slugPlayList
  ) {
    return false;
  }

  if (first.exceptions.length !== second.exceptions.length) {
    return false;
  }

  return first.exceptions.every((exception, index) => {
    const other = second.exceptions[index];

    return (
      exception.validFrom === other.validFrom &&
      exception.validTo === other.validTo &&
      exception.choirId === other.choirId &&
      exception.slugPlayList === other.slugPlayList
    );
  });
}

/**
 * Agrupa horarios que pertenecen al mismo lugar,
 * misma hora y misma configuración de coro.
 */
function groupSchedules(schedules: Schedule[]) {
  const groups: ScheduleGroup[] = [];

  let currentDay = "";

  for (const schedule of schedules) {
    const dayName = schedule.dayName?.trim();

    if (dayName) {
      currentDay = dayName;
    }

    const day = currentDay || "Todos los días";

    const existing = groups.find(
      (group) =>
        group.placeId === schedule.placeId &&
        group.startHour === schedule.startHour &&
        group.endHour === schedule.endHour &&
        sameChoirConfig(group.choir, schedule.choir)
    );

    if (existing) {
      if (!existing.days.includes(day)) {
        existing.days.push(day);
      }

      existing.serviceHourIds.push(schedule.serviceHourId);
    } else {
      groups.push({
        serviceHourIds: [schedule.serviceHourId],
        days: [day],
        placeId: schedule.placeId,
        startHour: schedule.startHour,
        endHour: schedule.endHour,
        choir: schedule.choir,
      });
    }
  }

  return groups;
}

/**
 * Para las Misas:
 * primero agrupamos por lugar.
 */
function groupMassesByPlace(schedules: Schedule[]) {
  const placeGroups = new Map<number, Schedule[]>();

  for (const schedule of schedules) {
    const existing = placeGroups.get(schedule.placeId);

    if (existing) {
      existing.push(schedule);
    } else {
      placeGroups.set(schedule.placeId, [schedule]);
    }
  }

  return Array.from(placeGroups.entries()).map(
    ([placeId, placeSchedules]) => ({
      placeId,
      schedules: groupSchedules(placeSchedules),
    })
  );
}

function formatDays(days: string[]) {
  return days.join(" · ");
}

export default function Services() {
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
      <section
        id="servicios"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Servicios parroquiales
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Consulta los horarios de las celebraciones, sacramentos
            y servicios de nuestra parroquia y sus capillas.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {parishData.services.map((service) => {
            const isOpen =
              openService === service.serviceId;

            const emoji =
              getServiceEmoji(service.serviceName);

            const description =
              getServiceDescription(service.serviceName);

            const schedules =
              groupSchedules(
                service.schedules as Schedule[]
              );

            const isConfession =
              service.serviceName
                .toLowerCase()
                .includes("confesion");

            const isMass =
              service.serviceName
                .toLowerCase()
                .includes("misa");

            const serviceImage =
              getServiceImage(service.serviceName);

            /**
             * Las Misas se agrupan primero por lugar.
             */
            const massPlaceGroups = isMass
              ? groupMassesByPlace(
                service.schedules as Schedule[]
              )
              : [];

            return (
              <article
                key={service.serviceId}
                className={`min-w-0 overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen
                  ? "border-[#00a8c6]/40 shadow-md lg:col-span-3"
                  : "border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-[#00a8c6]/30 hover:shadow-md"
                  }`}
              >
                {serviceImage && (
                  <div className="service-image">
                    <img
                      src={serviceImage}
                      alt={service.serviceName}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    toggleService(service.serviceId)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full min-w-0 items-center gap-3 p-4 text-left sm:gap-4 sm:p-6"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition sm:h-14 sm:w-14 sm:text-2xl ${isOpen
                      ? "bg-[#00a8c6] text-white"
                      : "bg-[#00a8c6]/10"
                      }`}
                  >
                    {emoji}
                  </div>

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

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${isOpen
                      ? "bg-[#00a8c6]/10 text-[#00a8c6]"
                      : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100">
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-7">

                      {/* ========================= */}
                      {/* M I S A S                 */}
                      {/* Agrupadas por lugar       */}
                      {/* ========================= */}

                      {isMass ? (
                        <div className="space-y-6 pt-2">
                          {massPlaceGroups.map(
                            (placeGroup) => {
                              const place =
                                parishData.places.find(
                                  (item) =>
                                    item.placeId ===
                                    placeGroup.placeId
                                );

                              return (
                                <div
                                  key={
                                    placeGroup.placeId
                                  }
                                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60"
                                >
                                  <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#00a8c6] sm:text-[11px]">
                                      Lugar
                                    </p>

                                    <h3 className="mt-1 break-words text-base font-bold text-slate-900 sm:text-lg">
                                      {place?.placeName ??
                                        "Lugar no especificado"}
                                    </h3>
                                  </div>

                                  <div className="divide-y divide-slate-200">
                                    {placeGroup.schedules.map(
                                      (
                                        schedule,
                                        index
                                      ) => (
                                        <div
                                          key={`${service.serviceId}-${placeGroup.placeId}-${index}`}
                                          className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:px-5 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-5"
                                        >
                                          <div className="min-w-0">
                                            <p className="break-words text-sm font-semibold leading-5 text-slate-800">
                                              {formatDays(
                                                schedule.days
                                              )}
                                            </p>

                                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                              Horario de la
                                              celebración
                                            </p>
                                          </div>

                                          <div className="flex flex-col gap-2 lg:items-end">
                                            <p className="text-sm font-semibold leading-5 text-slate-900 sm:text-base lg:whitespace-nowrap">
                                              {
                                                schedule.startHour
                                              }

                                              {schedule.endHour && (
                                                <>
                                                  {" "}
                                                  –{" "}
                                                  {
                                                    schedule.endHour
                                                  }
                                                </>
                                              )}
                                            </p>

                                            {schedule.choir && (

                                              <Link
                                                to={`/choir-songs/${schedule.serviceHourIds[0]}`}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#00a8c6]/30 bg-[#00a8c6]/5 px-3 py-1.5 text-xs font-semibold text-[#008da5] transition hover:border-[#00a8c6]/50 hover:bg-[#00a8c6]/10"
                                              >
                                                <Music2 size={15} aria-hidden="true" />

                                                <span>
                                                  Ver cantos
                                                  de la misa
                                                </span>
                                              </Link>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        /* ========================= */
                        /* OTROS SERVICIOS           */
                        /* ========================= */

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

                                  <div className="flex flex-col gap-2 lg:items-end">
                                    <p className="text-sm font-semibold leading-5 text-slate-900 sm:text-base lg:whitespace-nowrap">
                                      {schedule.startHour}

                                      {schedule.endHour && (
                                        <>
                                          {" "}
                                          –{" "}
                                          {
                                            schedule.endHour
                                          }
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>

                    {/* ========================= */}
                    {/* GUÍA DE CONFESIÓN          */}
                    {/* ========================= */}

                    {isConfession && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-5 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              ¿Quieres prepararte para la Confesión?
                            </p>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              Consulta nuestra guía para prepararte
                              y realizar una buena Confesión.
                            </p>
                          </div>

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