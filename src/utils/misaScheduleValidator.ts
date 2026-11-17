import { parishData } from "@/services/parishData";

const DAY_MAP: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miércoles: 3,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sábado: 6,
  sabado: 6,
};

function parseHourToMinutes(hourStr: string): number | null {
  const clean = hourStr.trim().toLowerCase();
  const match = clean.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function detectActiveMisaPlace(modoPrueba = false) {
  const places = parishData.places || [];

  if (modoPrueba) {
    const defaultPlace = places[0];
    return {
      disponible: true,
      placeId: defaultPlace?.placeId ?? 1,
      placeName:
        defaultPlace?.placeName || "Parroquia Nuestra Señora de los Ángeles",
      horaMisa: "Modo Prueba",
      horariosHoy: ["Modo prueba activo"],
    };
  }

  const nowStr = new Date().toLocaleString("en-US", {
    timeZone: "America/Mexico_City",
  });
  const now = new Date(nowStr);
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const misaService = parishData.services.find((s) =>
    s.serviceName.toLowerCase().includes("misa"),
  );

  if (!misaService || !misaService.schedules) {
    return {
      disponible: false,
      placeId: null,
      placeName: "",
      horaMisa: "",
      horariosHoy: [],
    };
  }

  let currentDayName = "";
  const horariosHoy: string[] = [];

  for (const sched of misaService.schedules) {
    if (sched.dayName?.trim()) {
      currentDayName = sched.dayName.trim().toLowerCase();
    }

    const matchesToday =
      currentDayName.includes("todos") ||
      (currentDayName.includes("lunes a viernes") &&
        currentDay >= 1 &&
        currentDay <= 5) ||
      DAY_MAP[currentDayName] === currentDay;

    if (matchesToday) {
      const placeObj = places.find((p) => p.placeId === sched.placeId);
      const placeLabel = placeObj?.placeName || "Parroquia";
      horariosHoy.push(`${sched.startHour} (${placeLabel})`);

      const misaMins = parseHourToMinutes(sched.startHour);
      if (misaMins !== null) {
        // Ventana: 30 minutos antes hasta 10 minutos después
        if (
          currentMinutes >= misaMins - 30 &&
          currentMinutes <= misaMins + 10
        ) {
          return {
            disponible: true,
            placeId: sched.placeId,
            placeName: placeLabel,
            horaMisa: sched.startHour,
            horariosHoy,
          };
        }
      }
    }
  }

  return {
    disponible: false,
    placeId: null,
    placeName: "",
    horaMisa: "",
    horariosHoy,
  };
}
