import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Question = {
  id: string;
  text: string;
};

type Section = {
  title: string;
  questions: Question[];
};

const examinationSections: Section[] = [
  {
    title: "Fe",
    questions: [
      {
        id: "fe1",
        text: "¿He tomado el nombre del Señor en vano?",
      },
      {
        id: "fe2",
        text: "¿He faltado a Misa un domingo o en días santos?",
      },
      {
        id: "fe3",
        text: "¿He dejado de orar?",
      },
    ],
  },
  {
    title: "Sobriedad",
    questions: [
      {
        id: "so1",
        text: "¿Me he emborrachado?",
      },
      {
        id: "so2",
        text: "¿He consumido drogas?",
      },
      {
        id: "so3",
        text: "¿He gastado dinero frívolamente?",
      },
    ],
  },
  {
    title: "Castidad",
    questions: [
      {
        id: "ca1",
        text: "¿He mirado imágenes o contenido impuro?",
      },
      {
        id: "ca2",
        text: "¿He tenido pensamientos impuros?",
      },
      {
        id: "ca3",
        text: "¿He tenido relaciones sexuales fuera del matrimonio?",
      },
    ],
  },
  {
    title: "Excelencia",
    questions: [
      {
        id: "ex1",
        text: "¿He hecho trampa o mentido?",
      },
      {
        id: "ex2",
        text: "¿He deshonrado a mis padres?",
      },
      {
        id: "ex3",
        text: "¿He robado o lastimado a alguien?",
      },
    ],
  },
];

function PreparationBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-1 sm:px-4">
      <h2 className="border-b border-[#00a8c6]/30 pb-3 text-xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function ConfessionGuide() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* ENCABEZADO */}
      <section className="bg-[#00a8c6]">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white"
          >
            <ArrowLeft size={17} />
            Volver a Servicios parroquiales
          </Link>

          <div className="mt-7">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Sacramento de la Reconciliación
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Guía para una Buena Confesión
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 sm:text-base">
              Una ayuda para prepararte adecuadamente para recibir
              el sacramento de la Reconciliación.
            </p>

          </div>
        </div>
      </section>


      {/* CONTENIDO PRINCIPAL */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">

        {/* PREPARACIÓN */}
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">

          <PreparationBlock title="Oración antes de la confesión">
            <p>
              Pide a Dios que te ayude a confesarte bien mientras
              esperas tu turno.
            </p>

            <blockquote className="mt-5 border-l-4 border-[#00a8c6] pl-5 italic text-slate-700">
              Ven, Espíritu Santo. Ilumina mi mente para que sepa
              los pecados que debo confesar, y concédeme la gracia
              de confesarlos plena, humildemente y con un corazón
              contrito. Por favor ayúdame a resolver esto con firmeza
              para no volver a cometerlos. Amén.
            </blockquote>
          </PreparationBlock>


          <PreparationBlock title="Preparándose bien">
            <p>
              Después de orar pidiendo la ayuda de Dios para hacer
              una buena Confesión, busca cooperar con Su gracia
              examinando tu conciencia.
            </p>

            <p className="mt-4">
              Al examinar tu conciencia, recuerda lo siguiente:
              cantidad y tipo, y distingue entre pecados mortales
              y veniales.
            </p>
          </PreparationBlock>


          <PreparationBlock title="Acto de contrición">
            <blockquote className="border-l-4 border-[#00a8c6] pl-5 italic text-slate-700">
              Señor Jesucristo, Hijo del Dios vivo, ten piedad de mí,
              soy pecador. Dios mío, me arrepiento de todo corazón de
              mis pecados. Con tu ayuda, pretendo hacer penitencia,
              no pecar más y evitar todo lo que me lleve a pecar.
            </blockquote>
          </PreparationBlock>

        </div>


        {/* SEPARADOR */}
        <div className="my-12 border-t border-slate-200" />


        {/* EXAMEN DE CONCIENCIA */}
        <section>

          <div className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a8c6]">
              Reflexión personal
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Examen de Conciencia
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Lee cada pregunta con calma y responde sinceramente
              en tu interior. Este examen busca ayudarte a reconocer
              aquello que necesitas presentar ante Dios.
            </p>

          </div>


          {/* CATEGORÍAS */}
          <div className="grid gap-6 lg:grid-cols-2">

            {examinationSections.map((section) => (

              <fieldset
                key={section.title}
                className="border-t-4 border-[#00a8c6] bg-white shadow-sm"
              >

                <legend className="px-5 pt-5 text-xl font-bold text-slate-900">
                  {section.title}
                </legend>

                <div className="mt-2">

                  {section.questions.map((question) => (

                    <div
                      key={question.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-slate-100 px-5 py-4"
                    >

                      <label
                        htmlFor={`${question.id}-si`}
                        className="text-sm leading-6 text-slate-700 sm:text-base"
                      >
                        {question.text}
                      </label>

                      <div className="flex shrink-0 gap-2">

                        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                          <input
                            id={`${question.id}-si`}
                            type="radio"
                            name={question.id}
                            value="si"
                            className="accent-[#00a8c6]"
                          />
                          Sí
                        </label>

                        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                          <input
                            id={`${question.id}-no`}
                            type="radio"
                            name={question.id}
                            value="no"
                            className="accent-[#00a8c6]"
                          />
                          No
                        </label>

                      </div>

                    </div>

                  ))}

                </div>

              </fieldset>

            ))}

          </div>

        </section>


        {/* REGRESAR */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00a8c6] hover:text-[#008da5] hover:underline"
          >
            <ArrowLeft size={17} />
            Volver a Servicios parroquiales
          </Link>

        </div>

      </section>

    </main>
  );
}