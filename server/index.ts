import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

const PORT = 3001;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// ============================================================
// GEMINI
// ============================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("");
  console.error("❌ ERROR: Falta GEMINI_API_KEY");
  console.error("");
  console.error("Revisa tu archivo .env");
  console.error("");

  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
});

// ============================================================
// GENERAR RESPUESTA CON REINTENTOS
// ============================================================

async function generateWithRetry(prompt: string, maxRetries = 4) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Gemini - intento ${attempt + 1}/${maxRetries + 1}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      console.log("✅ Gemini respondió correctamente");

      return response;
    } catch (error) {
      lastError = error;

      const message = error instanceof Error ? error.message : String(error);

      console.error(`❌ Error Gemini: ${message}`);

      // ------------------------------------------------------
      // Detectar errores temporales
      // ------------------------------------------------------

      const isTemporaryError =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("408") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("504");

      // Si no es temporal, no tiene sentido reintentar
      if (!isTemporaryError) {
        throw error;
      }

      // Ya no quedan intentos
      if (attempt >= maxRetries) {
        throw error;
      }

      // ------------------------------------------------------
      // BACKOFF EXPONENCIAL
      // ------------------------------------------------------

      const delay = Math.pow(2, attempt) * 2000;

      console.log(
        `⏳ Esperando ${delay / 1000} segundos antes de reintentar...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "song-finder",
    message: "Backend funcionando correctamente",
  });
});

// ============================================================
// BUSCAR / ANALIZAR CANTO
// ============================================================

app.post("/api/song-search", async (req, res) => {
  try {
    // ------------------------------------------------------
    // OBTENER NOMBRE DEL CANTO
    // ------------------------------------------------------

    const songName =
      typeof req.body?.songName === "string" ? req.body.songName.trim() : "";

    if (!songName) {
      return res.status(400).json({
        ok: false,
        error: "Debes escribir el nombre del canto.",
      });
    }

    console.log("");
    console.log("========================================");
    console.log("🎵 SONG FINDER");
    console.log("========================================");
    console.log(`🔎 Canto: ${songName}`);
    console.log("");

    // ------------------------------------------------------
    // PROMPT
    // ------------------------------------------------------

    const prompt = `
Eres un asistente especializado en
cantos religiosos, litúrgicos y música
católica.

El usuario quiere investigar este canto:

"${songName}"

Tu trabajo es analizar la información que
conoces y devolverla organizada.

Devuelve exactamente estas secciones:
Script:
DECLARE @Content NVARCHAR(MAX) = N'
Contenido del canto
';

EXEC dbo.usp_InsertSong
    @SongName = 'Nombre del canto',
    @SongChord = 'Acorde de la canción',
    @CapoTasto = NULL,
    @AuthorFullName = 'Autor del canto',
    @PerformerFullName = 'Grupo Getsemaní',
    @SongTypes = 'Clasificacion',
    @SongContent = @Content,
    @SongMetric = '4/4',
    @CreatedBy = 'Grupo Getsemaní';


TÍTULO:
[Nombre exacto o Desconocido]

AUTOR:
[Autor o Desconocido]

INTÉRPRETE:
[Intérprete, grupo o Desconocido]

TONALIDAD:
[Tonalidad o Desconocido]

CAPO:
[Capo o NULL]

MÉTRICA:
[Métrica o Desconocido]


CONTEXTO:
[Contexto religioso o litúrgico]

CONTENIDO:
[Letra/contenido y acordes encima y melodía  disponible]

FUENTES:
[Fuentes conocidas]

REGLAS IMPORTANTES:

1. No inventes información.

2. No inventes autores.

3. No inventes intérpretes.

4. No inventes tonalidades.

5. No inventes acordes.

6. Si no conoces un dato,
   escribe "Desconocido".

7. Si no conoces el capo,
   escribe "NULL".

8. No inventes URLs.

9. No afirmes que consultaste Internet.

10. No generes SQL todavía.

11. El resultado será revisado
    manualmente por el usuario.
12. Dentro del contenido si recuperas la Armonia vas a poner al inicio de cada línea H.- y luego los acordes de esa linea
13. Dentro del contenido si recuperas la Letra vas a poner al inicio de cada línea L.- y luego los letra de esa linea
14. Dentro del contenido si recuperas la Melodía vas a poner al inicio de cada línea M.- y luego los notas musicales de esa linea
15. Dentro del contenido en la primer línea de cada letra o seccion. Si corresponde al coro pondras C. si corresponde a un verso pone numero de verso., I. Intro, P. Preludio, PC, Precoro, F.Final
16. No inventes letras o mezcles cantos.

IMPORTANTE:

Esta solicitud NO utiliza Google Search
ni ninguna herramienta de búsqueda web.

No digas que verificaste una fuente
si realmente no tienes esa información.
`;

    // ------------------------------------------------------
    // LLAMAR A GEMINI
    // ------------------------------------------------------

    const response = await generateWithRetry(prompt);

    // ------------------------------------------------------
    // RESULTADO
    // ------------------------------------------------------

    const result = response.text?.trim() || "";

    if (!result) {
      return res.status(500).json({
        ok: false,
        error: "Gemini no devolvió contenido.",
      });
    }

    console.log("");
    console.log("✅ Procesamiento terminado");
    console.log("");

    // ------------------------------------------------------
    // RESPUESTA A REACT
    // ------------------------------------------------------

    return res.json({
      ok: true,
      songName,
      result,
      sources: [],
    });
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("❌ ERROR EN SONG FINDER");
    console.error("========================================");

    console.error(error);

    const message = error instanceof Error ? error.message : String(error);

    // ------------------------------------------------------
    // MENSAJE AMIGABLE PARA 503
    // ------------------------------------------------------

    if (message.includes("503") || message.includes("UNAVAILABLE")) {
      return res.status(503).json({
        ok: false,
        error:
          "Gemini está temporalmente saturado. El servidor realizó varios intentos y no pudo completar la solicitud. Intenta nuevamente en unos minutos.",
      });
    }

    // ------------------------------------------------------
    // MENSAJE PARA 429
    // ------------------------------------------------------

    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        ok: false,
        error:
          "Se alcanzó el límite de uso disponible de Gemini. Revisa la cuota de tu proyecto e inténtalo nuevamente cuando se restablezca.",
      });
    }

    // ------------------------------------------------------
    // ERROR GENERAL
    // ------------------------------------------------------

    return res.status(500).json({
      ok: false,
      error: message,
    });
  }
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("🎵 SONG FINDER API");
  console.log("========================================");
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
  console.log("");
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log("");
  console.log("Esperando búsquedas...");
  console.log("========================================");
  console.log("");
});
